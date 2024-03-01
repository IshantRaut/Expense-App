const User = require('../models/user');
const uuid = require('uuid');
const reqPasswords = require('../models/forgotPasswordReq');



//when user clicks on request password reset butoon
exports.reqPasswordReset = async(req, res,next) => {
    let email = req.body.email
    const user = await User.findOne({where:{email}});
    const userId = user.dataValues.id;

try{
    if(user){
        const id = uuid.v4();
        reqPasswords.create({id:id,userId:userId,isactive:true})
        .then(response=>{            
            res.status(200).json({message:"link has been sent to email id"})
            //password reset link is send to user email id
        })      
        .catch(err=>{
            throw new Error(err)
        })
    }
    else {
        throw new Error('User doesnt exist')
    }
}
catch{
    console.error(err)
    return res.json({ message: err, success: false });
}
}



/*when user click on password reset link....first we check that the uuid is present
  in database or not and if it present we send a "new password" html form
*/
exports.resetpassword = async(req, res,next) => {
   const id =  req.params.id;
   const forgotpasswordrequest=await reqPasswords.findOne({ where : { id }})
   .catch(err=>res.status(400).res.send(err=>res.status(400).res.send(err)));

   if(forgotpasswordrequest!=null){
            forgotpasswordrequest.update({ isactive: false});
            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`)        

    }
    else if(forgotpasswordrequest===null){
        res.status(400).send('invalid link');
    }
}


//when user click on reset password button after entering the new password
exports.updatepassword = async(req, res, next)=>{

    const resetPasswordId = req.params.resetpasswordid;
    const newPassword = req.query.newpassword

    const request = await reqPasswords.findOne({where:{id:resetPasswordId}});
    if(request!=null){
        let userId = request.userId;
        console.log(newPassword)

        //encrypt the password before it into database
        bcrypt.hash(newPassword, 10, function(err, hash) {
            if(err){
                console.log(err);
                throw new Error(err);
            }
            User.update({ password: hash },{where:{id:userId}})
            .then(() => {
                res.status(201).json({message: 'Successfuly updated the new password'})
            })})
    }

    else if(request===null){
        res.status(404).send({ error: 'No user Exists', success: false});
    }
}
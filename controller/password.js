const User = require('../models/user');
const uuid = require('uuid');
const reqPasswords = require('../models/forgotPasswordReq');




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
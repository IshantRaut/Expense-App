window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('email').value = "";
    document.getElementById("pwd").value = "";
 });

 
let login = document.getElementById('login');
login.addEventListener('click',loginFunction);


function loginFunction(event){
event.preventDefault();
    let validation = 0;
    let email = document.getElementById('email').value;
    let password = document.getElementById('pwd').value;
    let error = document.getElementById('not_matched');

    if(validation!=2){
        let empty_email = document.getElementById('empty_email');
        let empty_pwd = document.getElementById('empty_pwd');

        //if email id empty
        if(email==''){
        empty_email.style.visibility = "visible"
        }   
        else{empty_email.style.visibility = "hidden";
        validation++;
        }

        //if password is empty
        if(password==''){
        empty_pwd.style.visibility = 'visible';
        }
        else if(password.length<8){
        empty_pwd.textContent = "Password must be 8-16 characters in length"
        empty_pwd.style.visibility = 'visible';
        }
        else{empty_pwd.style.visibility = "hidden";
        validation++;
        }
    }

    if(validation==2){
    let credential = {
        email: email,
        password:password
    }

axios.post('http://localhost:3000/login',credential)
.then(res=>{
    error.style.visibility = "hidden";
    localStorage.setItem('token',res.data.token);
    window.location.href = "../views/expense.html"; 
    })
.catch(err=> {
    error.style.visibility = "visible";
    console.log(err.response.data)
}) 
}
}
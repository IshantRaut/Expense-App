const btn = document.getElementById("signup");

btn.addEventListener("click", (e) =>{
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    axios.post("/user/signup",{
        username:username,
        email:email,
        password:password,
    })
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    });
});

const login = document.getElementById("gotologin");

login.addEventListener("click",(e)=>{
    window.location.href ="/user/login";
});
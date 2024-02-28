document.getElementById("reset_password").addEventListener('click',reset);

function reset(event){
    event.preventDefault();
    axios.get('http://localhost:3000/password/forgotpassword')
}
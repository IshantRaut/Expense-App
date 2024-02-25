window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('name').value = "";
  document.getElementById('email').value = "";
  document.getElementById("pwd").value = "";
  document.getElementById("rpwd").value = "";
});


var submit = document.getElementById("submit");
submit.addEventListener('click', signup);

function signup(event) {
  event.preventDefault();
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById("pwd").value;
  let repeat_password = document.getElementById("rpwd").value;

  let validation = 0;
  if (validation != 4) {
      document.getElementById('check').style.visibility = "hidden"

      //validation for name
      if (name == "") { document.getElementById('empty_name').style.visibility = "visible" }
      else {
          document.getElementById('empty_name').style.visibility = "hidden"
          validation++;
      }

      //validation for email
      if (email == "") { document.getElementById('empty_email').style.visibility = "visible" }
      else {
          document.getElementById('empty_email').style.visibility = "hidden"
          validation++;
      }
      //validation for password
      if (password == "") { document.getElementById('empty_pwd').style.visibility = "visible" }
      else {
          document.getElementById('empty_pwd').style.visibility = "hidden"
          validation++
      }

      //validation for repeat password
      if (repeat_password == "") {
          document.getElementById('empty_rpwd').textContent = '*required field';
          document.getElementById('empty_rpwd').style.visibility = "visible"
      }
      else {
          document.getElementById('empty_rpwd').style.visibility = "hidden"
          validation++;
      }

  }

  //validation if both the passwords matches
  if (validation == 4) {
      if (password != repeat_password) {
          document.getElementById('empty_rpwd').textContent = 'Passwords do not match!';
          document.getElementById('empty_rpwd').style.visibility = "visible";
      }
      else {
          document.getElementById('empty_rpwd').style.visibility = "hidden"
          validation++;
      }

  //validation for check box
  if (validation == 5) {
      if (document.getElementById('checkbox').checked == false)
         {document.getElementById('check').style.visibility = "visible" }
      else {
          document.getElementById('check').style.visibility = "hidden"
          validation++;
          }
      }

  if (validation == 6) {
      let success = document.getElementById('registration_successful');
      let already_exist = document.getElementById('already_exist');

      let user = {
          name: name,
          email: email,
          password: password
          }

      already_exist.style.visibility = "hidden"
      success.style.visibility = "hidden"

      axios.post('http://localhost:3000/adduser', user)
      .then(res => {
          success.style.visibility = "visible"
          setTimeout(() => {
          success.style.visibility = "hidden"
          }, 2000)
      })
      .catch(err => {
          if (err.response.data == "already_exist") {
          already_exist.style.visibility = "visible"

          setTimeout(() => {
          already_exist.style.visibility = "hidden"}, 2000)
          }

          else { console.log(err.response)}
          })
      }
  }
}
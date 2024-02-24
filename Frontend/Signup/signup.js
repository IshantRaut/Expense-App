const error = document.getElementById("error");

async function showHandler(e) {
  e.preventDefault();
  try {
    const obj = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
    };

    const user = await axios.post("http://localhost:3000/user/signup", obj, {
      headers: {
        "content-type": "application/json",
      },
    });
    if (user.status === 201) {
      window.location.href = "http://127.0.0.1:3000/Login/login.html";
    }
  } catch (e) {
    // console.log(e);
    error.innerHTML = e.response.data.msg;
  }
}

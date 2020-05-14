function loginUser(event) {
  event.preventDefault();

  const loginType = document.activeElement.name;
  console.log(loginType + "button pressed");

  const name = document.querySelector("[name='username-in']").value;
  const password = document.querySelector("[name='password-in']").value;

  let passMasked = '';
  for (let i = 0; i < password.length; i++) {passMasked += "*";}
  console.log("username: " + name + ", password: " + passMasked);

  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  if (userList.length == 0) {
      console.log("no users found in local storage");
  }

  if (loginType == "login") {
       
     // Check if user is found in storage.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {

      // User found, check password.
      if (userList[i].password == password) {
        console.log("user authentication successful");
          window.location.href = "boards.html";
          return;
        } else {
          console.log("user authentication failed: invalid password");
          // TODO: output error message in feedback div
        }
      
      }
    }
    console.log("couldn't find user " + name + " in storage");
    // TODO: output error message in feedback div

  } else {

      // Add user to storage
      const id = 0;
      const user = {id, name, password};
      userList.push(user);
      window.localStorage.setItem("userList", JSON.stringify(userList));

      console.log("user added to storage");
      // TODO: output feedback message
  }
}
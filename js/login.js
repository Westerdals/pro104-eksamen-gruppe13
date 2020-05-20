function loginUser(event) {
  event.preventDefault();

  const loginType = document.activeElement.name;

  const nameFbDiv = document.getElementById("username-feedback-div");
  const passFbDiv = document.getElementById("password-feedback-div");
  const subFbDiv  = document.getElementById("submit-feedback-div");

  const name     = document.querySelector("[name='username-in']").value.toLowerCase();
  const password = document.querySelector("[name='password-in']").value;
  
  // Clear feedback div's in case they have existing content.
  nameFbDiv.innerHTML = "";
  passFbDiv.innerHTML = "";
  subFbDiv.innerHTML  = "";
  
  // Validate name and password.
  if (invFormFb(name, 1, true, "Username", nameFbDiv)
   || invFormFb(password, 1, false, "Password", passFbDiv)) {
    return;
  }

  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];

  if (loginType == "login") {
       
     // Check if user is found in storage.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {

        // User found, check password.
        if (userList[i].password == password) {
          console.log("user authentication successful");

          loginAnimation()
          
          // Check if user has a valid lastBoardId value set.
          /*if (userList[i].lastBoardId > -1) {
            window.location.href = "index.html?" + i;
          } else {*/

          window.setTimeout(function(){

        // Move to a new location or you can do something else
        window.location.href =  "boards.html?" + i;

    }, 3000);
          //}
        } else {
          console.log("User authentication failed: invalid password");
          passFbDiv.innerHTML = "Invalid password";
        }
        return;
      }
    }
    console.log("Couldn't find user " + name + " in storage");
    subFbDiv.innerHTML = "User not found";

  } else {

    // Add user to storage

    // First check that the user doesn't already exists.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {
          console.log("User " + name + " already in storage");
          subFbDiv.innerHTML = "Username already exists";
          return;
      }
    }

    const lastBoardId = -1;
    const user = {name, password, lastBoardId};
    userList.push(user);
    window.localStorage.setItem("userList", JSON.stringify(userList));

    console.log("User " + name + " added to storage with id " + userList.length);
    subFbDiv.innerHTML = "User created successfully";
  }
}


function loginAnimation() {
  var loginBody = document.getElementsByTagName("body");
  var loginForm = document.getElementById("login-form");
  var loginHeader = document.getElementsByTagName("header");

  loginBody[0].className = "loginAnimation";
  loginForm.className = "loginOpacityAnimation";
  loginHeader[0].className = "loginFadeOutLogo";
}
function loginUser(event) {
  event.preventDefault();

  const loginType = document.activeElement.name;

  const usernameFeedbackDiv = document.getElementById("username-feedback-div");
  const passwordFeedbackDiv = document.getElementById("password-feedback-div");
  const submitFeedbackDiv   = document.getElementById("submit-feedback-div");

  const name     = document.querySelector("[name='username-in']").value.toLowerCase();
  const password = document.querySelector("[name='password-in']").value;

  // Validate name and password.
  if (!hasValidForm(name, "Username", 1, true))      {return;}
  if (!hasValidForm(password, "Password", 1, false)) {return;}

  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];

  if (loginType == "login") {
       
     // Check if user is found in storage.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {

        // User found, check password.
        if (userList[i].password == password) {
          console.log("user authentication successful");
          
          // Check if user has a valid lastBoardId value set.
          const urlParam = "?" + encodeURIComponent(userList[i].id);
          if (userList[i].lastBoardId > -1) {
            window.location.href = "index.html" + urlParam;
          } else {
            window.location.href = "boards.html" + urlParam;
          }
        } else {
          console.log("User authentication failed: invalid password");
          passwordFeedbackDiv.innerHTML = "Invalid password.";
        }
        return;
      }
    }
    console.log("Couldn't find user " + name + " in storage");
    submitFeedbackDiv.innerHTML = "User not found.";

  } else {

    // Add user to storage

    // First check that the user doesn't already exists.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {
          console.log("User " + name + " already in storage");
          submitFeedbackDiv.innerHTML = "Username already exists.";
          return;
      }
    }

    const id = getUniqueListId(userList);
    const lastBoardId = -1;
    const user = {id, name, password, lastBoardId};
    userList.push(user);
    window.localStorage.setItem("userList", JSON.stringify(userList));

    console.log("User " + name + " added to storage with id " + id);
    submitFeedbackDiv.innerHTML = "User created successfully.";
  }
}
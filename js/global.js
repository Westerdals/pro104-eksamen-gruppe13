function loginUser(event) {
  event.preventDefault();

  const loginType = document.activeElement.name;
  //console.log(loginType + " button pressed");

  const name = document.querySelector("[name='username-in']").value.toLowerCase();
  const password = document.querySelector("[name='password-in']").value;

  if (name.length < 1) {
      console.log("Invalid username, must be at least 1 characters.");
      return;
  }
  if (password.length < 1) {
    console.log("Invalid password, must be at least 1 characters.");
    return;
  }

  //let passMasked = '';
  //for (let i = 0; i < password.length; i++) {passMasked += "*";}
  //console.log("username: " + name + ", password: " + passMasked);

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
          if (userList[i].lastBoardId > 0) {
            window.location.href = "index.html" + urlParam;
          } else {
            window.location.href = "boards.html" + urlParam;
          }
          return;
        } else {
          console.log("User authentication failed: invalid password");
          // TODO: output error message in feedback div
        }
      
      }
    }
    console.log("Couldn't find user " + name + " in storage");
    // TODO: output error message in feedback div

  } else {

    // Add user to storage

    // First check that the user doesn't already exists.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name == name) {
          console.log("User " + name + " already in storage");
          // TODO: output feedback message
          return;
      }
    }

    const id = getUniqueListId(userList);
    const lastBoardId = 0;
    const user = {id, name, password, lastBoardId};
    userList.push(user);
    window.localStorage.setItem("userList", JSON.stringify(userList));

    console.log("User " + name + " added to storage with id " + id);
    // TODO: output feedback message
  }
}

function printUserId() {
  var s = window.location.search;
  alert(s.substring(1, s.length));
}

function showNewBoardDiv() {
  var overlayDiv   = document.getElementById("new-board-overlay");
  var containerDiv = document.getElementById("new-board-container");
  overlayDiv.style.display = "block";
  containerDiv.style.display = "block";
}

function hideNewBoardDiv() {
  var overlayDiv   = document.getElementById("new-board-overlay");
  var containerDiv = document.getElementById("new-board-container");
  overlayDiv.style.display = "none";
  containerDiv.style.display = "none";
}

function createNewBoard() {
  alert("Work in progress!");
}

function getUniqueListId(listName) {

    const list = JSON.parse(window.localStorage.getItem(listName));
    
    if (list == undefined) {
        return 1;
    }
    
    let usedIds = [];
    for (const entry of list) {
        console.log("usedIds["+entry.id+"] = true");
        usedIds[entry.id] = true;
    }
    
    let id = 1;
    do {
    } while (usedIds[++id] == true);

    return id;
}
/**
 * 
 */
window.onload = function() {

  const userId = getUserId();

  const feedbackDiv = document.getElementById("board-feedback-div");
  const createLi    = document.getElementById("create-li");
  const loginA      = document.getElementById("login-a");
  const boardsUl    = document.getElementById("board-ul");
  
  // Get board and user list from local storage.
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Verify that the user is logged in properly.
  if (userList.length == 0 || typeof(userList[userId]) === undefined || userId == '') {

    feedbackDiv.innerHTML = "You must be logged in to access and create boards.";
    createLi.style.display = "none";
    loginA.innerHTML = "Log In";

    /*alert("You must be logged in as a user in order to create a board.");
    window.location.href = "login.html"; //redirect to login page*/
  }
  
  // Loops through all boards the user is a member of.
  let count = 0;
  for (let i = 0; i < boardList.length; i++) {
    let board = boardList[i];
    let userIds = board.userIds;
    for (let j = 0; j < userIds.length; j++) {
      if (userIds[j] == userId) {
        count++;

        // Creates and appends a new clickable list element.
        let li = document.createElement("li");
        li.className = "rounded";
        li.innerHTML = board.title;
        li.onclick = function(){ selectBoard(i, userId); }
        boardsUl.insertBefore(li, createLi);
        //boardsUl.appendChild(li);
        continue;
      }
    }
  }

  loadAnimation();
  console.log(count + " board elements found");
};

function selectBoard(boardId, userId) {
  console.log("boardId " + boardId + " selected");

  // Fetch and store the selected board's id in userList.
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  userList[userId].lastBoardId = boardId;
  window.localStorage.setItem("userList", JSON.stringify(userList));
  
  // Redirect to the main page.
  window.location.href = "index.html?" + userId;
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

/**
 * Close the Create new board window if 'escape' is pressed.
 */
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        hideNewBoardDiv();
    }
};

function createNewBoard(inputIdTag) {
  const userId = getUserId();
  const title = document.getElementById(inputIdTag).value;
  const titleFbDiv = document.getElementById("title-feedback-div");

  // Get board and user list from local storage
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Check length and characters of the input string.
  if (invFormFb(title, 1, true, "Title", titleFbDiv)) {
    return;
  }

  const userName = userList[userId].name;

  // Checking that the user doesn't already have a board with the same title.
  /*for (let i = 0; i < boardList.length; i++) {
    const boardOwnerId = boardList[i].userIds[0];
    if (boardOwnerId == userId && boardList[i] == title) {
      alert("Board title " + title + " already exist for user " + userName + ".");
      return;
    }
  }*/
  
  // Creating the new board and adds it to the list.
  createBoard(userId, title, getDefaultColumns(), getDefaultTasks());

  /*const boardId = boardList.length;
  const userIds = [userId]; // current members (user ids) of the board
  const columns = getDefaultColumns(); // column list
  const tasks   = getDefaultTasks(); // task list
  const board = {userIds, title, columns, tasks};
  boardList.push(board);
  
  // Setting the board as the users last active board.
  userList[userId].lastBoardId = boardId;

  // Storing board and user data in local storage.
  window.localStorage.setItem("boardList", JSON.stringify(boardList));
  window.localStorage.setItem("userList", JSON.stringify(userList));
  console.log("Storing board with title " + title + " (id=" + boardId + ") for user " + userName + " (id=" + userId + ").");*/
  
  // Redirect to the main page.
  window.location.href = "index.html?" + userId;
}


/* Animations when loading the page */
function loadAnimation(){
  var body = document.getElementsByTagName("body");

  body[0].className = "changeBackgroundColor";
}
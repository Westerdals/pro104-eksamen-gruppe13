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
  
  // Loops through all boards that belong to the current user.
  let count = 0;
  for (let i = 0; i < boardList.length; i++) {
    let board = boardList[i];
    if (board.userIds[0] == userId) {
      count++;

      // Creates and appends a new clickable list element.
      let li = document.createElement("li");
      li.className = "rounded";
      li.innerHTML = board.title;
      li.onclick = function(){ selectBoard(i, userId); }
      boardsUl.insertBefore(li, createLi);
      //boardsUl.appendChild(li);
    }
  }
  console.log(count + " board elements created");
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
  const boardId = boardList.length;

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
  console.log("Storing board with title " + title + " (id=" + boardId + ") for user " + userName + " (id=" + userId + ").");
  
  // Redirect to the main page.
  window.location.href = "index.html?" + userId;
}

/**
 * Default columns in a new board.
 */
function getDefaultColumns() {
  return [
    {
      title: "Todo",
      taskIds: [0] // refers to its index value
    },
    {
      title: "Doing",
      taskIds: []
    },
    {
      title: "Done",
      taskIds: [1, 2]
    }
  ];
}

/**
 * Default tasks in a new board.
 */
function getDefaultTasks() {
  return [
    {
      title: "Task #1",
      description: "",
      deadline: "",
      memberIds: [] // assigned members
    },
    {
      title: "Task #2",
      description: "",
      deadline: "",
      memberIds: []
    },
    {
      title: "Task #3",
      description: "",
      deadline: "",
      memberIds: []
    },
  ];
}
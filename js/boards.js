
window.onload = function() {

  const userId = getUserId();

  const feedbackDiv = document.getElementById("board-feedback-div");
  const createLi    = document.getElementById("create-li");
  const loginA      = document.getElementById("login-a");
  const boardsUl    = document.getElementById("board-ul");
  let count = 0;
  
  // Get board and user list from local storage.
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Verify that the user is logged in properly.
  console.log(userId);
  if (userList.length == 0 || typeof(userList[userId]) === undefined || userId == '') {

    feedbackDiv.innerHTML = "You must be logged in to access and create boards.";
    createLi.style.display = "none";
    loginA.innerHTML = "Log In";

  } else {
  
    // Loops through all boards the user is a member of.
    for (let i = 0; i < boardList.length; i++) {
      let board = boardList[i];
      let userIds = board.userIds;
      for (let j = 0; j < userIds.length; j++) {
        if (userIds[j] == userId) {
          count++;

          // Creates and appends a new clickable list element.
          let li = document.createElement("li");
          li.className = "rounded";
          li.className = "tab-index";
          li.innerHTML = board.title;
          li.onclick = function(){ selectBoard(i, userId); }
          li.addEventListener('keypress', function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        selectBoard(i, userId);
      }
    });
          boardsUl.insertBefore(li, createLi);
          continue;
        }
      }
    }
  }

  setTabindexOnProperties(0); 
  loadAnimation();
  console.log(count + " board elements found");

  addEventListeners();
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

  setTabindexOnProperties(-1);
}

function hideNewBoardDiv() {
  var overlayDiv   = document.getElementById("new-board-overlay");
  var containerDiv = document.getElementById("new-board-container");
  overlayDiv.style.display = "none";
  containerDiv.style.display = "none";

  setTabindexOnProperties(0);
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
  
  // Creating the new board and adds it to the list.
  createBoard(userId, title, getDefaultColumns(), getDefaultTasks());

  // Redirect to the main page.
  window.location.href = "index.html?" + userId;
}


/* Animations when loading the page */
function loadAnimation(){
  var body = document.getElementsByTagName("body");

  body[0].className = "changeBackgroundColor";
}

/* Function to set tabindex-value to 0 or -1 */
function setTabindexOnProperties(para){
  
  var mainBoardContainer = document.querySelectorAll(".tab-index");
    
  for (let i = 0; i < mainBoardContainer.length; i++){
      
      mainBoardContainer[i].tabIndex = para
  }
  
}

function addEventListeners() {
  document.getElementById("create-li").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {showNewBoardDiv();}
  });
}
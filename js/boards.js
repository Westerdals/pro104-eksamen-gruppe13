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

function createNewBoard(inputIdTag) {
  const userId = getUserId();
  const title = document.getElementById(inputIdTag).value;

  if (title.length < 1) {
    alert("Title must contain at least one character.");
  } else if (!isAlphaNumeric(title)) {
    alert("Title can only contain letters and numbers.");
  }

  // Get board and user list from local storage
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  
  if (userList.length == 0 || userList.length < userId) {
    alert("You must be logged in as a user in order to create a board.");
    return;
  }

  const userName = userList[userId].name;

  // Checking that the user doesn't already have a board with the same title.
  for (let i = 0; i < boardList.length; i++) {
    const boardOwnerId = boardList[i].userIds[0];
    if (boardOwnerId == userId && boardList[i] == title) {
      alert("Board title " + title + " already exist for user " + userName + ".");
      return;
    }
  }
  
  // Creating the new board and adds it to the list.
  const boardId = boardList.length + 1;
  const userIds = [userId]; // current members (user ids) of the board
  const columns = []; // column list
  const board = {userIds, title, columns};
  boardList.push(board);
  
  // Setting the board as the users last active board.
  userList[userId].lastBoardId = boardId;

  // Storing board and user data in local storage.
  window.localStorage.setItem("boardList", JSON.stringify(boardList));
  window.localStorage.setItem("userList", JSON.stringify(userList));
  console.log("Storing board with title " + title + " (id=" + boardId + ") for user " + userName + " (id=" + userId + ").");
  
  // Redirect to the main page.
  const urlParam = "?" + encodeURIComponent(boardId);
  window.location.href = "index.html" + urlParam;
}

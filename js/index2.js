function setLinkParams() {
  let boardA   = document.getElementById("board-a");
  let ideasA   = document.getElementById("ideas-a");
  let membersA = document.getElementById("members-a");
  const userId = getUserId();
  
  boardA.href   = boardA.href   + "?"  + userId;
  ideasA.href   = ideasA.href   + "?"  + userId;
  membersA.href = membersA.href + "?"  + userId;
}

function loadBoardData() {

  let userId = getUserId();

  const loginA = document.getElementById("login-a");

  // Get board and user list from local storage.
  let userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  let boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Verify that the user is logged in properly.
  if (userList.length == 0 || typeof(userList[userId]) === undefined || userId == '') {

    // Creating a test user if none exists.
    if (userList.length == 0) {
      userId = 0;
      const name = "test";
      const password = "test";
      const lastBoardId = -1;
      const user = {name, password, lastBoardId};
      userList.push(user);
      window.localStorage.setItem("userList", JSON.stringify(userList));
      console.log("User " + name + " added to storage with id " + userList.length);
    }
    console.log("Injecting log in session of user " + userList[0].name);
    window.location.href = "index.html?0";

    /*feedbackDiv.innerHTML = "You must be logged in to access and create boards.";
    createLi.style.display = "none";
    loginA.innerHTML = "Log In";*/

    /*alert("You must be logged in to access this page.");
    window.location.href = "login.html"; //redirect to login page
    console.log("invalid login state");*/
    return;
  }

  // Creating a default board if none exists.
  if (userList[userId].lastBoardId == -1) {
    createBoard(userId, "testBoard", getDefaultColumns(), getDefaultTasks());
    userList = JSON.parse(window.localStorage.getItem("userList")) || [];
    boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  }

  const boardId = userList[userId].lastBoardId;
  const board = boardList[boardId];

  // Board, column and task data.
  const boardTitle = board.title;
  const columns    = board.columns;
  const tasks      = board.tasks;
  
  // Demonstration on how to extract everything.
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    // Column title.
    const columnTitle = column.title;
    //console.log("column #" + i + " title: " + columnTitle);

    let anchorP = document.getElementById("p" + i);

    for (let j = 0; j < column.taskIds.length; j++) {
      const task = tasks[column.taskIds[j]];

      // Task title, description and deadline.
      const taskTitle = task.title;
      const taskDescription = task.description;
      const taskDeadline = task.deadline;
      //console.log("task #" + j + " title: " + taskTitle + ", description: " + taskDescription + ", deadline: " + taskDeadline);

      let taskDiv  = document.createElement("div");
      let titleDiv = document.createElement("div");
      let propDiv  = document.createElement("div");
      let arrowDiv = document.createElement("div");
      let leftDiv  = document.createElement("div");
      let rightDiv = document.createElement("div");
      let dateDiv  = document.createElement("div");
      let descDiv  = document.createElement("div");

      taskDiv.className = "rounded color task"
      taskDiv.style.position = "relative";
      taskDiv.style.margin = "5px";
      taskDiv.style.zIndex = "99";
      //taskDiv.style.background = "#87ceeb";
      titleDiv.style.padding = "5px";
      titleDiv.style.textAlign = "left";
      titleDiv.innerHTML = task.title;
      titleDiv.style.background = "";
      propDiv.style.position = "absolute";
      propDiv.style.top = "3px";
      propDiv.style.right = "3px";
      propDiv.style.width = "16px";
      propDiv.style.height = "16px";
      propDiv.style.backgroundImage = "url(properties.png)";
      propDiv.style.backgroundColor = "grey";
      arrowDiv.className = "main-boards-tasks-arrow arrow right";
      arrowDiv.style.position = "absolute";
      arrowDiv.style.top = "3px";
      arrowDiv.style.right = "16px";
      arrowDiv.style.width = "16px";
      arrowDiv.style.height = "16px";
      leftDiv.style.background = "";
      rightDiv.style.background = "";
      dateDiv.style.background = "";
      descDiv.style.background = "";

      taskDiv.appendChild(titleDiv);
      taskDiv.appendChild(propDiv);
      taskDiv.appendChild(arrowDiv);
      taskDiv.appendChild(leftDiv);
      taskDiv.appendChild(rightDiv);
      leftDiv.appendChild(dateDiv);
      leftDiv.appendChild(descDiv);

      anchorP.appendChild(taskDiv);

      for (let k = 0; j < task.userIds; k++) {

        // Assigned user id and name.
        const assignedUserId = task.userIds[k];
        const assignedUserName = userList[assignedUserId].name;
        //console.log("assigned user #" + k + ": " + assignedUserName);
      }
    }
  
    const addBtn = document.getElementById("col" + i + "-btn");
    const inputTag = document.getElementById("textAreaId" + i);
    addBtn.onclick = function(){createTask(userId, i, inputTag)};
  }
}

function createTask(userId, colId, inputTag) {
  console.log(userId+", "+colId+", "+inputTag.value);
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  // Create task element
  // Save in boardList
  // Draw element on page
}
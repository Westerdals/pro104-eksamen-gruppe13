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

  const userId = getUserId();

  // Get board and user list from local storage.
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Verify that the user is logged in properly.
  if (userList.length == 0 || typeof(userList[userId]) === undefined || userId == '') {

    /*feedbackDiv.innerHTML = "You must be logged in to access and create boards.";
    createLi.style.display = "none";
    loginA.innerHTML = "Log In";*/

    /*alert("You must be logged in to access this page.");
    window.location.href = "login.html"; //redirect to login page*/
    console.log("invalid login state");
    return;
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
    console.log("column #" + i + " title: " + columnTitle);

    for (let j = 0; j < column.taskIds.length; j++) {
      const task = tasks[column.taskIds[j]];

      // Task title, description and deadline.
      const taskTitle = task.title;
      const taskDescription = task.description;
      const taskDeadline = task.deadline;
      console.log("task #" + j + " title: " + taskTitle + ", description: " + taskDescription + ", deadline: " + taskDeadline);

      for (let k = 0; j < task.userIds; k++) {

        // Assigned user id and name.
        const assignedUserId = task.userIds[k];
        const assignedUserName = userList[assignedUserId].name;
        console.log("assigned user #" + k + ": " + assignedUserName);
      }
    }
  }
}
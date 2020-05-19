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

    // Used for inserting tasks.
    let anchorTag = document.getElementById("p" + i);

    for (let j = 0; j < column.taskIds.length; j++) {
      const taskId = column.taskIds[j];
      const task = tasks[taskId];

      // Task title, description and deadline.
      const taskTitle    = task.title;
      const taskDescr    = task.description;
      const taskDeadline = task.deadline;
      const memberIds    = task.memberIds;
      //console.log("task #" + j + " title: " + taskTitle + ", description: " + taskDescr + ", deadline: " + taskDeadline);

      let htmlTxtForOneElement = createElementWithRightCSS(taskTitle);
      let taskDiv = document.createElement("div");
      taskDiv.id = "task" + taskId;
      taskDiv.innerHTML = htmlTxtForOneElement;
      taskDiv.onclick = function(){showTaskPropDiv(boardId, taskId)};
      anchorTag.parentNode.insertBefore(taskDiv, anchorTag.nextSibling); //insert after anchor tagg
      anchorTag = taskDiv; // Set anchor tag to last inserted div.

      for (let k = 0; j < task.userIds; k++) {

        // Assigned user id and name.
        const assignedUserId = task.userIds[k];
        const assignedUserName = userList[assignedUserId].name;
        //console.log("assigned user #" + k + ": " + assignedUserName);
      }
    }
   
    const addBtn = document.getElementById("col" + i + "-btn");
    const inputTag = document.getElementById("textAreaId" + i);
    addBtn.onclick = function(){createTaskHandler(userId, i, inputTag)};
  }
}

/**
 * Called when pressing a 'Add task' button. Adds a task element to the column
 * from where the button was pressed and saves task data in local storage.
 */
function createTaskHandler(userId, colId, inputTag) {
  //console.log("createTaskHandler(userId="+userId+", colId="+colId+", value="+inputTag.value+") running");
  
  // Create the task data variable.
  const title = inputTag.value;
  const description = "";
  const deadline = "";
  const memberIds = [];
  const task = {title, description, deadline, memberIds};

  if (invFormAl(title, 1, true, "Title")) {return;} //input validation

  // Load and prepare data.
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardId = userList[userId].lastBoardId;
  let columns   = boardList[boardId].columns;
  let tasks     = boardList[boardId].tasks;
  const taskId  = tasks.length;

  // Add and save data.
  columns[colId].taskIds.push(taskId);
  tasks.push(task);
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  // Get anchor tag.
  let anchorTag = document.getElementById("newTaskId" + colId);

  let htmlTxtForOneElement = createElementWithRightCSS(title);
  let taskDiv = document.createElement("div");
  taskDiv.id = "task" + taskId;
  taskDiv.innerHTML = htmlTxtForOneElement;
  taskDiv.onclick = function(){showTaskPropDiv(boardId, taskId)};
  anchorTag.parentNode.insertBefore(taskDiv, anchorTag); //insert before
  //anchorTag.parentNode.insertBefore(taskDiv, anchorTag.nextSibling);

  // Setting textArea to empty when added task
  // and setting focus to write another task
  inputTag.value = "";
  inputTag.focus();
}

function createElementWithRightCSS(title){
  let outputDiv = `
     <div class="main-boards-tasks color selectable rounded" draggable="true" ondragstart="drag(event)">
            <p>${title}</p>
                
                <div class="main-boards-tasks-arrow">
                    <i class="arrow right"></i>
                </div>
     </div>`;

  return outputDiv;
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.parentNode.id);
}

function showTaskPropDiv(boardId, taskId) {
  //console.log("showTaskPropDiv(taskId="+taskId+")");
  let overlayDiv    = document.getElementById("tp-overlay");
  let frameDiv      = document.getElementById("tp-frame");
  const titleDiv    = document.getElementById("tp-title");
  const titleSubDiv = document.getElementById("tp-title-sub");

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const task = boardList[boardId].tasks[taskId];

  titleDiv.innerHTML = task.title;
  titleSubDiv.innerHTML = "in column " + boardList[boardId].title;

  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";
}

function hideTaskPropDiv(e) {
  document.getElementById("tp-overlay").style.display = "none";
  document.getElementById("tp-frame").style.display   = "none";
}

/**
 * Close the task properties window if 'escape' is pressed.
 */
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        hideTaskPropDiv();
    }
};
function setLinkParams() {
  let boardA     = document.getElementById("board-a");
  let boardLogo  = document.getElementById("board-logo");

  let ideasA     = document.getElementById("ideas-a");
  let membersA   = document.getElementById("members-a");
  const userId   = getUserId();
  
  boardA.href    = boardA.href   + "?"  + userId;
  boardLogo.href = boardLogo.href + "?" + userId;
  membersA.href  = membersA.href + "?"  + userId;
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

  /* Displaying what project youre on */
  const displayProjectName = document.getElementById("name-of-project");
  const displayH3Tag = displayProjectName.firstElementChild;
  displayH3Tag.innerHTML = board.title;

  // Board, column and task data.
  const boardTitle = board.title;
  const columns    = board.columns;
  const tasks      = board.tasks;
  const userIds    = board.userIds; //invited members

  createTemplateGrid(columns);

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
      taskDiv.onclick = function(){showTaskPropDiv(boardId, taskId, i)};
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

  refreshMembersInNav(userId, boardId);
}

// Add members to nav-bar
function refreshMembersInNav(userId, boardId) {
  const anchorTag = document.getElementById("inv-li");

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList = JSON.parse(window.localStorage.getItem("userList")) || [];

  const userIds = boardList[boardId].userIds;

  anchorTag.textContent = "";
  for (let i = 0; i < userIds.length; i++) {
    const memberId   = userIds[i];
    const memberName = userList[memberId].name; 
    let memberDiv = document.createElement("div");
    memberDiv.className = "member greycircle";
    memberDiv.innerHTML = memberName;
    console.log(i + ", " + memberName);
    anchorTag.appendChild(memberDiv);
  }
}

function showInviteMenu() {
  let overlayDiv = document.getElementById("inv-overlay");
  let frameDiv = document.getElementById("inv-frame");
  let inviteDiv = document.getElementById("inv-container");
  const inviteLi = document.getElementById("inv-li");
  let membersDiv = document.getElementById("inv-list");
  
  // Make list visible.
  overlayDiv.style.display = "block";
  frameDiv.style.display = "block";

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId = getUserId();
  const boardId = userList[userId].lastBoardId;
  const memberIds = boardList[boardId].userIds; //users already invited
  membersDiv.textContent = "";

  for (let i = 0; i < userList.length; i++) {
    
    // Check if user is already a member.
    let isMember = false;
    for (let j = 0; j < memberIds.length; j++) {
      const mId = Number(memberIds[j]);
      if (mId == i) {
        isMember = true;
        break;
      }
    }
    if (isMember) continue;

    let memberDiv = document.createElement("div");
    memberDiv.className = "memberListName";
    memberDiv.innerHTML = userList[i].name;
    memberDiv.onclick = function() {addMemberToBoard(userId, i, boardId, memberDiv)};

    membersDiv.appendChild(memberDiv);
  }

  document.addEventListener('keydown', handleKeyPressFromInv);
}

function addMemberToBoard(userId, memberId, boardId, memberDiv) {
  console.log("Adding user " + memberId + " to the board of user " + userId);

  // Remove member from the invite list. 
  memberDiv.parentNode.removeChild(memberDiv);

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  boardList[userId].userIds.push(memberId);
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  refreshMembersInNav(userId, boardId);
}

function handleKeyPressFromInv(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      console.log("escape key from Invite menu");
      hideInviteMenu();
      document.removeEventListener('keydown', handleKeyPressFromInv);
  }
}

function hideInviteMenu() {
  let overlayDiv = document.getElementById("inv-overlay");
  let frameDiv = document.getElementById("inv-frame");
  overlayDiv.style.display = "none";
  frameDiv.style.display = "none";
  document.removeEventListener('keydown', handleKeyPressFromInv);
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
  taskDiv.onclick = function(){showTaskPropDiv(boardId, taskId, colId)};
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

function showTaskPropDiv(boardId, taskId, colId) {
  //console.log("showTaskPropDiv(taskId="+taskId+")");
  let overlayDiv    = document.getElementById("tp-overlay");
  let frameDiv      = document.getElementById("tp-frame");
  const titleDiv    = document.getElementById("tp-title");
  const titleSubDiv = document.getElementById("tp-title-sub");
  const dateDiv     = document.getElementById("tp-date-view");
  const descInput   = document.getElementById("tp-desc-input");
  let joinDiv       = document.getElementById("m-join");

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const task = boardList[boardId].tasks[taskId];
  const userId = getUserId();

  frameDiv.setAttribute("taskId", taskId); //store for later use
  titleDiv.innerHTML    = task.title;
  titleSubDiv.innerHTML = "in column " + boardList[boardId].columns[colId].title;
  dateDiv.innerHTML     = task.deadline;
  descInput.value       = task.description;

  refreshTaskMembers(boardId, taskId);

  // Hide the "Join" menu option if user is already assigned to the task.
  if (task.memberIds.includes(userId)) {
    joinDiv.style.display = "none";
  } else {
    joinDiv.style.display = "block";
  }

  /* TODO: fix this part. Supposed to set the currently selected date to the one
  loaded from storage (if it exists). */
  /*if (typeof task.deadline === 'undefined' || task.deadline === null) {
    console.log("No previously deadline set.");
  } else {
    console.log("A deadline has been set.");
    date = task.deadline;
  }*/

  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";

  document.addEventListener('keydown', handleKeyPressFromProp);
}

function handleKeyPressFromProp(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      console.log("escape key from Properties window");
      hideTaskPropDiv();
  }
}

function hideTaskPropDiv(ev) {
  closeDescInput(); //close description input
  document.getElementById("tp-overlay").style.display = "none";
  document.getElementById("tp-frame").style.display   = "none";
  document.getElementById("tp-date-view").innerHTML = "";
  document.removeEventListener('keydown', handleKeyPressFromProp);
}

function triggerDescInput() {
  const inputDiv = document.getElementById("tp-desc-input");
  const saveDiv = document.getElementById("tp-desc-btn");
  inputDiv.style.backgroundColor = "#a9d97d";
  saveDiv.style.display = "table-cell";
}

function closeDescInput(ev) {
  if (typeof ev === "undefined" || ev.target.id != "tp-desc-input") {
    // Revert elements.
    const inputDiv = document.getElementById("tp-desc-input");
    const saveDiv = document.getElementById("tp-desc-btn");
    inputDiv.style.backgroundColor = "#63824f"; //same as .color
    saveDiv.style.display = "none";

    // Save input data in storage.
    boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
    userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
    const userId     = getUserId();
    const boardId    = userList[userId].lastBoardId;
    const frameDiv   = document.getElementById("tp-frame");
    const taskId     = frameDiv.getAttribute("taskId");
    let task         = boardList[boardId].tasks[taskId];
    task.description = inputDiv.value;
    window.localStorage.setItem("boardList", JSON.stringify(boardList));
  }
}

function joinTask() {
  document.getElementById("m-join").style.display = "none";

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId     = getUserId();
  const boardId    = userList[userId].lastBoardId;
  const frameDiv   = document.getElementById("tp-frame");
  const taskId     = frameDiv.getAttribute("taskId");
  let task         = boardList[boardId].tasks[taskId];
  task.memberIds.push(userId);
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  refreshTaskMembers(boardId, taskId);
}

function refreshTaskMembers(boardId, taskId) {
  let membersDiv = document.getElementById("tp-mem-view");

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const memberIds = boardList[boardId].tasks[taskId].memberIds;
  membersDiv.textContent = "";
  for (let i = 0; i < memberIds.length; i++) {
    const memberId = memberIds[i];
    const memberName = userList[memberId].name;

    let memberDiv = document.createElement("div");
    memberDiv.className = "member greycircle";
    memberDiv.innerHTML = memberName;

    membersDiv.appendChild(memberDiv);
  }
}

function showDateWin() {
  const overlayDiv = document.getElementById("date-overlay");
  const dateFrame = document.getElementById("date-frame");
  const dateDiv = document.getElementById("tp-date-view");
  overlayDiv.style.display = "block";
  dateFrame.style.display = "block";
  document.removeEventListener('keydown', handleKeyPressFromProp);
  document.addEventListener('keydown', handleKeyPressFromDate);
}

function handleKeyPressFromDate(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      console.log("escape key from Deadline window");
      hideDateDiv();
  }
}

function hideDateWin() {
  const overlayDiv = document.getElementById("date-overlay");
  const dateFrame = document.getElementById("date-frame");
  overlayDiv.style.display = "none";
  dateFrame.style.display = "none";
  document.removeEventListener('keydown', handleKeyPressFromDate);
  document.addEventListener('keydown', handleKeyPressFromProp);
}

var date;

function saveDate(event) {
  const dateDiv = document.getElementById("tp-date-view");
  dateDiv.innerHTML = date;

  // Save input data in storage.
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId     = getUserId();
  const boardId    = userList[userId].lastBoardId;
  const frameDiv   = document.getElementById("tp-frame");
  const taskId     = frameDiv.getAttribute("taskId");
  let task         = boardList[boardId].tasks[taskId];
  task.deadline    = date;
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  hideDateWin();
}

function removeDate() {
  hideDateWin();
}

/* Fired whenever the user changes a value in datetime-local.
   Only fires if all values are set (hence why we fill it in advance). */
function dateChange(ev) {
  date = ev.target.value;
}

/* Sets todays date and time */
window.addEventListener("load", function() {
    var now = new Date();
    var offset = now.getTimezoneOffset() * 60000;
    var adjustedDate = new Date(now.getTime() - offset);
    var formattedDate = adjustedDate.toISOString().substring(0,16); // For minute precision
    var dateInput = document.getElementById("date-input");
    dateInput.value = formattedDate;
    date = formattedDate;
});


/* Function to show which project youre currently inside */
function showProjectName(){

   

}

/* Alternative method of setting todays date and time */
/*window.addEventListener("load", function() {
    var now = new Date();
    var utcString = now.toISOString().substring(0,19);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var localDatetime = year + "-" +
                      (month < 10 ? "0" + month.toString() : month) + "-" +
                      (day < 10 ? "0" + day.toString() : day) + "T" +
                      (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                      (minute < 10 ? "0" + minute.toString() : minute) +
                      utcString.substring(16,19);
    var dateInput = document.getElementById("date-input");
    dateInput.value = localDatetime;
    date = formattedDate;
});*/

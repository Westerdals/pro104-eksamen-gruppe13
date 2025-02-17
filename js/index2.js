
/**
 * Called from end of loadBoardData()
 * Sets up listeners from triggering interactible elements with enter key press.
 */
function addEventListeners(columns, tasks) {
  document.getElementById("inv-btn").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {showInviteMenu();}
  });

  for (let i = 0; i < columns.length; i++) {
    document.getElementById("textBoxId"+i).addEventListener('keypress', function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        showTextbox("textBoxId"+i);
      }
    });
  }

  document.getElementById("m-join").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {joinTask();}
  });
  document.getElementById("m-add").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {showAddWin();}
  });
  document.getElementById("m-deadline").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {showDateWin();}
  });
  document.getElementById("m-move").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {showMoveWin();}
  });
  document.getElementById("m-delete").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {deleteTaskHandler();}
  });
  document.getElementById("inv-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideInviteWin();}
  });
  document.getElementById("tp-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideTaskPropDiv();}
  });
  document.getElementById("add-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideAddWin();}
  });
  document.getElementById("date-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideDateWin();}
  });
  document.getElementById("move-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideMoveWin();}
  });
  document.getElementById("date-save").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {saveDate();}
  });
  document.getElementById("date-remove").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {removeDate();}
  });
  document.getElementById("add-new-board").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {animationForAddBoard();}
  });
  document.getElementById("tp-desc-btn").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {closeDescInput();}
  });
  document.getElementById("mytasks-close").addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {hideMytasksWin();}
  });
}

function setLinkParams() {
  let boardA     = document.getElementById("board-a");
  let boardLogo  = document.getElementById("board-logo");

  const userId   = getUserId();

  boardA.href    = boardA.href    + "?userid=" + userId;
  boardLogo.href = boardLogo.href + "?userid=" + userId;
}

function loadBoardData() {

  setLinkParams();

  let userId = getUserId();

  const loginA = document.getElementById("login-a");

  // Get board and user list from local storage.
  let userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  let boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  // Verify that the user is logged in properly.
  if (userList.length == 0 || typeof(userList[userId]) === undefined || userId == '') {

    // Creating two test users if none exists.
    if (userList.length == 0) {
      userId = 0;
      let name = "test";
      let password = "test";
      let lastBoardId = -1;
      let user = {name, password, lastBoardId};
      userList.push(user);
      window.localStorage.setItem("userList", JSON.stringify(userList));

      userId = 1;
      name = "mest";
      password = "mest";
      lastBoardId = -1;
      user = {name, password, lastBoardId};
      userList.push(user);
      window.localStorage.setItem("userList", JSON.stringify(userList));
    }
    console.log("Injecting log in session of user " + userList[0].name);
    window.location.href = "index.html?userid=0";
    
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

  // Draw columns
  createTemplateGrid(columns);

  // Loop through columns
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    // Column title.
    const columnTitle = column.title;

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

      let htmlTxtForOneElement = createElementWithRightCSS(taskTitle, taskId, boardId, i);

 
      let taskDiv = document.createElement("div");

      taskDiv.id = "task" + taskId;
      taskDiv.innerHTML = htmlTxtForOneElement;
      taskDiv.onclick = function(){showTaskPropDiv(event, boardId, taskId, i)};
      taskDiv.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {showTaskPropDiv(event, boardId, taskId, i);}
      });
      anchorTag.parentNode.insertBefore(taskDiv, anchorTag.nextSibling); //insert after anchor tagg
      anchorTag = taskDiv; // Set anchor tag to last inserted div.
    }
   
    const addBtn = document.getElementById("col" + i + "-btn");
    const inputTag = document.getElementById("textAreaId" + i);
    addBtn.onclick = function(){createTaskHandler(userId, i, inputTag)};

    
  }
  refreshMembersInNav(userId, boardId);

  setTabindexOnProperties(0);
  setSecondTabIndexElements(0);

  addEventListeners(columns, tasks);

  // If the site was refreshed due to a new column being created, regain focus.
  regainFocusState();
}

/**
 * Checks the url for the "focus" parameter id.
 * If set, it means the site was refreshed from addNewBoard() in index.js
 * In order to keep tabindex focus integrity, this function was created
 * to set focus on the appropriate element after page reload.
 */
function regainFocusState() {
  const id = getUrlParameter("focus");
  if (id !== "") {
    //document.activeElement.blur();
    document.getElementById(id).focus(); // cause of the Autofocus processing blocked message.
    
    // TODO: add code for removing the url parameter.
  }
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
    memberDiv.className = "member greycircle tooltip";
    memberDiv.innerHTML = memberName.charAt(0).toUpperCase();
    anchorTag.appendChild(memberDiv);


    
    let tooltipMember = document.createElement("span");
    tooltipMember.className = "tooltiptext";
    tooltipMember.innerHTML = memberName;
    memberDiv.appendChild(tooltipMember);
  }
}

function showInviteMenu() {
  let overlayDiv = document.getElementById("inv-overlay");
  let frameDiv   = document.getElementById("inv-frame");
  let inviteDiv  = document.getElementById("inv-container");
  const inviteLi = document.getElementById("inv-li");
  let membersDiv = document.getElementById("inv-list");
  
  // Make list visible.
  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId    = getUserId();
  const boardId   = userList[userId].lastBoardId;
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
    memberDiv.className = "opt";
    memberDiv.innerHTML = userList[i].name;
    memberDiv.onclick = function() {addMemberToBoard(userId, i, boardId, memberDiv)};
    memberDiv.addEventListener('keypress', function(e) {
      if (e.keyCode == 13) {addMemberToBoard(userId, i, boardId, memberDiv)}
    });
   
    membersDiv.appendChild(memberDiv);
    memberDiv.tabIndex = "0";
  }

  setTabindexOnProperties(-1);
  setSecondTabIndexElements(0);

  document.addEventListener('keydown', handleKeyPressFromInv);
}

function addMemberToBoard(userId, memberId, boardId, memberDiv) {

  // Remove member from the invite list. 
  memberDiv.parentNode.removeChild(memberDiv);

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  boardList[boardId].userIds.push(memberId);
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  refreshMembersInNav(userId, boardId);
}

function handleKeyPressFromInv(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
    hideInviteWin();
    document.removeEventListener('keydown', handleKeyPressFromInv);
  }
}

function hideInviteWin() {
  let overlayDiv = document.getElementById("inv-overlay");
  let frameDiv   = document.getElementById("inv-frame");
  overlayDiv.style.display = "none";
  frameDiv.style.display   = "none";
  document.removeEventListener('keydown', handleKeyPressFromInv);
  
  document.getElementById("inv-btn").focus();
  setTabindexOnProperties(0);
}

/**
 * Called when pressing a 'Add task' button. Adds a task element to the column
 * from where the button was pressed and saves task data in local storage.
 */
function createTaskHandler(userId, colId, inputTag) {
  
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


  let htmlTxtForOneElement = createElementWithRightCSS(title, taskId, boardId, colId);   

  let taskDiv = document.createElement("div");
  taskDiv.id = "task" + taskId;
  taskDiv.innerHTML = htmlTxtForOneElement;
  taskDiv.onclick = function(){showTaskPropDiv(event, boardId, taskId, colId)};
  anchorTag.parentNode.insertBefore(taskDiv, anchorTag); //insert before

  // Setting textArea to empty when added task
  // and setting focus to write another task
  inputTag.value = "";
  inputTag.focus();
}

function createElementWithRightCSS(title, taskId, boardId, colId){

  let outputDiv = `
     <div class="main-boards-tasks color selectable rounded tab-index" draggable="true" ondragstart="drag(event)">
            <p>${title}</p>

            <abbr title="Move task to next column"><div class="arrow-container" onclick="moveTaskHandler(event, ${taskId}, ${boardId}, ${colId}, ${colId+1})">
              <div class="main-boards-tasks-arrow">
                <i class="arrow right"></i>
              </div>
            </div></abbr>
     </div>`;

    
  return outputDiv;
}

function moveTaskHandler(ev, taskId, boardId, colId, targetColId) {
  // Prevent outer onclick events from firing.
  if (!ev) var ev = window.event;
  ev.cancelBubble = true;
  if (ev.stopPropagation) ev.stopPropagation();

  //let taskDiv = document.getElementById(ev.currentTarget.parentNode.parentNode.id);
  moveTask(taskId, boardId, colId, targetColId);
}

/**
 * Moves a task to a specified column.
 * Called by: moveTaskHandler(), onclick event set in showMoveWin()
 */
function moveTask(taskId, boardId, colId, targetColId) {
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const board = boardList[boardId];
  const cols = board.columns;
  const task = board.tasks[taskId];
  if (targetColId >= cols.length) {
    console.log("An attempt was made to move a task to a column outside range.");
    return;
  }
  let taskDiv = document.getElementById("task" + taskId);

  // Remove task id from the columns array.
  let taskIds = cols[colId].taskIds;
  taskIds = arrayRemoveByVal(taskId, taskIds);
  boardList[boardId].columns[colId].taskIds = taskIds;

  // Add task id to the target columns array and save to storage.
  cols[targetColId].taskIds.push(Number(taskId));
  window.localStorage.setItem("boardList", JSON.stringify(boardList));
  
  // Remove element from DOM.
  taskDiv.parentNode.removeChild(taskDiv);
  
  // Update the onclick function arguments and insert element in the target column.
  const anchorTag     = document.getElementById("newTaskId" + targetColId);
  taskDiv.innerHTML   = createElementWithRightCSS(task.title, taskId, boardId, targetColId);
  taskDiv.onclick     = function(){showTaskPropDiv(event, boardId, taskId, targetColId)};
  anchorTag.parentNode.insertBefore(taskDiv, anchorTag);
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.parentNode.id);
}

function showTaskPropDiv(ev, boardId, taskId, colId) {
  let overlayDiv    = document.getElementById("tp-overlay");
  let frameDiv      = document.getElementById("tp-frame");
  const titleDiv    = document.getElementById("tp-title");
  const titleSubDiv = document.getElementById("tp-title-sub");
  const dateDiv     = document.getElementById("tp-date-view");
  const descInput   = document.getElementById("tp-desc-input");
  let joinDiv       = document.getElementById("m-join");

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const task   = boardList[boardId].tasks[taskId];
  const userId = getUserId();
  frameDiv.setAttribute("taskId", taskId); //store for later use
  frameDiv.setAttribute("colId", colId); //used for task deletion
  titleDiv.innerHTML    = task.title;
  titleSubDiv.innerHTML = "in column " + boardList[boardId].columns[colId].title;
  dateDiv.innerHTML     = task.deadline;
  descInput.value       = task.description;

  refreshTaskMembers(boardId, taskId);
  setTabindexOnProperties(-1);
  setSecondTabIndexElements(0); 
  

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
    hideTaskPropDiv();
  }
}

function hideTaskPropDiv(ev) {
  closeDescInput(); //close description input
  const deleteDiv = document.getElementById("m-delete");
  if (deleteDiv.hasAttribute("doDelete")) {
    resetDeleteElement();
  }  

  document.getElementById("tp-overlay").style.display = "none";
  document.getElementById("tp-frame").style.display   = "none";
  document.getElementById("tp-date-view").innerHTML = "";
  document.removeEventListener('keydown', handleKeyPressFromProp);

  setTabindexOnProperties(0);
  setSecondTabIndexElements(0);
}

function triggerDescInput() {
  const inputDiv = document.getElementById("tp-desc-input");
  const saveDiv  = document.getElementById("tp-desc-btn");
  inputDiv.style.backgroundColor = "#a9d97d";
  saveDiv.style.display = "table-cell";
}

/**
 * Handles various click events in the task properties window.
 */
function propWinClickHandler(ev) {
  if (typeof ev === "undefined" || ev.target.id != "tp-desc-input") {
    closeDescInput();
  }
  if (ev.target.id != "m-delete" && document.getElementById("m-delete").hasAttribute("doDelete")) {
    resetDeleteElement();
  }
}

function closeDescInput() {
  // Revert elements.
  const inputDiv = document.getElementById("tp-desc-input");
  const saveDiv  = document.getElementById("tp-desc-btn");
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
    memberDiv.className = "member greycircle tooltip";
    memberDiv.innerHTML = memberName.charAt(0).toUpperCase();

    membersDiv.appendChild(memberDiv);
    
    let tooltipMember = document.createElement("span");
    tooltipMember.className = "tooltiptext";
    tooltipMember.innerHTML = memberName;
    memberDiv.appendChild(tooltipMember);
  }
}

/* Show add member to task window. Sub-window of task properties. */
function showAddWin() {
  const overlayDiv = document.getElementById("add-overlay");
  const frameDiv   = document.getElementById("add-frame");
  let membersDiv   = document.getElementById("mem-list");
  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";
  document.removeEventListener('keydown', handleKeyPressFromProp);
  document.addEventListener('keydown', handleKeyPressFromAdd);

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId    = getUserId();
  const boardId   = userList[userId].lastBoardId;
  const memberIds = boardList[boardId].userIds; //get board members
  const taskId    = document.getElementById("tp-frame").getAttribute("taskId");
  const taskMemberIds = boardList[boardId].tasks[taskId].memberIds;
  membersDiv.textContent = "";

  for (let i = 0; i < userList.length; i++) {
    
    // Check if user is a board member.
    let isMember = false;
    for (let j = 0; j < memberIds.length; j++) {
      const mId = Number(memberIds[j]);
      if (mId == i) { //is a member
        isMember = true;
        break;
      }
    }
    if (!isMember) continue; //skip if not a member

    // Check if a member is already assigned to the task.
    let isAdded = false;
    for (let j = 0; j < taskMemberIds.length; j++) {
      const tmId = Number(taskMemberIds[j]);
      if (tmId == i) { //is added
        isAdded = true;
        break;
      }
    }

    let memberDiv = document.createElement("div");
    memberDiv.className = "opt";
    memberDiv.innerHTML = userList[i].name;
    if (isAdded) {
      memberDiv.setAttribute("isAdded", "");
      memberDiv.innerHTML += " (added)";
    }
    memberDiv.onclick = function() {addMemberHandler(userId, i, boardId, memberDiv, taskId)};
    memberDiv.addEventListener('keypress', function(e){
      if (e.keyCode == 13) {addMemberHandler(userId, i, boardId, memberDiv, taskId)}
    });

    membersDiv.appendChild(memberDiv);
    
    memberDiv.tabIndex = "0";
    setSecondTabIndexElements(-1);

  }
}

/* Adds or removes a member from a task. */
// BUG: add 2 users, the first, then the second. Second remains in storage.
function addMemberHandler(userId, memberId, boardId, memberDiv, taskId) {
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];

  if (memberDiv.hasAttribute("isAdded")) {
    memberDiv.removeAttribute("isAdded");

    // Mark member as available in the add member window.
    const str = memberDiv.innerHTML;
    memberDiv.innerHTML = str.substring(str.length - 8, str-length);
    let memberIds = boardList[boardId].tasks[taskId].memberIds;
    boardList[boardId].tasks[taskId].memberIds = arrayRemoveByVal(memberId, memberIds);
  } else {
    memberDiv.setAttribute("isAdded", "");
    
    // Mark member as added in the add member window.
    memberDiv.innerHTML += " (added)";
    boardList[boardId].tasks[taskId].memberIds.push(memberId);
  }

  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  refreshTaskMembers(boardId, taskId);
}

function handleKeyPressFromAdd(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      hideAddWin();
  }
}

function hideAddWin() {
  const overlayDiv = document.getElementById("add-overlay");
  const frameDiv   = document.getElementById("add-frame");
  overlayDiv.style.display = "none";
  frameDiv.style.display   = "none";
  document.removeEventListener('keydown', handleKeyPressFromAdd);
  document.addEventListener('keydown', handleKeyPressFromProp);

  setSecondTabIndexElements(0);
}

/* Show select date window. Sub-window of task properties. */
function showDateWin() {
  const overlayDiv = document.getElementById("date-overlay");
  const dateFrame = document.getElementById("date-frame");
  overlayDiv.style.display = "block";
  dateFrame.style.display = "block";
  document.removeEventListener('keydown', handleKeyPressFromProp);
  document.addEventListener('keydown', handleKeyPressFromDate);

  setSecondTabIndexElements(-1);
}

function handleKeyPressFromDate(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      hideDateWin();
  }
}

function hideDateWin() {
  const overlayDiv = document.getElementById("date-overlay");
  const dateFrame = document.getElementById("date-frame");
  overlayDiv.style.display = "none";
  dateFrame.style.display = "none";
  document.removeEventListener('keydown', handleKeyPressFromDate);
  document.addEventListener('keydown', handleKeyPressFromProp);

  setSecondTabIndexElements(0);
}

var date; // Global used by functions related to displaying and changing deadline date.

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
  const dateDiv = document.getElementById("tp-date-view");
  dateDiv.innerHTML = "";

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardId    = userList[getUserId()].lastBoardId;
  const frameDiv   = document.getElementById("tp-frame");
  const taskId     = frameDiv.getAttribute("taskId");
  boardList[boardId].tasks[taskId].deadline = "";
  window.localStorage.setItem("boardList", JSON.stringify(boardList));

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

/**
 * Displays the move task window.
 */
function showMoveWin() {
  const overlayDiv = document.getElementById("move-overlay");
  const frameDiv   = document.getElementById("move-frame");
  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";
  document.removeEventListener('keydown', handleKeyPressFromProp);
  document.addEventListener('keydown', handleKeyPressFromMove);

  refreshMoveColList();

  setSecondTabIndexElements(-1);
}

/**
 * Creates and appends clickable column elements in the move task window.
 * Called when the window is opened and whenever an element is clicked and
 * it needs to refresh the list.
 */
function refreshMoveColList(colId) {
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardId   = userList[getUserId()].lastBoardId;
  const board     = boardList[boardId];
  const columns   = board.columns;
  let columnsDiv  = document.getElementById("col-list");
  const taskId    = document.getElementById("tp-frame").getAttribute("taskId");
  if (typeof colId === "undefined") {
    colId = document.getElementById("tp-frame").getAttribute("colId");
  }

  columnsDiv.textContent = "";
  for (let i = 0; i < columns.length; i++) {
    let name = columns[i].title;
    let tabVal = 0;

    if (colId == i) {
      name += " (current)";
      tabVal = -1;
    }

    let colDiv = document.createElement("div");
    colDiv.innerHTML = name;
    colDiv.className = "opt";
    colDiv.onclick =  function(){
      moveTask(taskId, boardId, colId, i)
      refreshMoveColList(i);
    };
    colDiv.addEventListener('keypress', function(e) {
      if (e.keyCode == 13) {
        moveTask(taskId, boardId, colId, i);
        refreshMoveColList(i);
      }
    });
    colDiv.tabIndex = tabVal;

    columnsDiv.appendChild(colDiv);
  }
}

function handleKeyPressFromMove(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      hideMoveWin();
  }
}

function hideMoveWin() {
  const overlayDiv = document.getElementById("move-overlay");
  const frameDiv = document.getElementById("move-frame");
  overlayDiv.style.display = "none";
  frameDiv.style.display = "none";
  document.removeEventListener('keydown', handleKeyPressFromMove);
  document.addEventListener('keydown', handleKeyPressFromProp);

  setSecondTabIndexElements(0);
}

function deleteTaskHandler() {    
  let deleteDiv = document.getElementById("m-delete");
  if (deleteDiv.hasAttribute("doDelete")) {
    resetDeleteElement();
    hideTaskPropDiv();
    deleteTask();
  } else {
    deleteDiv.setAttribute("doDelete", "");
    deleteDiv.className = "optWarning";
    deleteDiv.innerHTML = "Are you sure?"
    document.removeEventListener('keydown', handleKeyPressFromProp); //deactivate esc
    document.addEventListener('keydown', handleKeyPressFromDeleteWarning);
  }
}

function handleKeyPressFromDeleteWarning(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      resetDeleteElement(); //reset element
  }
}

function resetDeleteElement() {
  let deleteDiv = document.getElementById("m-delete");
  deleteDiv.innerHTML = "Delete";
  deleteDiv.className = "opt";
  deleteDiv.removeAttribute("doDelete");
  document.removeEventListener('keydown', handleKeyPressFromDeleteWarning);
  document.addEventListener('keydown', handleKeyPressFromProp); //reactivate esc
}

function deleteTask() {
  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardId    = userList[getUserId()].lastBoardId;
  const frameDiv   = document.getElementById("tp-frame");
  const taskId     = frameDiv.getAttribute("taskId");
  const colId      = frameDiv.getAttribute("colId");
  const board      = boardList[boardId];
  let task         = board.tasks[taskId];

  let taskDiv = document.getElementById("task" + taskId);

  // Remove task id from the columns array.
  let taskIds = board.columns[colId].taskIds;
  taskIds = arrayRemoveByVal(taskId, taskIds);
  boardList[boardId].columns[colId].taskIds = taskIds;
  
  // Remove task from tasks array and save.
  boardList[boardId].tasks[taskId] = "";
  window.localStorage.setItem("boardList", JSON.stringify(boardList));
  
  // Remove element from DOM.
  taskDiv.parentNode.removeChild(taskDiv);
}

/* Function to set the tabindex of elements to 0 or -1 to call in the loadBoardData-function*/
function setTabindexOnProperties(para){
  
  var mainBoardContainer = document.querySelectorAll(".tab-index");
    
  for (let i = 0; i < mainBoardContainer.length; i++){
      
      mainBoardContainer[i].tabIndex = para;
  }
}


function setSecondTabIndexElements(para) {
  
  var propCont = document.querySelectorAll(".second-tab-index");

  for (let i = 0; i < propCont.length; i++){
      
      propCont[i].tabIndex = para;
  }

}


/**
 * Displays the my tasks window with a list of the current user's tasks.
 * The task elements are clickable and will direct the user to the properties
 * window of that task. Called when the window is opened.
 */
function showMytasksWin() {
  const overlayDiv = document.getElementById("mytasks-overlay");
  const frameDiv   = document.getElementById("mytasks-frame");
  overlayDiv.style.display = "block";
  frameDiv.style.display   = "block";
  document.removeEventListener('keydown', handleKeyPressFromProp);
  document.addEventListener('keydown', handleKeyPressFromMove);

  boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  userList  = JSON.parse(window.localStorage.getItem("userList")) || [];
  const userId    = getUserId();
  const boardId   = userList[userId].lastBoardId;
  const board     = boardList[boardId];
  const columns   = board.columns;
  const tasks     = board.tasks;
  let tasksDiv    = document.getElementById("task-list");

  tasksDiv.textContent = ""; //reset task container
  for (let i = 0; i < tasks.length; i++) { //loop through all tasks
    const memberIds = tasks[i].memberIds;
    const task = tasks[i];
    if (memberIds === undefined) break;
    for (let j = 0; j < memberIds.length; j++) { //loop through members of each task
      const memId = memberIds[j];
      if (memId == userId) { //check if member is equal to current user
        
        // In order to trigger the task properties window, we need the column id.
        let colId = null; // column id of the current taskId
        for (let k = 0; k < columns.length; k++) { //loop through all columns
          const taskIds = columns[k].taskIds;
          for (let l = 0; l < taskIds.length; l++) { //loop through task ids in the column
            const colTaskId = taskIds[l];
            if (colTaskId == i) { //check that the task id matches the current task from the outermost loop
              colId = k;
              break;
            }
          }
          if (colId !== null) break;
        }
        
        const taskDiv = document.createElement("div");
        
        taskDiv.innerHTML = task.title;
        taskDiv.className = "opt";
        taskDiv.tabIndex  = 0;

        taskDiv.onclick = function(){
          hideMytasksWin();
          showTaskPropDiv(null, boardId, i, colId);
        };
        taskDiv.addEventListener('keypress', function(e) {
          if (e.keyCode == 13) {
            hideMytasksWin();
            showTaskPropDiv(null, boardId, i, colId);
          }
        });

        tasksDiv.appendChild(taskDiv);
      } //end of -if-
    } //end of -j loop-
  } //end of -i loop-

  setSecondTabIndexElements(-1);
}

function handleKeyPressFromMytasks(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
      hideMytasksWin();
  }
}

function hideMytasksWin() {
  const overlayDiv = document.getElementById("mytasks-overlay");
  const frameDiv = document.getElementById("mytasks-frame");
  overlayDiv.style.display = "none";
  frameDiv.style.display = "none";
  document.removeEventListener('keydown', handleKeyPressFromMytasks);
  document.addEventListener('keydown', handleKeyPressFromProp);

  setSecondTabIndexElements(0);
}
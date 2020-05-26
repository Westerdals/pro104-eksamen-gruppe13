var mainBoardContainer = document.getElementById("main-container");

/* Creating the template for the columns that will hold the tasks */
function createTemplateGrid(columns){ 
  var htmlTxt = "";
  
  for (let i = 0; i < columns.length; i++) {

        htmlTxt += `
        <div id="col${i}" class="box" ondrop="drop(event)" ondragover="allowDrop(event)">
            <p id="p${i}" class="textbox"><strong>${columns[i].title}</strong></p>

            <div id="newTaskId${i}">

            </div>

            <div class="main-boards-tasks main-boards-add-task-btn tab-index" id="textBoxId${i}" onclick="showTextbox(this.id)">
                <p>+Add new task..</p>
            </div>

            <div class="main-boards-tasks-txt">
                <textarea id="textAreaId${i}" onfocusout="hideTextBox(this.id)" autofocus type="textbox" placeholder="Add new task.." maxlength="${INPUT_LENGTH_ADD_TASK}"></textarea>
                <input id="col${i}-btn" type="button" value="Add task">
            </div>

            <div id="container-to-get-enough-space"></div>
            
        </div>
        `;
    }

/* Creating the new column-field that will make it possible to add new columns */
    var newBoard = `
        <div id="add-new-board" class="tab-index" onclick="animationForAddBoard()">
            <p class="textbox"><strong>Add new column</strong></p>
            <div id="new-board-container">
                <input type="text" id="add-board-field" placeholder="Add new column.." maxlength="${INPUT_LENGTH_ADD_COLUMN}">
                <input type="button" value="Add column" id="add-board-btn" onclick="addNewBoard()" alt="Add new board">
            </div>
        </div>
    `;
 
  mainBoardContainer.innerHTML = htmlTxt;
  mainBoardContainer.innerHTML += newBoard;
}

/**
 * Prevent interaction when dragging an element.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Handles dropping a dragged task over a column.
 */
function drop(ev) {
  ev.preventDefault();
  
  // Get the dragged task and 'Add new task' elements.
  var data = ev.dataTransfer.getData("text");
  const taskDiv = document.getElementById(data);
  const colId = Number(ev.currentTarget.id.substring(3));
  const originColId = Number(taskDiv.parentNode.id.substring(3));
  const anchorTag = document.getElementById("newTaskId" + colId);

  // Insert the task before the button element.
  anchorTag.parentNode.insertBefore(taskDiv, anchorTag);

  // Update local storage.
  let userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  let boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const userId = getUserId();
  const boardId = userList[userId].lastBoardId;
  const taskId = Number(taskDiv.id.substring(4));
  
  // Remove task reference id from the previous column.
  let taskIds = boardList[boardId].columns[originColId].taskIds;
  for (let i = 0; i < taskIds.length; i++) {
    if (taskIds[i] == taskId) {
      taskIds.splice(i, 1);
      boardList[boardId].columns[originColId].taskIds = taskIds;
      break;
    }
  }
  // Add task referene id to the new parent column.
  boardList[boardId].columns[colId].taskIds.push(taskId);

  window.localStorage.setItem("boardList", JSON.stringify(boardList));
}

//Function to add new board into the template
function addNewBoard(){

  const str = document.getElementById("add-board-field").value;
  
  if (invFormAl(str, 1, true, "Title")) {return;}

  const userId = getUserId();
  let userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  let boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const boardId = userList[userId].lastBoardId;
  
  const colElement = { title: str, taskIds: [] };

  const columns = boardList[boardId].columns;
  columns.push(colElement);

  window.localStorage.setItem("boardList", JSON.stringify(boardList));

  const i = boardList[boardId].columns.length - 1;
  window.location.href = "index.html?userid=" + userId + "&focus=textBoxId"+i;

  /* In order to gain focus on the Add new task button in the newly created column,
     the button element id is passed as a url parameter. When the site loads,
     it will be read and focused. */
}

/**
 * Displays input field and button for adding a new column.
 */
function animationForAddBoard(){
  let animateBoard = document.getElementById("add-new-board");
  animateBoard.className = "add-new-board-animation";

  let createNewBoardContainer = document.getElementById("new-board-container");
  createNewBoardContainer.style.display = 'block';
  
  document.getElementById("add-board-field").focus();
}


// Function to show textfield and hide button
function showTextbox(clickedId) {
  let hideButton = document.getElementById(clickedId);
  hideButton.style.display = "none";

  let showText = hideButton.nextElementSibling;
  showText.style.display = "block";

  // Focusing on the textarea shown
  let focus = showText.getElementsByTagName("textarea");
  focus[0].focus();
  
  // Enable use of escape key to interact with the open text box.
  document.addEventListener('keydown', handleKeyPressFromTextbox);

  setSecondTabIndexElements(0);
}

/**
 * Hides the input text box and button for Add new task.
 * Triggered by key press and checks for the "escape" key.
 */
function handleKeyPressFromTextbox(ev) {
  ev = ev || window.event;
  if (ev.keyCode == 27) {
    console.log("escape key from New task textbox");

    document.removeEventListener('keydown', handleKeyPressFromTextbox);
    document.getElementById(ev.target.id).blur(); //remove focus to trigger hideTextBox()
  }
}

// Function to show button and hide textfields
function hideTextBox(object){
  let hideText = document.getElementById(object);
  let parentOfTextarea = hideText.parentElement;
  let showButton = parentOfTextarea.previousElementSibling;

  if (hideText.value.length == 0){

    parentOfTextarea.style.display = "none";

    showButton.style.display = "block";
    showButton.focus();

  }
}
var mainBoardContainer = document.getElementById("main-container");

var columns = [
  {
    title: "To do",
    taskIds: [0], // refers to its index value
    textBoxId: "",
    textAreaId: "",
    newTaskId: "",
  },
  {
    title: "Doing",
    taskIds: [],
    textBoxId: "",
    textAreaId: "",
    newTaskId: "",
  },
  {
    title: "Done",
    taskIds: [1, 2],
    textBoxId: "",
    textAreaId: "",
    newTaskId: "",
  }
];

// Adds ID to the textboxes
function setIds(){
    for (let i = 0; i < columns.length; i++){
      columns[i].textBoxId = `textBoxId${i}`;
      columns[i].textAreaId = `textAreaId${i}`;
      columns[i].newTaskId = `newTaskId${i}`;
    }
}

setIds();

function createTemplateGrid(){ 
  var htmlTxt = "";
  
  for (let i = 0; i < columns.length; i++) {
        
        /* Har startet å flette sammen koden her. La til en id på p tagen
         * rett under slik at jeg får lagt til task elementer på riktig sted.
         * Selve task elementene genereres i index2.js linje 75.
         * Har også lagt til en id tag på 'Add task' knappen for å legge til
         * en onclick event. */

        htmlTxt += `
        <div id="col${i}" class="box" ondrop="drop(event)" ondragover="allowDrop(event)">
            <p id="p${i}" class="textbox"><strong>${columns[i].title}</strong></p>

            <div id="${columns[i].newTaskId}">

            </div>

            <div class="main-boards-tasks main-boards-add-task-btn" id="${columns[i].textBoxId}" onclick="showTextbox(this.id)">
                <p>+Add new task..</p>
            </div>

            <div class="main-boards-tasks-txt">
                <textarea id="${columns[i].textAreaId}" onfocusout="hideTextBox(this.id)" autofocus type="textbox" placeholder="Add new task.."></textarea>
                <input id="col${i}-btn" type="button" value="Add task">
            </div>
            
        </div>
        `;
    }
 
  mainBoardContainer.innerHTML = htmlTxt;  
}

// Prevent interaction when dragging an element.
function allowDrop(ev) {
  ev.preventDefault();
}

// Handles dropping a dragged task over a column.
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

// Function to show textfield and hide button
function showTextbox(clickedId) {

  let hideButton = document.getElementById(clickedId);
  hideButton.style.display = "none";


  let showText = hideButton.nextElementSibling;
  showText.style.display = "block";

  // Focusing on the textarea shown
  let focus = showText.getElementsByTagName("textarea");
  focus[0].focus();
  
}

// Function to show button and hide textfields
function hideTextBox(object){
  let hideText = document.getElementById(object);
  let parentOfTextarea = hideText.parentElement;
  let showButton = parentOfTextarea.previousElementSibling;

  if (hideText.value.length == 0){

  parentOfTextarea.style.display = "none";

  showButton.style.display = "block";

  }
}
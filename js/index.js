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
         * Har også lagt til en id dag på 'Add task' knappen for å legge til
         * en onclick event. */

        htmlTxt += `
        <div class="box">
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

    var newBoard = `
        <div class="box">
            <p class="textbox"><strong>Add new board</strong></p>

                <textarea id="add-new-board" type="textbox" placeholder="Add new task.."></textarea>
                <input type="button" value="Add task">
            
        </div>
    `;
 
  mainBoardContainer.innerHTML = htmlTxt;
  mainBoardContainer.innerHTML += newBoard;
}

function addNewBoard(){
  
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
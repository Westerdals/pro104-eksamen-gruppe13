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

/*
 Forslag er at denne funksjonen kalles fra loadBoardData() i index2.js
 Da kan den motta 'columns' variabelen som er lest inn fra local storage.
 
 Situasjonen vi er i nå er at loadBoardData() er avhengig av at createTemplateGrid()
 har kjørt før den får lagt til tasks etc. og createTemplateGrid() er avhengig
 av at loadBoardData() har kjørt for å få tegnet kolonnene fra storage.
 */
function createTemplateGrid(columns){ 
  var htmlTxt = "";

  for (let i = 0; i < columns.length; i++) {
        
        /* Har startet å flette sammen koden her. La til en id på p tagen
         * rett under slik at jeg får lagt til task elementer på riktig sted.
         * Selve task elementene genereres i index2.js linje 75.
         * Har også lagt til en id dag på 'Add task' knappen for å legge til
         * en onclick event. */

      columns[i].textBoxId = `textBoxId${i}`;
      columns[i].textAreaId = `textAreaId${i}`;
      columns[i].newTaskId = `newTaskId${i}`;


        htmlTxt += `
        <div class="box">
            <p id="p${i}" class="textbox"><strong>${columns[i].title}</strong></p>

            <div id="newTaskId${i}">

            </div>

            <div class="main-boards-tasks main-boards-add-task-btn" id="textBoxId${i}" onclick="showTextbox(this.id)">
                <p>+Add new task..</p>
            </div>

            <div class="main-boards-tasks-txt">
                <textarea id="textAreaId${i}" onfocusout="hideTextBox(this.id)" autofocus type="textbox" placeholder="Add new task.."></textarea>
                <input id="col${i}-btn" type="button" value="Add task">
            </div>
            
        </div>


            `;
    }

    var newBoard = `
        <div id="add-new-board" onclick="animationForAddBoard()">
            <p class="textbox"><strong>Add new board</strong></p>
            <div id="new-board-container">
                <input type="text" id="add-board-field">
                <input type="button" value="Add board" id="add-board-btn" onclick="addNewBoard()">
            </div>
        </div>
    `;
 
  mainBoardContainer.innerHTML = htmlTxt;
  mainBoardContainer.innerHTML += newBoard;
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

  window.location.href = "index.html?" + userId;

}
function animationForAddBoard(){
  let animateBoard = document.getElementById("add-new-board");
  animateBoard.className = "add-new-board-animation";

  let createNewBoardContainer = document.getElementById("new-board-container");
  createNewBoardContainer.style.display = 'block';
}

/*
function outAnimationForAddBoard() {
  let animateBoard = document.getElementById("add-new-board");
  animateBoard.className = "add-new-board-animation-reversed";
}*/

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
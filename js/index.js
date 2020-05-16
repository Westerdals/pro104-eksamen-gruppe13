var mainBoardContainer = document.getElementById("main-container");

var columns = [
    {
      title: "To do",
      taskIds: [0], // refers to its index value
      textBoxId: "",
    },
    {
      title: "Doing",
      taskIds: [],
      textBoxId: "",
    },
    {
      title: "Done",
      taskIds: [1, 2],
      textBoxId: "",
    }
  ];


// Adds ID to the textboxes
function createTextBoxId(){
    for (let i = 0; i < columns.length; i++){
      columns[i].textBoxId = `textBoxId${i}`;
    }
}

createTextBoxId();
  

function createTemplateGrid(){ 
     var htmlTxt = "";

    for (let i = 0; i < columns.length; i++){
        
        htmlTxt += `
        <div class="box">
            <p class="textbox"><strong>${columns[i].title}</strong></p>

            <div class="main-boards-tasks color">
                
                <p>Create tables</p>
                <input type="checkbox" class="main-boards-tasks-check">
                
                <div class="main-boards-tasks-arrow">
                    <i class="arrow right"></i>
                </div>

            </div>

            <div class="main-boards-tasks main-boards-add-task-btn" id="${columns[i].textBoxId}" onclick="showTextbox(this.id)">
                <p>+Add new task..</p>
            </div>

            <div class="main-boards-tasks-txt">
                <textarea type="textbox" placeholder="Add new task.."></textarea>
                <input type="button" value="Add task">
            </div>
            
        </div>


            `;
    }
 
  mainBoardContainer.innerHTML = htmlTxt;  
}

function showTextbox(clickedId) {

  let hideButton = document.getElementById(clickedId);
  hideButton.style.display = "none";

  
}

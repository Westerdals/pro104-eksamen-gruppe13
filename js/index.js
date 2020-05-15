var mainBoardContainer = document.getElementById("main-container");

var columns = [
    {
      title: "To do",
      taskIds: [0] // refers to its index value
    },
    {
      title: "Doing",
      taskIds: []
    },
    {
      title: "Done",
      taskIds: [1, 2]
    }
  ];
  

function createTemplateGrid(){ 
     var htmlTxt = "";

    for (let i = 0; i < columns.length; i++){
        
        htmlTxt += `
        <div class="box">
            <p class="textbox"><strong>${columns[i].title}</strong></p>

            <div class="main-boards-tasks">
                
                <p>Create tables</p>
                <input type="checkbox" class="main-boards-tasks-check">
                
                <div class="main-boards-tasks-arrow">
                    <i class="arrow right"></i>
                </div>

            </div>

            <div class="main-boards-tasks main-boards-add-task-btn">
                <p>+Add new task..</p>
            </div>
            
        </div>


            `;
    }
 
  mainBoardContainer.innerHTML = htmlTxt;  
}

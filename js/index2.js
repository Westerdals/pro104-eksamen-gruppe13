function setLinkParams() {
  let boardA   = document.getElementById("board-a");
  let ideasA   = document.getElementById("ideas-a");
  let membersA = document.getElementById("members-a");
  const userId = getUserId();
  
  boardA.href   = boardA.href   + "?"  + userId;
  ideasA.href   = ideasA.href   + "?"  + userId;
  membersA.href = membersA.href + "?"  + userId;
}

function drawBoard() {

  const userId = 0; //getUserId();
  
  const boardId = 0; // get from user data
  const boardTitle = "Board Title"; // get from board data
  const boardUserIds = [0]; // members "on-board"
  
  // Array with column data
  const columns = [
    {
      title: "Todo",
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
  
  // Array with task data
  const tasks = [
    {
      title: "Task #1",
      description: "",
      deadline: "",
      userIds: []
    },
    {
      title: "Task #2",
      description: "",
      deadline: "",
      userIds: []
    },
    {
      title: "Task #3",
      description: "",
      deadline: "",
      userIds: []
    },
  ];
}
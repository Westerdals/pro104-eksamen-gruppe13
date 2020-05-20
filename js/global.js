function getUserId() {
  const s = window.location.search;
  return s.substring(1, s.length);
}

/**
 * Default columns in a new board.
 */
function getDefaultColumns() {
  return [
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
}

/**
 * Default tasks in a new board.
 */
function getDefaultTasks() {
  return [
    {
      title: "Task #1",
      description: "",
      deadline: "",
      memberIds: [] // assigned members
    },
    {
      title: "Task #2",
      description: "",
      deadline: "",
      memberIds: []
    },
    {
      title: "Task #3",
      description: "",
      deadline: "",
      memberIds: []
    },
  ];
}

function isAlphaNumeric(str) { 
  var pattern = /^[0-9a-zA-Z]+$/; // TODO: make space, bindestrek eligible 2nd character
  return str.match(pattern);
}

function invFormAl(str, minLength, isAlphaNum, name) {
  if (minLength > 0 && str.length < minLength) {
    alert(name + " length must be at least " + minLength);
    return true;
  } else if (isAlphaNum && !isAlphaNumeric(str)) {
    alert(name + " can only contain letters and numbers");
    return true;
  }
  return false;
}

function invFormFb(str, minLength, isAlphaNum, name, fbDiv) {
  if (minLength > 0 && str.length < minLength) {
    fbDiv.innerHTML = name + " length must be at least " + minLength;
    return true;
  } else if (isAlphaNum && !isAlphaNumeric(str)) {
    fbDiv.innerHTML = name + " can only contain letters and numbers";
    return true;
  }
  return false;
}

function getUniqueListId(listName) {

    const list = JSON.parse(window.localStorage.getItem(listName));
    
    if (list == undefined) {
        return 0;
    }
    
    let usedIds = [];
    for (const entry of list) {
        console.log("usedIds["+entry.id+"] = true");
        usedIds[entry.id] = true;
    }
    
    let id = 0;
    do {
    } while (usedIds[++id] == true);

    return id;
}

function createBoard(userId, title, columns, tasks) {
  const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  const boardList = JSON.parse(window.localStorage.getItem("boardList")) || [];
  const userIds = [Number(userId)];
  const boardId = boardList.length;
  board = {userIds, title, columns, tasks};
  boardList.push(board);
  userList[userId].lastBoardId = boardId;
  window.localStorage.setItem("userList", JSON.stringify(userList));
  window.localStorage.setItem("boardList", JSON.stringify(boardList));
}
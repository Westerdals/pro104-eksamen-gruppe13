function getUserId() {
  const s = window.location.search;
  return s.substring(1, s.length);
}

function isAlphaNumeric(str) { 
  var pattern = /^[0-9a-zA-Z]+$/;
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
//globals
var listStopWatch = [];
var idCounter = 1; //gives id to the watch object

//given time in seconds returns a string in format hh:mm:ss
function GiveTimeString(remSeconds) {
  var secs = remSeconds % 60;
  remSeconds = remSeconds - secs;
  var mins = (remSeconds / 60) % 60;
  remSeconds = remSeconds / 60 - mins;
  var hrs = remSeconds / 60;
  if (hrs < 10) hrs = "0" + hrs;
  if (mins < 10) mins = "0" + mins;
  if (secs < 10) secs = "0" + secs;
  return hrs + ":" + mins + ":" + secs;
}

//returns html body for the watch
function StopWatchBody(Watch) {
  var pausePlayButtonStr = function (status) {
    if (status == 1) {
      return (
        "<span class='btn btn-warning glyphicon glyphicon-pause' onclick='PausePlayToggle(this, " +
        Watch.id +
        ")'>Pause</span>"
      );
    } else {
      return (
        "<span class='btn btn-success glyphicon glyphicon-play' onclick='PausePlayToggle(this, " +
        Watch.id +
        ")'>Play</span>"
      );
    }
  };
  var retStr =
    "<div class='col-md-6' id='" +
    Watch.id +
    "'>" +
    "<div class='panel panel-default'>" +
    "<div class='panel-heading'>" +
    "<div class='row'>" +
    "<div class='col-md-8'>" +
    "<h3 class='panel-title'>" +
    Watch.title +
    "</h3>" +
    "</div>" +
    "<div class='col-md-4 text-center'>" +
    "<button type='button' class='btn btn-default glyphicon glyphicon-pencil' data-toggle='modal' data-target='#notesModal' onclick='fillModal(" +
    Watch.id +
    ")'>" +
    " Notes" +
    "</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='panel-body'>" +
    "<h2 class='text-center' + id='watch" +
    Watch.id +
    "'>" +
    GiveTimeString(Watch.curTime - Watch.startTime) +
    "</h2>" +
    "</div>" +
    "<div class='panel-footer'>" +
    "<div class='btn-group btn-group-justified'>" +
    pausePlayButtonStr(Watch.status) +
    "<span class='btn btn-info glyphicon glyphicon-refresh' onclick='RestartClock(" +
    Watch.id +
    ")'>Restart</span>" +
    "<span class='btn btn-danger glyphicon glyphicon-remove' onclick='RemoveOne(" +
    Watch.id +
    ")'>Remove</span>" +
    "<!/div>" +
    "</div>" +
    "</div>" +
    "</div>";

  return retStr;
}

//creates a watch object
function Watch(
  status = 0,
  title,
  startTime = Date.now(),
  curTime = Date.now(),
  notes = []
) {
  if (title == null) title = document.getElementById("title").value;
  this.id = idCounter;
  idCounter = idCounter + 1;
  this.status = status; // 0 -> pause state 1 -> play state
  this.title = title;
  this.startTime = startTime;
  this.curTime = curTime;
  this.notes = notes;
}

//adds watch to DOM
function AddWatch() {
  listStopWatch[listStopWatch.length] = new Watch();
  $("#stopwatches").append(
    StopWatchBody(listStopWatch[listStopWatch.length - 1])
  );
  document.getElementById("title").value = "";
}

function ShowList() {
  console.log(listStopWatch);
  // for(var i = 0; i < listStopWatch.length; i++) {
  // 	console.log(listStopWatch[i].title);
  // }
}

//removes a single clock when called
function RemoveOne(id) {
  document.getElementById(id).outerHTML = "";
  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].id == id) {
      listStopWatch.splice(i, 1);
      break;
    }
  }
}

//restarts the time for one clock
function RestartClock(id) {
  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].id == id) {
      listStopWatch[i].startTime = Date.now();
      listStopWatch[i].curTime = Date.now();
      document.getElementById("watch" + id).innerHTML = GiveTimeString(0);
    }
  }
}

//for pause play
function PausePlayToggle(elem, id) {
  if (elem.innerHTML == "Pause") {
    elem.outerHTML =
      "<span class='btn btn-success glyphicon glyphicon-play' onclick='PausePlayToggle(this, " +
      id +
      ")'>Play</span>";
    for (var i = 0; i < listStopWatch.length; i++) {
      if (listStopWatch[i].id == id) {
        listStopWatch[i].status = 0;
      }
    }
  } else if (elem.innerHTML == "Play") {
    elem.outerHTML =
      "<span class='btn btn-warning glyphicon glyphicon-pause' onclick='PausePlayToggle(this, " +
      id +
      ")'>Pause</span>";
    for (var i = 0; i < listStopWatch.length; i++) {
      if (listStopWatch[i].id == id) {
        listStopWatch[i].status = 1;
      }
    }
  }
}

//removes all clocks
function RemoveAll() {
  listStopWatch = [];
  idCounter = 1;
  $("#stopwatches").html("");
}

//updates the time in clocks
function updateClocks() {
  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].status !== 0) {
      listStopWatch[i].curTime += 1;
      var tempId = "watch" + listStopWatch[i].id;
      var tempModalId = "note" + listStopWatch[i].id;
      document.getElementById(tempId).innerHTML = GiveTimeString(
        listStopWatch[i].curTime - listStopWatch[i].startTime
      );
      if (document.getElementById(tempModalId) !== null) {
        document.getElementById(tempModalId).innerHTML = GiveTimeString(
          listStopWatch[i].curTime - listStopWatch[i].startTime
        );
      }
    }
  }
}

//function to add note to the watch's list and reload the modal
function AddNote(id) {
  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].id == id) {
      listStopWatch[i].notes.push(document.getElementById("newNote").value);
      fillModal(id);
      break;
    }
  }
}

//function to remove note from list when cross button in list items is pressed
function RemoveNote(elem, id, noteIndex) {
  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].id == id) {
      listStopWatch[i].notes.splice(noteIndex, 1);
      elem.outerHTML = "";
    }
  }
}

//function to fill the modal dynamically when a note button is called
function fillModal(id) {
  var watch = null;
  var retHtmlTitle = "";
  var retHtmlBody = "";
  var retHtmlFooter = "";

  for (var i = 0; i < listStopWatch.length; i++) {
    if (listStopWatch[i].id == id) {
      watch = listStopWatch[i];
    }
  }
  if (watch == null) {
    console.log("error");
  }

  retHtmlTitle = watch.title;

  retHtmlBody =
    retHtmlBody +
    "<h2 class='text-center' + id='note" +
    watch.id +
    "'>" +
    GiveTimeString(watch.curTime - watch.startTime) +
    "</h2>" +
    "<hr>";

  retHtmlBody += "<ul class='list-group'>";
  for (var i = 0; i < watch.notes.length; i++) {
    retHtmlBody +=
      "<li class='row list-group-item'>" +
      "<p class='col-md-11 list-item'>" +
      watch.notes[i] +
      "</p>" +
      "<span class='col-md-1 glyphicon glyphicon-remove pull-right' onclick='RemoveNote(this.parentNode, " +
      watch.id +
      ", " +
      i +
      ")'>" +
      "</span>" +
      "</li>";
  }
  retHtmlBody += "</ul>";

  retHtmlFooter +=
    "<div class='input-group'>" +
    "<input type='text' name='noteText' class='form-control' id='newNote' placeholder='Write Note' onKeyDown='if(event.which==13) AddNote(" +
    watch.id +
    ")' />" +
    "<span class='input-group-btn'>" +
    "<button onclick='AddNote(" +
    watch.id +
    ")' class='form-control btn btn-primary'><span class='glyphicon glyphicon-plus'></span> Add Note </button>" +
    "</span>" +
    "</div>";

  $("#notesModalTitle").html(retHtmlTitle);
  $("#notesModalBody").html(retHtmlBody);
  $("#notesModalFooter").html(retHtmlFooter);
}

//clocks get updated each second because of this
setInterval(updateClocks, 1000);

//store the list of stopwatches in the cookie so that reloading the page does not cause data to loss
window.onbeforeunload = function (e) {
  e = e || window.event;
  localStorage.setItem("myCookie", JSON.stringify(listStopWatch));
};

//load the list of stopwatches in listStopWatch and attach them to html is list is present in cookie.
window.onload = function (e) {
  e = e || window.event;
  var X = JSON.parse(localStorage.getItem("myCookie"));
  for (var i = 0; i < X.length; i++) {
    listStopWatch[listStopWatch.length] = new Watch(
      X[i].status,
      X[i].title,
      X[i].startTime,
      X[i].curTime,
      X[i].notes
    );
    $("#stopwatches").append(
      StopWatchBody(listStopWatch[listStopWatch.length - 1])
    );
  }
};

function detectEnter(event) {
  event = event || window.event;
  if (event.keyCode == 13) {
    AddWatch();
  }
}


//Set event listeners for each target.

var addWatchButton = document.getElementById("addWatch-btn");
addWatchButton.addEventListener("click", AddWatch);
console.log(addWatchButton.textContent)

var removeAllButton = document.getElementById("removeAll-btn");
removeAllButton.addEventListener("click", RemoveAll);
console.log(removeAllButton.textContent);
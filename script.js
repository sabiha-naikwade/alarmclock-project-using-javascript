// Alarm Clock Class
class AlarmClock {
  hours;
  minutes;
  seconds;
  zone;
  day;

  constructor(hours, minutes, seconds, zone, day) {
    this.hours = formatTime(hours);
    this.minutes = formatTime(minutes);
    this.seconds = formatTime(seconds);
    this.zone = zone;
    this.day = day;
  }

  getAlarm(newAlarm) {
    const html = `
    <li id="child" class = "time-list alarm">
        <span class="time">${this.hours}:${this.minutes}:${this.seconds} ${this.zone} ${this.day}</span>
        <button class="deleteAlarm time-control" id="delete-button" onclick="clearAlarm(this.value)" name="deleteButton"  value=${newAlarm}><i class="far fa-trash-alt"></i></button>
        <hr style="border:none;margin:0;width:100%;height:1px;background-color:#D6E4E5"/>
    </li>`

    myList.innerHTML += html;
  }

  setAlarm(newAlarm) {
    
    let alarm = `${this.hours}:${this.minutes}:${this.seconds}${this.zone}${this.day}`

    if (isNaN(alarm)) {
      if (!alarmList.includes(alarm)) {
        alarmList.push(alarm);
        newAlarm.getAlarm(alarm);
        addAlarm.reset();
        
      } else {
        alert(`Alarm for ${this.hours}:${this.minutes}:${this.seconds} ${this.zone} ${this.day} already set.`);
      }
    } else {
      alert("Invalid Time Entered")
    }

  }

  static deleteAlarm(value) {
    //To delete alarm from alarmList
    let newList = alarmList.filter((time) => time != value);
    alarmList.length = 0; // Clear contents
    alarmList.push.apply(alarmList, newList);

    //To delete alarm list element from the list
    var child = document.getElementById('child');
    var parent = child.parentNode;
    var index = Array.from(parent.children).indexOf(child);
    console.log(index);
    if (myList.hasChildNodes()) {
      myList.removeChild(myList.children[0]);
    }

    console.log("Alarm Deleted!");
  }

  //To stop alarm
  static stopAlarm() {
    audio.pause();
    if (alarmTimeout) {
      clearTimeout(alarmTimeout);
      alert('Alarm cleared');
    }
    console.log("Alarm Stopped!");
    alert("Maximum snooze limit reached!");
  }

  //To snooze alarm for max 3 times
  static snoozeAlarm() {
    audio.pause();
    snooze++;
    console.log(snooze);
    if (snooze <= 3 && snoozeAttempts !=0) {
      setTimeout(() => {
        audio.play();
      }, 300000);
    alert("Alarm snoozed for next 5 minutes! You can snooze the alarm for maximum "+`${--snoozeAttempts}`+" times.");
    }
    else{
        snooze = 0;
        snoozeAttempts = 3;
        AlarmClock.stopAlarm();
    }

  }

}



//div to show current time
const time = document.getElementById('time');

//  List of alarms
const alarmList = [];

let alarmTime = null;
let alarmTimeout = null;
let snooze = 0;
let snoozeAttempts = 3;

// function to show current time
function currentTime() {
  var today = new Date();
  let hours = formatTime(today.getHours());
  let minutes = formatTime(today.getMinutes());
  let seconds = formatTime(today.getSeconds());
  let day = today.toLocaleDateString("en-IN", {
    weekday: "long"
  });
  let zone = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours = formatTime(hours % 12);
  }

  const now = `${hours}:${minutes}:${seconds}${zone}${day}`;

  time.innerText = `${hours}:${minutes}:${seconds} ${zone} ${day} `;

  //To play the set alarm
  if (alarmList.includes(now)) {
    ringing(now);
  }

}

//function to set correct format of time e.g. "1:2:3" to "01:02:03"

function formatTime(time) {
  if (time < 10 && time.length != 2) {
    return "0" + time;
  }

  return time;
}
setInterval(currentTime, 1000);


// Alarm sound
const audio = new Audio("alarm.mp3");
audio.loop = true;

const myList = document.querySelector('#myList'); //ul element
const addAlarm = document.querySelector('.set-alarm'); //form element
const weekday = document.getElementById("weekdays"); //element to select weekday


// event to set a new alarm on clicking submit button
addAlarm.addEventListener('submit', e => {
  e.preventDefault();
  // const newAlarm = addAlarm.alarmTime.value;
  let new_h = formatTime(addAlarm.hour.value);

  let new_m = formatTime(addAlarm.minute.value);

  let new_s = formatTime(addAlarm.second.value);

  let zone = addAlarm.zone.value;

  let new_d = addAlarm.weekdays.value;

  const newAlarm = new AlarmClock(new_h, new_m, new_s, zone, new_d);

  newAlarm.setAlarm(newAlarm);

});


//removes an alarm from the array when "Delete Alarm" is clicked
function clearAlarm(value) {
  AlarmClock.deleteAlarm(value);
}


// Plays the alarm audio at correct time
function ringing(now) {
  audio.play();
}

//To stop the current playing alarm
function stopTheAlarm() {
  AlarmClock.stopAlarm();
}

//To snooze the current playing alarm for max 3 times
function pauseAlarm() {
  AlarmClock.snoozeAlarm();
}

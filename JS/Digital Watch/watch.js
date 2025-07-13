//Bismillah

const colors = [
  "#00ffcc",
  "#ff00cc",
  "#ccff00",
  "#ff6600",
  "#00ccff",
  "#ff0066",
];
let colorIndex = 0;

function updateBorderColor() {
  const clockBox = document.querySelector(".clock-box");
  clockBox.style.borderColor = colors[colorIndex];
  clockBox.style.boxShadow = `0 0 30px ${colors[colorIndex]}`;
  colorIndex = (colorIndex + 1) % colors.length;
}

function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  const timeString = `${hh}:${mm}:${ss} ${ampm}`;
  document.getElementById("clock").textContent = timeString;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = now.toLocaleDateString(undefined, options);
  document.getElementById("date").textContent = dateString;
}

function getTemperature(lat, lon) {
  const apiKey = "79fd69f8faf1faa9af3208e454e37993";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const temp = Math.round(data.main.temp);
      const city = data.name;
      const humidity = data.main.humidity;
      document.getElementById("temp").textContent = `🌡️ ${temp}°C in ${city}`;
      document.getElementById("humidity").textContent = `💧 Humidity: ${humidity}%`;
    })
    .catch((err) => {
      document.getElementById("temp").textContent = "Failed to fetch temperature";
      document.getElementById("humidity").textContent = "";
      console.error(err);
    });
}

function fetchLocationAndTemperature() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getTemperature(lat, lon);
      },
      (error) => {
        document.getElementById("temp").textContent = "Location access denied";
        document.getElementById("humidity").textContent = "";
      }
    );
  } else {
    document.getElementById("temp").textContent = "Geolocation not supported";
    document.getElementById("humidity").textContent = "";
  }
}

setInterval(updateClock, 1000);
updateClock();

setInterval(updateBorderColor, 1000);
updateBorderColor();

fetchLocationAndTemperature();


// Alarm feature below

let alarmTime = null;
let alarmTimeout = null;
let alarmStopTimeout = null;

const alarmAudio = document.getElementById("alarm-audio");
const alarmStatus = document.getElementById("alarm-status");
const stopAlarmBtn = document.getElementById("stop-alarm-btn");

document.getElementById("set-alarm-btn").addEventListener("click", () => {
  const input = document.getElementById("alarm-time").value;
  if (!input) {
    alarmStatus.textContent = "Please select a valid time for the alarm.";
    return;
  }
  alarmTime = input;
  alarmStatus.textContent = `Alarm set for ${alarmTime}`;
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
  }
  if (alarmStopTimeout) {
    clearTimeout(alarmStopTimeout);
  }
  checkAlarm();
});

stopAlarmBtn.addEventListener("click", () => {
  stopAlarmSound();
});

function checkAlarm() {
  if (!alarmTime) return;

  const now = new Date();
  const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);

  const alarmDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    alarmHours,
    alarmMinutes,
    0,
    0
  );

  if (alarmDate.getTime() - now.getTime() < 0) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }

  const timeToAlarm = alarmDate.getTime() - now.getTime();

  alarmTimeout = setTimeout(() => {
    alarmAudio.loop = true;
    alarmAudio.play();
    alarmStatus.textContent = "Alarm ringing! ⏰";

    alarmStopTimeout = setTimeout(() => {
      stopAlarmSound();
    }, 20000); // Stop after 20 seconds
  }, timeToAlarm);
}

function stopAlarmSound() {
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  alarmAudio.loop = false;
  alarmStatus.textContent = "Alarm stopped.";
  if (alarmStopTimeout) {
    clearTimeout(alarmStopTimeout);
  }
}

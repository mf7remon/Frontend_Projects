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
      document.getElementById("temp").textContent = `🌡️ ${temp}°C in ${city}`;
    })
    .catch((err) => {
      document.getElementById("temp").textContent =
        "Failed to fetch temperature";
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
      }
    );
  } else {
    document.getElementById("temp").textContent = "Geolocation not supported";
  }
}

setInterval(updateClock, 1000);
updateClock();

setInterval(updateBorderColor, 1000);
updateBorderColor();

fetchLocationAndTemperature();

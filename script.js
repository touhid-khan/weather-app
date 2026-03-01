const apiKey = "4a0438440857eb544edd63f2efd13057";

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather(searchInput.value);
        searchInput.value = "";
    }
});

async function getWeather(city) {

    const loading = document.getElementById("loadingMessage");
    const error = document.getElementById("errorMessage");

    // Show loading
    loading.style.display = "block";
    error.style.display = "none";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        updateCurrentWeather(data);
        getForecast(city);

    } catch (err) {
        error.textContent = err.message;
        error.style.display = "block";
    }

    // Hide loading
    loading.style.display = "none";
}

async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("Forecast not available");

        const data = await response.json();

        updateTodayForecast(data);

    } catch (error) {
        console.log("Forecast error:", error.message);
    }
}

function updateCurrentWeather(data) {

    // City name
    const cityElement = document.getElementById("cityName");
    if (cityElement) {
        cityElement.textContent = data.name;
    }

    // Temperature
    const tempElement = document.getElementById("temperature");
    if (tempElement) {
        tempElement.textContent = Math.round(data.main.temp) + "°";
    }

    // Humidity (replace chanceRain text)
    const rainElement = document.getElementById("chanceRain");
    if (rainElement) {
        rainElement.textContent = "Humidity: " + data.main.humidity + "%";
    }

    // Weather icon
    const iconElement = document.querySelector(".weather-icon");
    if (iconElement) {
        iconElement.textContent = getWeatherIcon(data.weather[0].main);
    }

    // Air conditions
    document.getElementById("realFeel").textContent =
        Math.round(data.main.feels_like) + "°";

    document.getElementById("windSpeed").textContent =
        data.wind.speed + " m/s";

    document.getElementById("humidity").textContent =
        data.main.humidity + "%";

    document.getElementById("pressure").textContent =
        data.main.pressure + " hPa";

    changeBackground(data.weather[0].main);

    document.querySelector(".current-weather").classList.add("fade-in");
    document.querySelector(".air-conditions").classList.add("slide-up");
}

function updateTodayForecast(data) {

    const forecastContainer = document.getElementById("todayForecast");
    if (!forecastContainer) return;

    forecastContainer.innerHTML = "";

    const today = new Date().getDate();

    const todayData = data.list.filter(item => {
        const date = new Date(item.dt_txt);
        return date.getDate() === today;
    });

    const limitedData = todayData.slice(0, 6);

    limitedData.forEach(item => {

        const dateObj = new Date(item.dt_txt);
        let hours = dateObj.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;

        const time = hours + " " + ampm;
        const temp = Math.round(item.main.temp) + "°";

        const forecastItem = document.createElement("div");
        forecastItem.innerHTML = `${time}<br>${temp}`;

        forecastContainer.appendChild(forecastItem);
    });

    document.querySelector(".hourly").classList.add("fade-in");
}

function getWeatherIcon(condition) {
    switch (condition) {
        case "Clear":
            return "☀";
        case "Clouds":
            return "☁";
        case "Rain":
            return "🌧";
        case "Thunderstorm":
            return "⛈";
        case "Snow":
            return "❄";
        default:
            return "🌤";
    }
}

function getLocationWeather() {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        updateCurrentWeather(data);
        getForecast(data.name);

    });
}

window.onload = getLocationWeather;

function changeBackground(condition) {

    const body = document.body;

    switch (condition) {
        case "Clear":
            body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
            break;

        case "Clouds":
            body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;

        case "Rain":
            body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
            break;

        case "Snow":
            body.style.background = "linear-gradient(to right, #e6dada, #274046)";
            break;

        default:
            body.style.background = "linear-gradient(to right, #2193b0, #6dd5ed)";
    }
}

const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        toggleBtn.textContent = "☀ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        toggleBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        toggleBtn.textContent = "☀ Light Mode";
    }
});
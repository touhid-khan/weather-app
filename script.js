const apiKey = "4a0438440857eb544edd63f2efd13057";

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather(searchInput.value);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        updateCurrentWeather(data);

    } catch (error) {
        alert(error.message);
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
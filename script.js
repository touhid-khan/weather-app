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
        // Fetch forecast data
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!forecastResponse.ok) throw new Error("Forecast not found");

        const forecastData = await forecastResponse.json();

        updateTodayForecast(forecastData);

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

function updateTodayForecast(data) {

    const forecastContainer = document.getElementById("todayForecast");

    if (!forecastContainer) return;

    forecastContainer.innerHTML = ""; // Clear old forecast

    const today = new Date().getDate();

    // Filter only today's data
    const todayData = data.list.filter(item => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.getDate() === today;
    });

    // Take next 4 time slots (every 3 hours)
    const nextHours = todayData.slice(0, 4);

    nextHours.forEach(item => {

        const dateObj = new Date(item.dt_txt);
        let hours = dateObj.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;

const time = hours + " " + ampm;
        const temp = Math.round(item.main.temp);
        const icon = getWeatherIcon(item.weather[0].main);

        const forecastItem = `
            <div class="forecast-item">
                <p>${time}</p>
                <p>${icon}</p>
                <p>${temp}°</p>
            </div>
        `;

        forecastContainer.innerHTML += forecastItem;
    });
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
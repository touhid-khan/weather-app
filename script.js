const apiKey = "4a0438440857eb544edd63f2efd13057";

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    getWeather(city);
});

document.getElementById("cityInput")
    .addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temperature").textContent =
            `Temperature: ${data.main.temp} °C`;
        document.getElementById("description").textContent =
            `Condition: ${data.weather[0].description}`;

    } catch (error) {
        document.getElementById("weatherResult").innerHTML =
            `<p>${error.message}</p>`;
    }
}
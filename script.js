const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfoContainer = document.getElementById('weather-info-container');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weather-icon');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

searchBtn.addEventListener('click', () => {
    fetchWeatherForCity(cityInput.value);
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        fetchWeatherForCity(cityInput.value);
    }
});

const fetchWeatherForCity = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
        alert('Please enter a city name.');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const weatherData = await response.json();
        updateWeatherUI(weatherData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message);
    }
};

const updateWeatherUI = (data) => {
    const cityName = data.name;
    const temperature = `${Math.round(data.main.temp)}°C`;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = `Humidity: ${data.main.humidity}%`;
    const windSpeed = `Wind Speed: ${data.wind.speed.toFixed(1)} m/s`;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    cityNameEl.textContent = cityName;
    temperatureEl.textContent = temperature;
    descriptionEl.textContent = description;
    weatherIconEl.src = iconUrl;
    weatherIconEl.alt = description;
    humidityEl.textContent = humidity;
    windSpeedEl.textContent = windSpeed;

    weatherInfoContainer.style.display = 'block';
};

weatherInfoContainer.style.display = 'none';

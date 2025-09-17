const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfoContainer = document.getElementById('weather-info-container');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weather-icon');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

const suggestionsContainer = document.getElementById('suggestions-container');

searchBtn.addEventListener('click', () => {
    fetchWeatherForCity(cityInput.value);
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        fetchWeatherForCity(cityInput.value);
    }
});

cityInput.addEventListener('input', () => {
    const query = cityInput.value;
    debounceAutocomplete(query);
});

const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const debounceAutocomplete = debounce(async (query) => {
    if (query.length < 3) {
        suggestionsContainer.innerHTML = '';
        return;
    }

    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}, 300);

const displaySuggestions = (cities) => {
    suggestionsContainer.innerHTML = '';
    if (cities.length === 0) {
        return;
    }

    cities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');

        const cityName = city.name;
        const stateName = city.state ? `, ${city.state}` : '';
        const countryName = city.country;
        suggestionItem.textContent = `${cityName}${stateName}, ${countryName}`;

        suggestionItem.addEventListener('click', () => {
            cityInput.value = cityName;
            fetchWeatherForCity(cityName);
            suggestionsContainer.innerHTML = '';
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
};

const fetchWeatherForCity = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
        alert('Please enter a city name.');
        return;
    }

    suggestionsContainer.innerHTML = '';

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

const fetchWeatherForLocation = async (latitude, longitude) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Unable to retrieve weather for your location.');
        }

        const weatherData = await response.json();
        updateWeatherUI(weatherData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message);
    }
};

const getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherForLocation(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Could not get your location. Please enter a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter a city manually.');
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

window.addEventListener('load', getCurrentLocation);

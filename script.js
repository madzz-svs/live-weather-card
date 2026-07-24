const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const statusMessage = document.getElementById('statusMessage');
const weatherResult = document.getElementById('weatherResult');

const cityName = document.getElementById('cityName');
const tempDisplay = document.getElementById('tempDisplay');
const windSpeed = document.getElementById('windSpeed');
const conditionText = document.getElementById('conditionText');
const weatherIcon = document.getElementById('weatherIcon');

function getWeatherMeta(code) {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️' };
  if (code >= 1 && code <= 3) return { text: 'Partly Cloudy', icon: '⛅' };
  if (code >= 45 && code <= 48) return { text: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 67) return { text: 'Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { text: 'Snow', icon: '❄️' };
  if (code >= 95) return { text: 'Thunderstorm', icon: '🌩️' };
  return { text: 'Overcast', icon: '☁️' };
}

async function fetchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  statusMessage.textContent = 'Searching location...';
  statusMessage.classList.remove('error');
  weatherResult.classList.add('hidden');

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError('City not found. Please try another name.');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    statusMessage.textContent = 'Fetching weather...';
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) throw new Error('Weather server error');

    const weatherData = await weatherResponse.json();
    const current = weatherData.current_weather;
    const meta = getWeatherMeta(current.weathercode);

    cityName.textContent = `${name}, ${country || ''}`;
    tempDisplay.textContent = `${Math.round(current.temperature)}°C`;
    windSpeed.textContent = `${current.windspeed} km/h`;
    conditionText.textContent = meta.text;
    weatherIcon.textContent = meta.icon;

    statusMessage.textContent = '';
    weatherResult.classList.remove('hidden');

  } catch (err) {
    showError('Could not fetch weather data. Check your connection.');
    console.error(err);
  }
}

function showError(msg) {
  statusMessage.textContent = msg;
  statusMessage.classList.add('error');
  weatherResult.classList.add('hidden');
}

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchWeather();
});

const fetchBtn = document.getElementById('fetchBtn');
const weatherResult = document.getElementById('weatherResult');

fetchBtn.addEventListener('click', () => {
  // Hardcoded coordinates for location
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=8.52&longitude=76.93&current_weather=true';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      const windspeed = data.current_weather.windspeed;

      weatherResult.innerHTML = `
        <p>Temperature: ${temp}°C</p>
        <p>Wind Speed: ${windspeed} km/h</p>
      `;
    });
});

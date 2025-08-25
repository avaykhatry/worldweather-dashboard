document.addEventListener("DOMContentLoaded", function () {
  const lat = 27.700769;
  const lon = 85.300140;


  // fetch(`https://geocoding-api.open-meteo.com/v1/search?name=kathmandu&count=10&language=en&format=json`)
  // .then((Response) => {
  //   if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
  // })
  // .then((data) => {
  //   console.log(`The data is 
  //     ${data}`);
  // })
  // .catch(error => console.error(`Error: ${error}`));

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=rain,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`
  )
    .then((Response) => {
      if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
      return Response.json();
    })
    .then((data) => {
      console.log(data);

      // current Time
      const currentDate = data.daily.time[0];
      const currentDateTime = data.current.time;
      // const splicedCurrentTime = "2025-08-25";
      const indexOfCurrentDate = data.daily.time.indexOf(currentDate);
      const indexOfCurrentDateTime = data.hourly.time.indexOf(currentDateTime);
      console.log(indexOfCurrentDate);

      //current temp
      const currentTemp = document.querySelector("#current-temp");
      currentTemp.innerHTML = data.hourly.temperature_2m[indexOfCurrentDateTime];

      // min/max temperature
      const maxTemp = document.querySelector("#max-temp");
      maxTemp.innerHTML = `Max: ${data.daily.temperature_2m_max[indexOfCurrentDate]}\u00B0C`;

      const minTemp = document.querySelector("#min-temp");
      minTemp.innerHTML = `Min: ${data.daily.temperature_2m_min[indexOfCurrentDate]}\u00B0C`;

      // weather info
      const dayWeatherCode = data.current.weather_code;
      console.log(dayWeatherCode);

      fetch('wmo-code.json')
      .then(Response => Response.json())
      .then(data => {
        console.log(data);
        console.log(data[dayWeatherCode].day.description);

        // current weather day/night
        const dayWeather = document.querySelector("#day-weather");
        const nightWeather = document.querySelector("#night-weather");

        dayWeather.innerHTML = `Day Weather: ${data[dayWeatherCode].day.description}`;
        nightWeather.innerHTML = `Night Weather: ${data[dayWeatherCode].night.description}`;
      })
      .catch(error => console.error(`Error: ${error}`));
      const nightWeather = document.querySelector("#night-weather");





      //sunset-time
      const sunsetTime = document.querySelector("#sunset-time");
      sunsetTime.innerHTML = data.daily.sunset[0];

      // sunrise time
      const sunriseTime = document.querySelector("#sunrise-time");
      sunriseTime.innerHTML = data.daily.sunrise[0];

      // rain info
      // const rainInfo = document.querySelector("#rain");
      // rainInfo.innerHTML = data.current.rain;


      //hourly data of the temperature
      document.querySelector("form").onsubmit = function() {
        const locationInput = document.querySelector("#location-input").value;
        console.log(locationInput);
      };

    })
    .catch((error) => console.error(`Error: ${error}`));
});

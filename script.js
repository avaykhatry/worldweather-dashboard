document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("locationInput")) {
    localStorage.setItem("locationInput", "kathmandu");
  }

  let lat = 27.70169;
  let lon = 85.3206;
  let locationInput = localStorage.getItem("locationInput");
  document.querySelector("#current-loc").innerHTML = locationInput;
  console.log(`the global locationInput is ${locationInput}`);

  document.querySelector("form").onsubmit = function () {
    locationInput = document.querySelector("#location-input").value;
    console.log(locationInput);
    document.querySelector("#current-loc").innerHTML = locationInput;
    localStorage.setItem("locationInput", locationInput);
    // fetch no. 1
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=10&language=en&format=json`
    )
      .then((Response) => {
        if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
        return Response.json();
      })
      .then((data) => {
        console.log(data);
        lat = data.results[0].latitude;
        console.log(`I'm an inner lat ${lat}`);
        lon = data.results[0].longitude;
        console.log(lon);

        // fetch no. 2
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&minutely_15=temperature_2m&current=rain,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`
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
            const indexOfCurrentDateTime =
              data.minutely_15.time.indexOf(currentDateTime);
            console.log(`The index of currentDatae is ${indexOfCurrentDate}`);

            //current temp
            const currentTemp = document.querySelector("#current-temp");
            currentTemp.innerHTML =
              data.minutely_15.temperature_2m[indexOfCurrentDateTime];

            // min/max temperature
            const maxTemp = document.querySelector("#max-temp");
            maxTemp.innerHTML = `Max: ${data.daily.temperature_2m_max[indexOfCurrentDate]}\u00B0C`;

            const minTemp = document.querySelector("#min-temp");
            minTemp.innerHTML = `Min: ${data.daily.temperature_2m_min[indexOfCurrentDate]}\u00B0C`;

            // weather info
            const dayWeatherCode = data.current.weather_code;
            console.log(dayWeatherCode);

            fetch("wmo-code.json")
              .then((Response) => Response.json())
              .then((data) => {
                console.log(data);
                console.log(data[dayWeatherCode].day.description);

                // current weather day/night
                const dayWeather = document.querySelector("#day-weather");
                const nightWeather = document.querySelector("#night-weather");

                dayWeather.innerHTML = `Day: ${data[dayWeatherCode].day.description}`;
                nightWeather.innerHTML = `Night: ${data[dayWeatherCode].night.description}`;
              })
              .catch((error) => console.error(`Error: ${error}`));
            const nightWeather = document.querySelector("#night-weather");

            //sunset-time
            const sunsetTime = document.querySelector("#sunset-time");
            sunsetTime.innerHTML = `Sunset: ${data.daily.sunset[0].slice(
              11,
              16
            )}`;

            // sunrise time
            const sunriseTime = document.querySelector("#sunrise-time");
            sunriseTime.innerHTML = `Sunrise: ${data.daily.sunrise[0].slice(
              11,
              16
            )}`;

            // rain info
            // const rainInfo = document.querySelector("#rain");
            // rainInfo.innerHTML = data.current.rain;
          })
          .catch((error) => console.error(`Error: ${error}`));
      })
      .catch((error) => console.error(`Error: ${error}`));
    console.log(`the lat is ${lat}`);

    return false;
  };

  // fetch no. 1
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=10&language=en&format=json`
  )
    .then((Response) => {
      if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
      return Response.json();
    })
    .then((data) => {
      console.log(data);
      let lat = data.results[0].latitude;
      console.log(lat);
      let lon = data.results[0].longitude;
      console.log(lon);

      // fetch no. 2
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&minutely_15=temperature_2m&current=rain,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`
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
          const indexOfCurrentDateTime =
            data.minutely_15.time.indexOf(currentDateTime);
          console.log(`The index of currentDatae is ${indexOfCurrentDate}`);

          //current temp
          const currentTemp = document.querySelector("#current-temp");
          currentTemp.innerHTML =
            data.minutely_15.temperature_2m[indexOfCurrentDateTime];

          // min/max temperature
          const maxTemp = document.querySelector("#max-temp");
          maxTemp.innerHTML = `Max: ${data.daily.temperature_2m_max[indexOfCurrentDate]}\u00B0C`;

          const minTemp = document.querySelector("#min-temp");
          minTemp.innerHTML = `Min: ${data.daily.temperature_2m_min[indexOfCurrentDate]}\u00B0C`;

          // weather info
          const dayWeatherCode = data.current.weather_code;
          console.log(dayWeatherCode);

          fetch("wmo-code.json")
            .then((Response) => Response.json())
            .then((data) => {
              console.log(data);
              console.log(data[dayWeatherCode].day.description);

              // current weather day/night
              const dayWeather = document.querySelector("#day-weather");
              const nightWeather = document.querySelector("#night-weather");

              dayWeather.innerHTML = `Day: ${data[dayWeatherCode].day.description}`;
              nightWeather.innerHTML = `Night: ${data[dayWeatherCode].night.description}`;
            })
            .catch((error) => console.error(`Error: ${error}`));
          const nightWeather = document.querySelector("#night-weather");

          //sunset-time
          const sunsetTime = document.querySelector("#sunset-time");
          sunsetTime.innerHTML = `Sunset: ${data.daily.sunset[0].slice(
            11,
            16
          )}`;

          // sunrise time
          const sunriseTime = document.querySelector("#sunrise-time");
          sunriseTime.innerHTML = `Sunrise: ${data.daily.sunrise[0].slice(
            11,
            16
          )}`;

          // rain info
          // const rainInfo = document.querySelector("#rain");
          // rainInfo.innerHTML = data.current.rain;
        })
        .catch((error) => console.error(`Error: ${error}`));
    })
    .catch((error) => console.error(`Error: ${error}`));
});

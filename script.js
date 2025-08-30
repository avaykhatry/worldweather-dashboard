document.addEventListener("DOMContentLoaded", function () {
  // global referece so we can replace it's value whenever we want
  let map;
  let weatherMarker;

  // map function start
  function showMap(lat, lon, iconUrl, iconDescription) {
    if (!map) {
      map = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);
    } else {
      map.setView([lat, lon], 13);

      if (weatherMarker) {
        map.removeLayer(weatherMarker);
      }
    }

    const weatherIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    // Add marker with popup
    weatherMarker = L.marker([lat, lon], { icon: weatherIcon })
      .addTo(map)
      .bindPopup("Weather: " + iconDescription)
      .openPopup();
  }
  // map function end

  // hourly Temperature Function start
  let myLineChart;
  function hourlyTempFunc(tempArray, newHourArray) {
    // const hourlyTemp = document.querySelector("#hourly-temp");
    const ctx = document.getElementById("myChart");

    if (myLineChart) {
      myLineChart.destroy();
    }

    myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: newHourArray,
        datasets: [
          {
            label: "Hourly Temperature",
            data: tempArray,
            backgroundColor: "lightblue",
            borderColor: "hotpink",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  // hourly Temperature Function end

  // visibility function start
  function visibilityFunc(visibilityData) {
    let visibilityStatus;
    console.log(visibilityData);
    if (visibilityData < 1000) {
      visibilityStatus = `Poor`;
    } else if (visibilityData >= 1000 && visibilityData < 5000) {
      visibilityStatus = `Moderate`;
    } else if (visibilityData >= 5000 && visibilityData < 10000) {
      visibilityStatus = `Good`;
    } else {
      visibilityStatus = `Excellent`;
    }
    document.querySelector("#visibility").innerHTML = visibilityStatus;
  }
  // visibility function end

  // uv index start
  function uvIndexFunc(uvIndexData) {
    const uvData = document.querySelector("#uv-data");
    let uvDataStatus;
    if (uvIndexData < 3) {
      uvDataStatus = "Low";
    } else if (uvIndexData >= 3 && uvIndexData < 6) {
      uvDataStatus = "Moderate";
    } else if (uvIndexData >= 6 && uvIndexData < 8) {
      uvDataStatus = "High";
    } else if (uvIndexData >= 8 && uvIndexData < 11) {
      uvDataStatus = "Very High";
    } else {
      uvDataStatus = "Extreme";
    }
    uvData.innerHTML = uvDataStatus;
  }
  // uv index end

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
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,sunrise,sunset,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&minutely_15=temperature_2m,wind_speed_10m,wind_direction_10m,visibility&current=rain,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`
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
            console.log(
              `The index of currentDateTime is ${indexOfCurrentDateTime}`
            );

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

                // map
                const iconUrl = data[dayWeatherCode].day.image;
                const iconDescription = data[dayWeatherCode].day.description;
                showMap(lat, lon, iconUrl, iconDescription);
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

            //hourly temp
            tempArray = data.hourly.temperature_2m.slice(0, 24);
            hourArray = data.hourly.time.slice(0, 24);
            let newHourArray = [];
            hourArray.forEach((array) => {
              const item = array.slice(11);
              newHourArray.push(item);
            });

            hourlyTempFunc(tempArray, newHourArray);

            // uv index
          uvIndexData = data.daily.uv_index_max[0];
          uvIndexFunc(uvIndexData);

            // wind status
            const windDirection = document.querySelector("#wind-direction");
            const windSpeed = document.querySelector("#wind-speed");

            windDirection.innerHTML =
              data.minutely_15.wind_direction_10m[indexOfCurrentDateTime];
            windSpeed.innerHTML =
              data.minutely_15.wind_speed_10m[indexOfCurrentDateTime];

            //visibility info
            const visibilityData =
              data.minutely_15.visibility[indexOfCurrentDateTime];
            visibilityFunc(visibilityData);
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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,sunrise,sunset,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,wind_speed_10m&minutely_15=temperature_2m,wind_speed_10m,wind_direction_10m,visibility&current=rain,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`
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
          console.log(
            `The index of currentDateTime is ${indexOfCurrentDateTime}`
          );

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

              // map
              const iconUrl = data[dayWeatherCode].day.image;
              const iconDescription = data[dayWeatherCode].day.description;
              showMap(lat, lon, iconUrl, iconDescription);
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

          //hourly temp
          tempArray = data.hourly.temperature_2m.slice(0, 24);
          hourArray = data.hourly.time.slice(0, 24);
          let newHourArray = [];
          hourArray.forEach((array) => {
            const item = array.slice(11);
            newHourArray.push(item);
          });

          hourlyTempFunc(tempArray, newHourArray);

          // uv index
          uvIndexData = data.daily.uv_index_max[0];
          uvIndexFunc(uvIndexData);

          // wind status
          const windData = data.minutely_15;
          function windDataFunc(windData) {
            const windDirection = document.querySelector("#wind-direction");
            const windSpeed = document.querySelector("#wind-speed");
            windDirection.innerHTML =
            `${windData.wind_direction_10m[indexOfCurrentDateTime]}`;
            windSpeed.innerHTML =
            `${windData.wind_speed_10m[indexOfCurrentDateTime]} km/h`;
          }

          windDataFunc(windData)

          //visibility info
          const visibilityData =
            data.minutely_15.visibility[indexOfCurrentDateTime];
          visibilityFunc(visibilityData);
        })
        .catch((error) => console.error(`Error: ${error}`));
    })
    .catch((error) => console.error(`Error: ${error}`));
});

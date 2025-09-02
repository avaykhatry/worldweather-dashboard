document.addEventListener("DOMContentLoaded", function () {
  // classic/noir mode start
  document.querySelector("#theme-btn").addEventListener("click", () => {
    document.querySelector("body").classList.toggle("theme");
  });
  // classic/noir mode end

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
            borderColor: "#824dff",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
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

  // wind status start
  function windDataFunc(windData, indexOfCurrentDateTime) {
    const windDirection = document.querySelector("#wind-direction");
    const windSpeed = document.querySelector("#wind-speed");
    windDirection.innerHTML = `${windData.wind_direction_10m[indexOfCurrentDateTime]}°`;
    windSpeed.innerHTML = `${windData.wind_speed_10m[indexOfCurrentDateTime]} km/h`;
  }
  // wind status end

  // current temperature function start
  function currentTempFunc(currentTempData) {
    const currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = `${currentTempData}<sup>\u00B0C</sup>`;
  }
  // current temperature function end

//   let monthStatus;
//   function monthDatafunc(monthData) {
//             if (monthData === 1) {
//               monthStatus = "Jan";
//             } else if (monthData === 2) {
//               monthStatus = "Feb";
//             } else if (monthData === 3) {
//               monthStatus = "Mar";
//             } else if (monthData === 4) {
//               monthStatus = "Apr";
//             } else if (monthData === 5) {
//               monthStatus = "May";
//             } else if (monthData === 6) {
//               monthStatus = "Jun";
//             } else if (monthData === 7) {
//               monthStatus = "Jul";
//             } else if (monthData === 8) {
//               monthStatus = "Aug";
//             } else if (monthData === 9) {
//               monthStatus = "Sep";
//             } else if (monthData === 10) {
//               monthStatus = "Oct";
//             } else if (monthData === 11) {
//               monthStatus = "Nov";
//             } else if (monthData === 12) {
//               monthStatus = "Dec";
//             } else {
//               monthStatus = "Invalid";
//             }
              
// }


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
        document.querySelector(
          "#current-loc"
        ).innerHTML = `${data.results[0].name}, ${data.results[0].admin1}, ${data.results[0].country}`;
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
            const currentTempData =
              data.minutely_15.temperature_2m[indexOfCurrentDateTime];
            currentTempFunc(currentTempData);

            // min/max temperature
            const maxTemp = document.querySelector("#max-temp");
            maxTemp.innerHTML = `${data.daily.temperature_2m_max[indexOfCurrentDate]}\u00B0C`;

            const minTemp = document.querySelector("#min-temp");
            minTemp.innerHTML = `${data.daily.temperature_2m_min[indexOfCurrentDate]}\u00B0C`;

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
            sunsetTime.innerHTML = `${data.daily.sunset[0].slice(11, 16)}`;

            // sunrise time
            const sunriseTime = document.querySelector("#sunrise-time");
            sunriseTime.innerHTML = `${data.daily.sunrise[0].slice(11, 16)}`;

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
            windDataFunc(windData, indexOfCurrentDateTime);

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

      // current data/time
      const timeZone = data.results[0].timezone;
      console.log(timeZone);
      fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`)
        .then((Response) => Response.json())
        .then((data) => {
          console.log(data);
          const weekDay = data.day_of_week;
          const locationDateTime = data.datetime;
          // .slice(0, 10);
          // console.log(locationDate);
          // const locationTime = data.datetime.slice(11, 16);
          // console.log(locationTime);
          const monthData = data.datetime.slice(6, 7);
          
          function dayFunc(weekDay, monthData, locationDateTime) {
            let weekDayStatus;
            let monthStatus;
            console.log(`monthdata: ${monthData}`)
            if (weekDay === 1) {
              weekDayStatus = "Mon";
            } else if (weekDay === 2) {
              weekDayStatus = "Tue";
            } else if (weekDay === 3) {
              weekDayStatus = "Wed";
            } else if (weekDay === 4) {
              weekDayStatus = "Thu";
            } else if (weekDay === 5) {
              weekDayStatus = "Fri";
            } else if (weekDay === 6) {
              weekDayStatus = "Sat";
            } else {
              weekDayStatus = "Sun";
            }

            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            monthStatus = months[monthData - 1] || "Invalid";


            document.querySelector(
              "#current-date"
            ).innerHTML = `${weekDayStatus}, ${monthStatus} ${locationDateTime.slice(8, 10)}, ${locationDateTime.slice(0, 4)} ${locationDateTime.slice(11, 16)}`;
          }
          dayFunc(weekDay, monthData, locationDateTime);
        })
        .catch((error) => console.error(`Error: ${error}`));

      document.querySelector(
        "#current-loc"
      ).innerHTML = `${data.results[0].name}, ${data.results[0].admin1}, ${data.results[0].country}`;
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
          const currentTempData =
            data.minutely_15.temperature_2m[indexOfCurrentDateTime];
          currentTempFunc(currentTempData);

          // min/max temperature
          const maxTemp = document.querySelector("#max-temp");
          maxTemp.innerHTML = `${data.daily.temperature_2m_max[indexOfCurrentDate]}<sup>\u00B0C</sup>`;

          const minTemp = document.querySelector("#min-temp");
          minTemp.innerHTML = `${data.daily.temperature_2m_min[indexOfCurrentDate]}<sup>\u00B0C</sup>`;

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
          sunsetTime.innerHTML = `${data.daily.sunset[0].slice(11, 16)}`;

          // sunrise time
          const sunriseTime = document.querySelector("#sunrise-time");
          sunriseTime.innerHTML = `${data.daily.sunrise[0].slice(11, 16)}`;

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

          //visibility info
          const visibilityData =
            data.minutely_15.visibility[indexOfCurrentDateTime];
          visibilityFunc(visibilityData);

          // wind status
          const windData = data.minutely_15;
          windDataFunc(windData, indexOfCurrentDateTime);
        })
        .catch((error) => console.error(`Error: ${error}`));
    })
    .catch((error) => console.error(`Error: ${error}`));
});

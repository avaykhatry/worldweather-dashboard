document.addEventListener("DOMContentLoaded", function () {
  const lat = 27.700769;
  const lon = 85.300140;

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&hourly=temperature_2m`
  )
    .then((Response) => {
      if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
      return Response.json();
    })
    .then((data) => {
      console.log(data);

      // current Time
      const currentTime = "2025-08-24T14:00";
      const splicedCurrentTime = "2025-08-24";
      const indexOfCurrentTime = data.hourly.time.indexOf(currentTime);

      // current temperature
      currentTemp = data.hourly.temperature_2m[indexOfCurrentTime];
      console.log(indexOfCurrentTime);
      console.log(currentTemp);

      const temp = document.querySelector("#temp");
      temp.innerHTML = currentTemp;

      //sunset-time
      const sunsetTime = document.querySelector("#sunset-time");
      sunsetTime.innerHTML = data.daily.sunset[0];

      // sunrise time
      const sunriseTime = document.querySelector("#sunrise-time");
      sunriseTime.innerHTML = data.daily.sunrise[1];
    })
    .catch((error) => console.error(`Error: ${error}`));
});

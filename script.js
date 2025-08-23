document.addEventListener("DOMContentLoaded", function () {
  const lat = 27.71;
  const lon = 85.32;

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`
  )
    .then((Response) => {
      if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
      return Response.json();
    })
    .then((data) => {
        return console.log(data);
    })
    .catch((error) => console.error(`Error: ${error}`));
});

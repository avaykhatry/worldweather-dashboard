document.addEventListener("DOMContentLoaded", function() {

    fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m")
    .then(Response => {
        if (!Response.ok) throw new Error(`HTTP error: ${Response.status}`);
    return Response.json();
})
    .then(data => {
        return console.log(data);
    })
    .catch(error => console.error(`Error: ${error}`));
});
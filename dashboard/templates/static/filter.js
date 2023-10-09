const form = document.getElementById("headerForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const startYear = document.getElementById("start_year").value;
  const endYear = document.getElementById("end_year").value;
  const sector = document.getElementById("sector").value;
  const topic = document.getElementById("topic").value;
  const region = document.getElementById("region").value;
  const country = document.getElementById("country").value;
  var query = {};

  if (country != "none") {
    query["country"] = country;
  }

  if (topic != "none") {
    query["topic"] = topic;
  }

  if (sector != "none") {
    query["sector"] = sector;
  }

  if (region != "none") {
    query["region"] = region;
  }

  if (endYear) {
    query["end_year"] = { $lte: endYear };
  }

  if (startYear) {
    query["end_year"] = { $gte: startYear };
  }

  plotGraphs("/data/?query=" + encodeURIComponent(JSON.stringify(query)));
});

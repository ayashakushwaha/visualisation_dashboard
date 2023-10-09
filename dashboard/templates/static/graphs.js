function plotTopicVsCount(data) {
  var width = 600;
  var height = 400;
  document.getElementById("topic-v-count").innerHTML = "";
  var svg = d3
    .select("#topic-v-count")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var topicCounts = {};
  data.forEach((d) => {
    if (d.topic in topicCounts) {
      topicCounts[d.topic]++;
    } else if (d.topic) {
      topicCounts[d.topic] = 1;
    }
  });

  var otherTopicCount = 0;
  var topicData = Object.keys(topicCounts)
    .filter((topic) => {
      if (topicCounts[topic] <= 4) {
        otherTopicCount += topicCounts[topic];
        return false;
      }
      return true;
    })
    .map((topic) => {
      return { topic: topic, count: topicCounts[topic] };
    });

  console.log(topicData);

  topicData.push({
    topic: "others",
    count: otherTopicCount,
  });

  var xScale = d3
    .scaleBand()
    .domain(topicData.map((d) => d.topic))
    .range([0, width])
    .padding(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(topicData, (d) => d.count + 100)])
    .range([height - 100, 0]);

  svg
    .selectAll(".bar")
    .data(topicData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.topic);
    })
    .attr("y", function (d) {
      return yScale(d.count);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return 300 - yScale(d.count);
    })
    .attr("fill", "Coral");

  svg
    .append("g")
    .attr("class", "x-axis-labels")
    .attr("transform", "translate(0, 300)")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.7em")
    .attr("dy", "-0.6em")
    .attr("transform", "rotate(-90)");

  svg
    .selectAll(".bar-label")
    .data(topicData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .style("text-anchor", "middle")
    .attr("x", function (d) {
      return xScale(d.topic) + xScale.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yScale(d.count) - 1;
    })
    .text(function (d) {
      return d.count;
    });

  svg.append("g").call(d3.axisLeft(yScale).ticks(5));

  var margin = { top: 20, right: 30, bottom: 40, left: 60 };
  svg
    .append("text")
    .attr("x", width / 2 + margin.left - 70)
    .attr("y", height + margin.top + margin.bottom - 100)
    .attr("text-anchor", "middle")
    .text("Topic");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top + 40)
    .attr("y", margin.left - 40)
    .attr("text-anchor", "middle")
    .text("Count");
}

function plotPublicationDateVsCount(data) {
  var dateCounts = {};
  data.forEach(function (d) {
    if (d.published) {
      var date = new Date(d.published);
      var dateString = date.toISOString().split("T")[0];
      if (dateString in dateCounts) {
        dateCounts[dateString]++;
      } else {
        dateCounts[dateString] = 1;
      }
    }
  });

  var dateData = Object.keys(dateCounts).map(function (dateString) {
    return { date: new Date(dateString), count: dateCounts[dateString] };
  });

  dateData.sort(function (a, b) {
    return a.date - b.date;
  });

  var width = 600;
  var height = 400;

  document.getElementById("date-v-count").innerHTML = "";
  var svg = d3
    .select("#date-v-count")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var xScale = d3
    .scaleTime()
    .domain(
      d3.extent(dateData, function (d) {
        return d.date;
      })
    )
    .range([0, width - 100]);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dateData, function (d) {
        return d.count;
      }),
    ])
    .range([height - 100, 0]);

  var line = d3
    .line()
    .x(function (d) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.count);
    });

  svg
    .append("path")
    .datum(dateData)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "DarkSeaGreen");

  svg
    .append("g")
    .attr("transform", "translate(0, 300)")
    .call(d3.axisBottom(xScale));

  svg.append("g").call(d3.axisLeft(yScale).ticks(1));

  var margin = { top: 20, right: 30, bottom: 40, left: 60 };
  svg
    .append("text")
    .attr("x", width / 2 + margin.left - 90)
    .attr("y", height + margin.top + margin.bottom - 100)
    .attr("text-anchor", "middle")
    .text("Publication Date");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top + 40)
    .attr("y", margin.left - 40)
    .attr("text-anchor", "middle")
    .text("Number of Reports Publish");
}

function plotCountryPieChart(data) {
  var countryCounts = {};
  data.forEach(function (d) {
    if (d.country in countryCounts) {
      countryCounts[d.country]++;
    } else if (d.country) {
      countryCounts[d.country] = 1;
    }
  });

  otherCountries = 0;
  var countryData = Object.keys(countryCounts)
    .filter((country) => {
      if (countryCounts[country] > 5) {
        return true;
      }

      otherCountries += countryCounts[country];
      return false;
    })
    .map(function (country) {
      return { country: country, count: countryCounts[country] };
    });

  countryData.push({
    country: "others",
    count: otherCountries,
  });

  document.getElementById("country-pie").innerHTML = "";
  var svg = d3
    .select("#country-pie")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400);

  var pie = d3
    .pie()
    .value(function (d) {
      return d.count;
    })
    .padAngle(0.02);

  var arcs = svg
    .selectAll(".arc")
    .data(pie(countryData))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(200, 200)");

  var color = d3.scaleOrdinal(d3.schemePaired);

  arcs
    .append("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(150))
    .attr("fill", function (d, i) {
      return color(i);
    });

  var outerArc = d3.arc().innerRadius(170).outerRadius(170);

  document.getElementById("country-legend").innerHTML = "";
  var legend = d3
    .select("#country-legend")
    .append("svg")
    .attr("width", 270)
    .attr("height", 600)
    .selectAll("legend")
    .data(countryData)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("width", 14)
    .attr("height", 14)
    .attr("x", 50)
    .attr("y", 25)
    .style("fill", function (d, i) {
      return color(i);
    });

  legend
    .append("text")
    .attr("x", 74)
    .attr("y", 32)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.country + " (" + d.count + ")";
    });
}

function plotAverageIntensityVsSector(data) {
  var sectorAverageIntensity = {};
  var sectorCount = {};
  data.forEach(function (d) {
    if (d.sector in sectorAverageIntensity && d.intensity) {
      sectorAverageIntensity[d.sector] += d.intensity;
      sectorCount[d.sector]++;
    } else if (d.sector && d.intensity) {
      sectorAverageIntensity[d.sector] = d.intensity;
      sectorCount[d.sector] = 1;
    }
  });

  Object.keys(sectorAverageIntensity).forEach(function (sector) {
    sectorAverageIntensity[sector] /= sectorCount[sector];
  });

  var sectorData = Object.keys(sectorAverageIntensity).map(function (sector) {
    return { sector: sector, averageIntensity: sectorAverageIntensity[sector] };
  });

  document.getElementById("average-intensity-v-sector").innerHTML = "";
  var svg = d3
    .select("#average-intensity-v-sector")
    .append("svg")
    .attr("width", 700)
    .attr("height", 600);

  var margin = { top: 20, right: 30, bottom: 40, left: 60 };
  var width = svg.attr("width") - margin.left - margin.right;
  var height = svg.attr("height") - margin.top - margin.bottom - 200;

  var x = d3
    .scaleBand()
    .domain(
      sectorData.map(function (d) {
        return d.sector;
      })
    )
    .range([margin.left, width + margin.left])
    .padding(0.1);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(sectorData, function (d) {
        return d.averageIntensity;
      }),
    ])
    .nice()
    .range([height + margin.top, margin.top]);

  svg
    .selectAll(".bar")
    .data(sectorData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.sector);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.averageIntensity);
    })
    .attr("height", function (d) {
      return height - y(d.averageIntensity);
    })
    .attr("fill", "HotPink");

  svg
    .append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-45)");

  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).ticks(5));

  svg
    .append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom + 45)
    .attr("text-anchor", "middle")
    .text("Sector");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top)
    .attr("y", margin.left - 40)
    .attr("text-anchor", "middle")
    .text("Average Intensity");
}

function plotRegionPieChart(data) {
  var regionCounts = {};
  data.forEach(function (d) {
    if (d.region in regionCounts) {
      regionCounts[d.region]++;
    } else if (d.region && d.region != "world" && d.region != "World") {
      regionCounts[d.region] = 1;
    }
  });

  var regionData = Object.keys(regionCounts).map(function (region) {
    return { region: region, count: regionCounts[region] };
  });

  console.log(regionData);

  document.getElementById("region-pie").innerHTML = "";
  var svg = d3
    .select("#region-pie")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);

  var pie = d3
    .pie()
    .value(function (d) {
      return d.count;
    })
    .padAngle(0.02);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var arcs = svg
    .selectAll(".arc")
    .data(pie(regionData))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(200, 200)");

  arcs
    .append("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(150))
    .attr("fill", function (d, i) {
      return color(i);
    });

  var outerArc = d3.arc().innerRadius(170).outerRadius(170);

  document.getElementById("region-legend").innerHTML = "";
  var legend = d3
    .select("#region-legend")
    .append("svg")
    .attr("width", 200)
    .attr("height", 600)
    .selectAll("legend")
    .data(regionData)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("width", 14)
    .attr("height", 14)
    .attr("x", 50)
    .attr("y", 9)
    .style("fill", function (d, i) {
      return color(i);
    });

  legend
    .append("text")
    .attr("x", 74)
    .attr("y", 16)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.region + " (" + d.count + ")";
    })
    .style("font-size", "12px");
}

function plotAverageRelevanceVsSector(data) {
  var sectorAverageRelevance = {};
  var sectorCount = {};
  data.forEach(function (d) {
    if (d.sector in sectorAverageRelevance) {
      sectorAverageRelevance[d.sector] += d.relevance;
      sectorCount[d.sector]++;
    } else if (d.sector) {
      sectorAverageRelevance[d.sector] = d.relevance;
      sectorCount[d.sector] = 1;
    }
  });

  Object.keys(sectorAverageRelevance).forEach(function (sector) {
    sectorAverageRelevance[sector] /= sectorCount[sector];
  });

  var sectorData = Object.keys(sectorAverageRelevance).map(function (sector) {
    return { sector: sector, averageRelevance: sectorAverageRelevance[sector] };
  });

  console.log(sectorData);

  document.getElementById("average-relevance-v-sector").innerHTML = "";
  var svg = d3
    .select("#average-relevance-v-sector")
    .append("svg")
    .attr("width", 700)
    .attr("height", 500);

  var margin = { top: 20, right: 30, bottom: 40, left: 60 };
  var width = svg.attr("width") - margin.left - margin.right;
  var height = svg.attr("height") - margin.top - margin.bottom - 100;

  var x = d3
    .scaleBand()
    .domain(
      sectorData.map(function (d) {
        return d.sector;
      })
    )
    .range([margin.left, width + margin.left])
    .padding(0.1);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(sectorData, function (d) {
        return d.averageRelevance;
      }),
    ])
    .nice()
    .range([height + margin.top, margin.top]);

  svg
    .selectAll(".bar")
    .data(sectorData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.sector);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.averageRelevance);
    })
    .attr("height", function (d) {
      return height - y(d.averageRelevance);
    })
    .attr("fill", "dodgerblue");

  svg
    .append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-45)");

  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).ticks(5));

  svg
    .append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom + 45)
    .attr("text-anchor", "middle")
    .text("Sector");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top)
    .attr("y", margin.left - 40)
    .attr("text-anchor", "middle")
    .text("Average Relevance");
}

function plotGraphs(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var parsedData = [];
      data.forEach((d) => {
        parsedData.push(JSON.parse(d));
      });
      plotTopicVsCount(parsedData);
      plotPublicationDateVsCount(parsedData);
      plotCountryPieChart(parsedData);
      plotRegionPieChart(parsedData);
      plotAverageIntensityVsSector(parsedData);
      plotAverageRelevanceVsSector(parsedData);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

window.addEventListener("load", function (e) {
  plotGraphs("/data/");
});

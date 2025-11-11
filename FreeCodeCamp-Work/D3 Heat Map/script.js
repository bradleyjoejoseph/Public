// Legend threshold colours taken from fcc from
// https://codepen.io/freeCodeCamp/pen/JEXgeY

var colorbrewer = {
  RdYlBu: {
    3: ["#fc8d59", "#ffffbf", "#91bfdb"],
    4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
    6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
    7: [
      "#d73027",
      "#fc8d59",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#91bfdb",
      "#4575b4"
    ],
    8: [
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4"
    ],
    9: [
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4"
    ],
    10: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695"
    ],
    11: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695"
    ]
  },
  RdBu: {
    3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
    4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
    5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
    7: [
      "#b2182b",
      "#ef8a62",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#67a9cf",
      "#2166ac"
    ],
    8: [
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac"
    ],
    9: [
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac"
    ],
    10: [
      "#67001f",
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
      "#053061"
    ],
    11: [
      "#67001f",
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
      "#053061"
    ]
  }
};

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => callback(data))
  .catch((err) => console.log(err));

function callback(data) {
  console.log("Start");

  let xValues = Array.from(new Set(data["monthlyVariance"].map((d) => d.year)));
  let yValues = Array.from(
    new Set(data["monthlyVariance"].map((d) => d.month))
  );
  let svg = d3.select("#container").append("svg");

  let tooltip = d3.select("#tooltip");

  let xAxisG = svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(100,500)");

  let yAxisG = svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(100,0)");

  let xScale = d3.scaleBand().domain(xValues).range([0, 1000]);
  let yScale = d3.scaleBand().domain(yValues).range([0, 500]);

  let xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(
      xScale.domain().filter(function (year) {
        return year % 10 === 0;
      })
    )
    .tickFormat(function (year) {
      let date = new Date(0);
      date.setUTCFullYear(year);
      let format = d3.timeFormat("%Y");
      return format(date);
    })
    .tickSize(10, 1);

  let yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(function (month) {
      let date = new Date(0);
      date.setUTCMonth(month - 1);
      let format = d3.timeFormat("%B");
      return format(date);
    })
    .tickSize(10, 1);

  d3.select("#y-axis").call(yAxis);
  d3.select("#x-axis").call(xAxis);

  let variance = data.monthlyVariance.map(function (val) {
    return val.variance;
  });
  let minTemp = data.baseTemperature + Math.min.apply(null, variance);
  let maxTemp = data.baseTemperature + Math.max.apply(null, variance);

  let legendColors = colorbrewer.RdYlBu[11].reverse();
  let legendWidth = 400;
  let legendHeight = 300 / legendColors.length;

  let legendThreshold = d3
    .scaleThreshold()
    .domain(
      (function (min, max, count) {
        let array = [];
        let step = (max - min) / count;
        let base = min;
        for (let i = 1; i < count; i++) {
          array.push(base + i * step);
        }
        return array;
      })(minTemp, maxTemp, legendColors.length)
    )
    .range(legendColors);

  svg
    .attr("height", 700)
    .attr("width", 1200)
    .append("g")
    .attr("transform", "translate(100, 0)")
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", function (d) {
      return d.month - 1;
    })
    .attr("data-year", function (d) {
      return d.year;
    })
    .attr("data-temp", function (d) {
      return data.baseTemperature + d.variance;
    })
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", (d) => xScale.bandwidth(d.year))
    .attr("height", (d) => yScale.bandwidth(d.month))
    .attr("fill", function (d) {
      return legendThreshold(data.baseTemperature + d.variance);
    })
    .on("mouseover", function (event, d) {
      tooltip.transition().style("visibility", "visible");

      tooltip.text(
        "month: " +
          d.month +
          "  |  " +
          "year: " +
          d.year +
          "  |  " +
          "temp: " +
          d.variance
      );

      tooltip.attr("data-year", d.year);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
  let legendsColours = [
    "6196ce",
    "74add1",
    "abd9e9",
    "e0f3f8",
    "ffffbf",
    "fee090",
    "fdae61",
    "f46d43",
    "d73027"
  ];
  let legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("rect")
    .data(legendsColours)
    .enter()
    .append("rect")
    .style("fill", function (d) {
      return "#" + d;
    })
    .attr("height", 50)
    .attr("width", 50)
    .attr("transform", function (d, i) {
      return "translate(" + 50 * i + ", 600)";
    });
}

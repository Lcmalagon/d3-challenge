var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform" , `translate(${margin.left}, ${margin.top})`);
// Import Data

var file = "assets/data/data.csv"
// Function is called and passes csv data
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error) {
    throw err;
}
//loop through statesData and pass argument data 
function successHandle(statesData) {
    statesData.map(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
//create scales functions 
var xLinearScale = d3.scaleLinear()
  .domain([8.0, d3.max(statesData, d => d.poverty)])
  .domain([2.0, d3.max(statesData, d => d.healthcare)])
  .range([height, 0]);
//create axis functions 
var bottomAxis = d3.axisBottom(xLinearScale)
var leftAxis = d3.axisLeft(yLinearScale);
//append the axes to the chart group
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
chartGroup.append("g")
    .call(leftAxis);
//create circles 

var circlesGroup = chartGroup.selectAll("circle")
  .data(statesData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "13")
  .attr("fill", "#788dc2")
  .attr("opacity", ".75")
//append text to circles 
var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));
//initialize tooltip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
    });

//create tooltip in the chart 
chartGroup.call(toolTip);

//create event listeners to display and hide the tooltip
circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

//create axis labels 
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}
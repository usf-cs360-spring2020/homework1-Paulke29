let csv = 'Air_Traffic_Passenger_Statistics.csv'
chart = function(data){
  const svg = d3.select("svg").attr("viewBox", [0, 0, 450, 720])
  svg.append("g").call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  console.log("svg.node:"+svg.node)
  return svg.node()
};

data = d3.csvParse(await FileAttachment("aapl.csv").text(), d3.autoType);

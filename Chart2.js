// location of data file
let CSV2 = 'Air_Traffic_Passenger_Statistics.csv';
console.log("CSV:"+csv);

// config2uration of svg2/plot area
let config2 = {
  'svg2': {},
  'margin': {},
  'plot': {}
};
config2.svg2.height = 450;
config2.svg2.width = config2.svg2.height * 1.618; // golden ratio
config2.margin.top = 10;
config2.margin.right = 10;
config2.margin.bottom = 20;
config2.margin.left = 100;
config2.plot.x = config2.margin.left;
config2.plot.y = config2.margin.top;
config2.plot.width = config2.svg2.width - config2.margin.left - config2.margin.right;
config2.plot.height = config2.svg2.height - config2.margin.top - config2.margin.bottom;

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}
var svg2 = d3.select("#Chart2").append('svg')
    .attr('width', config2.svg2.width)
    .attr('height', config2.svg2.height+100)
    .append("g")
    .attr("transform", translate(config2.plot.x, config2.plot.y));
console.log("SVG2: "+JSON.stringify(svg2))
d3.csv(CSV2, convertRow).then(drawBarChart);
// format each row;
function convertRow(row,index){
      let out ={};
      // out.values =[];
      for (let col in row) {
        switch (col) {
          // these are the text columns that do not need conversion
          case 'Operating Airline':
            out[col] = row[col];
            // console.log("Operating Airline:"+out[col]);
            break;
          case 'GEO Summary':
            out[col] = row[col];
            // console.log("GEO Summary:"+out[col]);
            break;

          // these are the columns that need to be converted to integer
          case 'Passenger Count':
            out[col] = parseInt(row[col]);
            // console.log("Passenger:"+out[col]);
            break;
          //   case 'Activity Period':
          //     let data =parseInt(row[col]);
          //     let year = Math.floor(data / 100);
          //     let month = data % 100;
          //     let dates = month+'/'+year;
          //     // console.log("Type:"+typeof(dates))
          //      out[col] = parseData(dates);
          // //     out[col] = dates;
          //   break;
        }
      }
      return out;
    }
function drawBarChart(data) {


  data = data.filter(function(row) {
      return row['Operating Airline'] === 'United Airlines'
  });

 data.sort(function(a,b){
    return a['GEO Summary'].localeCompare(b['GEO Summary']) || a['Passenger Count']- b['Passenger Count']
  });
  // data.sort();
   console.log("Data:"+JSON.stringify(data));

  let numberCount = data.map(row => row['Passenger Count']);
  // console.log("Sort Number: "+numberCount)
  // console.log("Passenger Count:"+numberCount);

  let dates = data.map(row => row['Activity Period']);
  // console.log("dates: "+dates)
  // var date = [];
  // date.push(dates.map(dates))
  // console.log("date length: "+dates.length);
  // console.log("Sort Date: "+ typeof(date));
  let min = d3.min(dates);
  let max = d3.max(dates);
  // console.log("Char min:"+min+"max:"+max);
  let Pmin = d3.min(numberCount);
  let Pmax = d3.max(numberCount);
  // console.log("Chart Pmin:"+Pmin+"Pmax:"+Pmax);
  var x = d3.scaleBand()
  .range([ 0, 400 ])
  .domain(data.map(function(d) { return d['GEO Summary']; }))
  .padding(0.2);
  svg2.append("g")
    .attr("transform",translate(config.plot.x, config.plot.y + config.plot.height+30))
  .call(d3.axisBottom(x))
  .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
// Add Y axis
  var y = d3.scaleLinear()
    .domain( [0, Pmax])
    .range([config2.svg2.height, 0 ]);
svg2.append("g")
.attr("transform",translate(config.plot.x, config.plot.y))
  .call(d3.axisLeft(y));

    svg2.selectAll("mybar")
     .data(data)
     .enter()
     .append("rect")
       .attr("x", function(d) { return x(d['GEO Summary'])})
       .attr("y", function(d) { return y(d['Passenger Count'])})
       .attr("width", x.bandwidth())
       .attr("transform", translate(config2.plot.x, config2.plot.y))
       .attr("height",function(d) { return config2.svg2.height - y(d['Passenger Count']); })
       .attr("fill", "#69b3a2")

}

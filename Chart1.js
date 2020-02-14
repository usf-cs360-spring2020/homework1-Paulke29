// location of data file
let csv = 'Air_Traffic_Passenger_Statistics.csv';
console.log("CSV:"+csv);

// configuration of svg/plot area
let config = {
  'svg': {},
  'margin': {},
  'plot': {}
};
config.svg.height = 450;
config.svg.width = config.svg.height * 1.618; // golden ratio
config.margin.top = 10;
config.margin.right = 10;
config.margin.bottom = 20;
config.margin.left = 80;
config.plot.x = config.margin.left;
config.plot.y = config.margin.top;
config.plot.width = config.svg.width - config.margin.left - config.margin.right;
config.plot.height = config.svg.height - config.margin.top - config.margin.bottom;

// setup svg
let svg = d3.select('body').select('svg');
console.log("Svg:"+svg);
svg.attr('width', config.svg.width);
svg.attr('height', config.svg.height);


d3.csv(csv, convertRow).then(drawChart);
//convert ColumnName to date formate;
let parseData= d3.timeParse('%m/%Y');

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
      // case 'GEO Summary':
      //   out[col] = row[col];
      //   // console.log("GEO Summary:"+out[col]);
      //   break;

      // these are the columns that need to be converted to integer
      case 'Passenger Count':
        out[col] = parseInt(row[col]);
        // console.log("Passenger:"+out[col]);
        break;
      case 'Activity Period':
        let data =parseInt(row[col]);
        let year = Math.floor(data / 100);
        let month = data % 100;
        let dates = month+'/'+year;
        // console.log("Type:"+typeof(dates))
         out[col] = parseData(dates);
         // console.log("Dates:"+out[col])
        // console.log("Activity Period:"+out[col]);
        break;
      // these should be our time series values
      // default:
      //   // convert column name into the date
      //   var date = parseRowData(col);
      //   // console.log("date1:"+date);
      //   // convert the value to float
      //   var value = parseFloat(row[col]);
      //
      //   // add them to our values
      //   out.values.push({
      //     'date': date,
      //     'value': value
      //   });
        // console.log("out[]"+out[0]+":"+out[1]);
    }
  }
  return out;
}
function drawLineChart(data){
  // filter dataset to smaller size
  data = data.filter(function(row) {
      return row['Operating Airline'] === 'United Airlines'
  });
  // console.log("Data:"+JSON.stringify(data));

  let numberCount = data.map(row => row['Passenger Count']);
  // console.log("Passenger Count:"+numberCount);

  let dates = data.map(row => row['Activity Period']);

  let min = d3.min(dates);
  let max = d3.max(dates);
  console.log("min:"+min+"max:"+max);
  let Pmin = d3.min(numberCount);
  let Pmax = d3.max(numberCount);
  console.log("Pmin:"+Pmin+"Pmax:"+Pmax);

  let axis = {};
  var xscale = d3.scaleTime().domain([min, max]).range([0, 600]);
  var yscale = d3.scaleLinear().domain([0, Pmax]).range([400,20]);
  axis.x = d3.axisBottom(xscale).scale(xscale);
  axis.y = d3.axisLeft(yscale).scale(yscale);
  // draw the x and y axis
  let gx = svg.append("g");
  gx.attr("id", "x-axis");
  gx.attr("class", "axis");
  gx.attr("transform", translate(config.plot.x, config.plot.y + config.plot.height));
  gx.call(axis.x);

  let gy = svg.append("g");
  gy.attr("id", "y-axis");
  gy.attr("class", "axis");
  gy.attr("transform", translate(config.plot.x, config.plot.y));
  gy.call(axis.y);


  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a4")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return d['Activity Period']})
      .y(function(d) { return d['Passenger Count']})
      )
  // Add the points
  svg.append("g")
     .selectAll("dot")
     .data(data)
     .enter()
      .append("circle")
      .attr("cx", function(d) { return x(d['Activity Period'])})
      .attr("cy", function(d) { return y(d['Passenger Count'])})
      .attr("r", 5)
      .attr("fill", "#69b3a2")
}
function drawChart(data) {

  data = data.filter(function(row) {
      return row['Operating Airline'] === 'United Airlines'
  });

 data.sort(function(a,b){
    return a['Activity Period']-b['Activity Period']
  });
  // data.sort();
  console.log("Data:"+JSON.stringify(data));

  let numberCount = data.map(row => row['Passenger Count']);
  // console.log("Sort Number: "+numberCount)
  // console.log("Passenger Count:"+numberCount);

  let dates = data.map(row => row['Activity Period']);
  // var date = [];
  // date.push(dates.map(dates))
  console.log("date length: "+dates.length);
  console.log("Sort Date: "+ typeof(date));
  let min = d3.min(dates);
  let max = d3.max(dates);
  // console.log("Char min:"+min+"max:"+max);
  let Pmin = d3.min(numberCount);
  let Pmax = d3.max(numberCount);
  // console.log("Chart Pmin:"+Pmin+"Pmax:"+Pmax);
  var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d['Activity Period']; }))
      .range([ 0, config.svg.width]);
    svg.append("g")
      .attr("transform",translate(config.plot.x, config.plot.y + config.plot.height))
       .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, Pmax])
      .range([config.svg.height, 0 ]);
    svg.append("g")
       .attr("transform", translate(config.plot.x, config.plot.y))
       .call(d3.axisLeft(y));

        // Add  line
       svg.append("path")
         .datum(data)
         .attr("fill", "none")
         .attr("stroke", "#69b3a2")
         .attr("stroke-width", 1.5)
         .attr("transform", translate(config.plot.x, config.plot.y))
         .attr("d", d3.line()
            .x(function(d) {
              console.log("Activity Period: "+typeof(d['Activity Period']))
              // return x(d['Activity Period'])})
              return x(d['Activity Period'])})
            .y(function(d) {
              // console.log("Passenger Count: "+y(d['Passenger Count']))
              return y(d['Passenger Count'])})
           )
    // Add  points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d['Activity Period'])})
        .attr("cy", function(d) { return y(d['Passenger Count'])})
        .attr("r", 5)
        .attr("transform", translate(config.plot.x, config.plot.y))
        .attr("fill", "#69b3a2")
}


function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

function init() {
  d3.json("samples.json").then(function (data) {
    var dropdown = d3.select('#selDataset');
    data.names.forEach(element => {
      dropdown.append("option").text(element).property('value', element)

    });
    // select the ID for the first individual 940
    firstID = data.names[0]; // equal to 940
    BuildCharts(firstID);
    BuildTable(firstID);
    buildGauge(firstID)
  });
}
init();
function BuildCharts(ID) {
  // Fetch the JSON data and console log it
  d3.json("samples.json").then(function (data) {
    // step 1: get the part of the data you want (data.samples)
    // and filter it for the ID
    var samples = data.samples.filter(sample => sample.id == ID)[0]
    console.log(samples)
    // step 2: build the chart:
    var y = samples.otu_ids.slice(0, 10);
    y = y.map(value => `OTU ${value}`);
    var x = samples.sample_values.slice(0, 10);
    console.log(x);
    // Reverse the array to accommodate Plotly's defaults
    x = x.reverse();
    y = y.reverse();
    //Basic Horizontal Bar Chart. 
    //Use sample_values as the values for the bar chart.
    //Use otu_ids as the labels for the bar chart.
    //Use otu_labels as the hovertext for the chart.
    var chart_data = [{
      type: 'bar',
      x: x,
      y: y,
      orientation: 'h'
    }];
    Plotly.newPlot('bar', chart_data);
    // step 3: build the bubble chart:
    var x = samples.otu_ids;
    var y = samples.sample_values;
    var size = samples.sample_values;
    var colors = samples.otu_ids;
    var values = samples.otu_labels;
    var trace1 = {
      x: x,
      y: y,
      text: values,
      mode: 'markers',
      marker: {
        color: colors,
        size: size,
        colorscale: "Earth"
      }
    };
    var bubble_data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot('bubble', bubble_data, layout);

  });
}
// // Function called by DOM changes
function BuildTable(ID) {
  d3.json("samples.json").then(function (data) {
    // step 1: get the part of the data you want (data.metadata)
    // and filter it for the ID
    var metadata = data.metadata.filter(record => record.id == ID)[0]
    console.log(metadata)
    // step2: build the table in the place where I want it
    var table = d3.select("#sample-metadata")
    table.html("")
    var id = metadata.id;
    table.append("p").text(`ID:${id}`);
    var ethnicity = metadata.ethnicity;
    table.append("p").text(`ethnicity: ${ethnicity}`);
    var gender = metadata.gender;
    table.append("p").text(`gender: ${gender}`);
    var age = metadata.age;
    table.append("p").text(`age: ${age}`);
    var location = metadata.location;
    table.append("p").text(`location: ${location}`);
    var bbtype = metadata.bbtype;
    table.append("p").text(`bbtype:${bbtype}`);
    var wfreq = metadata.wfreq;
    table.append("p").text(`wfreq: ${wfreq}`);
  });
}

function optionChanged(selectedID) {
  BuildCharts(selectedID);
  BuildTable(selectedID);
  buildGauge(selectedID);
};

function buildGauge(ID) {
  // Fetch the JSON data and console log it
  d3.json("samples.json").then(function (data) {
    // step 1: get the part of the data you want (data.metadata)
    // and filter it for the ID
    var metadata = data.metadata.filter(record => record.id == ID)[0]
    console.log(metadata)
    // grab the value of frequency from metadata

    var wfreq = metadata.wfreq;

    // create a level for the sample
    var level = parseFloat(wfreq) * 20;

    // Trig to calc meter point

    var degrees = 180 - level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);


    var data = [
      {
        type: "scatter",
        x: [0], y: [0],
        marker: { size: 18, color: '850000' },
        showlegend: false,
        name: "Wash Frequency",
        text: level,
        hoverinfo: "text+name"
      },

      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: ['rgba(0, 102, 0, .5)', 'rgba(0, 153, 0, .5)',
            'rgba(0, 204, 0, .5)', 'rgba(51, 255, 51, .5)',
            'rgba(102, 255, 102, .5)', 'rgba(140, 255, 140, .5)',
            'rgba(170, 255, 170, .5)', 'rgba(204, 255, 204, .5)',
            'rgba(229, 255, 229, .5)', 'rgba(229, 255, 255, 0)']
        },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }];

    var layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      autosize: true,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
    }
    };

    Plotly.newPlot("gauge", data, layout);
  });
};


// format and build table
function buildTable(sample) {
    d3.json("samples.json").then((data) => {
        // simplify calls through variables and filter for option input
      var metadata = data.metadata;
      var array = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = array[0];
      var sampletable = d3.select("#sample-metadata");
      sampletable.html("");
      // loop though key value pairs in data and return to table
      Object.entries(result).forEach(([key, value]) => {
        sampletable.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
}
// build plotss 
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        // simplify data and get top samples
      var resultArray = data.samples.filter(sampling => sampling.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var values = result.sample_values;
      var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      // form trace for bar
      var trace1 = [
        {
          y: yticks,
          x: values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        xaxis: { title: "Cultures" },
        yaxis: { title: "sample"}
      };

      Plotly.newPlot("bar", trace1, barLayout);

      // form trace for bubble
      var trace2 = [
        {
          x: otu_ids,
          y: values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: values,
            color: otu_ids,
          }
        }
      ];

      var bubbleLayout = {
        xaxis: { title: "Id" },
      };
      
      Plotly.newPlot("bubble", trace2, bubbleLayout);
    });
}

//get initial table and feed in data
function firstTable() {
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      var select = d3.select("#selDataset");
      sampleNames.forEach((sample) => {
        select.append("option").text(sample).property("value");
      });
  
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildTable(firstSample);
    });
  }

// change plots and table with new data
function optionChanged(sample) {
    buildCharts(sample);
    buildTable(sample);
}

// run for first data
firstTable();
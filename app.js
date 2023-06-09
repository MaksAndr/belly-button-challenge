
// Get the samples endpoint
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function that populates selected metadata
function buildMetadata(selected) {
  // Retrieve all of the data
  d3.json(url).then(function(data) {
    console.log(data);
    // Retrieve all of the metadata
    let metadata = data.metadata;
    // Filter based on the selected value
    let selectedValue = metadata.filter((item) => item.id == selected);
    // Retrieve the first index
    let firstData = selectedValue[0];
    console.log(firstData); // {key: value, key: value}
    // Use d3 to select the panel with id of #sample-metadata
    let metadataBox = d3.select("#sample-metadata");
    // Clear any existing metadata
    metadataBox.html("");
    // Loop through and append new tags for each key-value in the metadata
    let keys = Object.keys(firstData);
    for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      metadataBox.append("h5").text(`${currentKey}: ${firstData[currentKey]}`);
    }
  });
}

// Function that builds charts
function buildChart(selected) {
  d3.json(url).then(function(data) {
    console.log(data);
    // Retrieve all of the sample data
    let sample_data = data.samples;
    console.log(sample_data);
    // Filter based on the selected value
    let selectedValue = sample_data.filter((item) => item.id == selected);
    console.log(selectedValue);
    // Retrieve the first index
    let firstSample = selectedValue[0];
    console.log("first", firstSample);
    // Assign labels
    let otu_ids = firstSample.otu_ids;
    let otu_labels = firstSample.otu_labels;
    let sample_values = firstSample.sample_values;
    console.log("labels", otu_ids, otu_labels, sample_values);
    // Slice and reverse to get top ten in descending order
    let x_axis = sample_values.slice(0, 10).reverse();
    let y_axis = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
    let labels = otu_labels.slice(0, 10).reverse();
    // Trace for the bar
    let bar_trace = {
      x: x_axis,
      y: y_axis,
      text: labels,
      name: "OTU",
      type: "bar",
      orientation: "h",
    };
    // Apply a title to layout
    let bar_layout = {
      title: "<b>Top 10 OTU<b>",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100,
      },
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", [bar_trace], bar_layout);

    // Trace for bubble chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "YlGnBu",
      },
    };

    // Apply title to layout
    let bubble_layout = {
      title: "<b>OTU Samples<b>",
      xaxis: { title: "<b>OTU ID<b>" },
    };

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", [bubble_trace], bubble_layout);
  });
}

// Initialize the dashboard
function init() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Retrieve all of the data
  d3.json(url).then((data) => {
    // Assign Var for the names (which are the ids)
    let names = data.names;
    // Append the names (ids) to dropdown menu
    names.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id);
    });

    // Build initial metadata and charts
    buildMetadata(names[0]);
    buildChart(names[0]);
  });
}

// Function that updates dashboard when selection is changed
function optionChanged(selectedValue) {
  buildMetadata(selectedValue);
  buildChart(selectedValue);
}

// Call the init() function to initialize the dashboard
init();

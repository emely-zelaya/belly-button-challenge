// Setting the data URL
const dataEndpoint = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to fetch and log JSON data
function fetchDataAndLog(url) {
  d3.json(url).then(data => console.log(data));
}

// Starting the dashboard
function launchDashboard() {
  
  // Accessing the selection dropdown
  const dropdown = d3.select("#selDataset");

  // Fetching data to populate the dropdown and initialize charts
  d3.json(dataEndpoint).then(data => {
    
    const names = data.names;
    
    names.forEach(name => {
      
      // Log each name for verification
      console.log(name);

      // Populate dropdown with each name
      dropdown.append("option").text(name).property("value", name);
    });

    // Initializing dashboard with the first name
    const initialName = names[0];
    console.log(initialName);
    setupChartsAndMetadata(initialName);
  });
}

// Function to setup or update charts and metadata
function setupChartsAndMetadata(sampleId) {
  updateMetadata(sampleId);
  createBarChart(sampleId);
  createBubbleChart(sampleId);
}

// Updating the metadata for a given sample
function updateMetadata(sampleId) {
  d3.json(dataEndpoint).then(data => {
    const metadata = data.metadata.find(sample => sample.id == sampleId);
    
    console.log(metadata);

    // Clearing existing metadata
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    // Adding new metadata
    Object.entries(metadata).forEach(([key, value]) => {
      console.log(key, value); // Log each metadata entry
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Creating a bar chart for the given sample
function createBarChart(sampleId) {
  d3.json(dataEndpoint).then(data => {
    const sampleData = data.samples.find(sample => sample.id == sampleId);
    const {otu_ids, otu_labels, sample_values} = sampleData;

    console.log(otu_ids, otu_labels, sample_values); // Verification

    const barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    const barLayout = {
      title: 'Top 10 Bacterial Cultures Found',
      xaxis: {title: 'Count'},
      yaxis: {title: 'OTU ID'}
    };

    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}

// Creating a bubble chart for the given sample
function createBubbleChart(sampleId) {
  d3.json(dataEndpoint).then(data => {
    const sampleData = data.samples.find(sample => sample.id == sampleId);
    const {otu_ids, otu_labels, sample_values} = sampleData;

    console.log(otu_ids, otu_labels, sample_values); // Verification

    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Count'},
      hovermode: 'closest'
    };

    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
  });
}

// Handling dropdown change
function optionChanged(newSampleId) {
  console.log(newSampleId); // Log the selected sample ID
  setupChartsAndMetadata(newSampleId);
}

// Fetching and log data at the start
fetchDataAndLog(dataEndpoint);

// Launching the dashboard
launchDashboard();

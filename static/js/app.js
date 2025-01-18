// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadatax = data.metadata;

    // Filter the metadata for the object with the desired sample number
    function filtering(meta) {
       return meta.id == sample;
     }
     let filteredmetadata = metadatax.filter(filtering);


    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata");
 

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredmetadata[0]).forEach(([key,value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
     });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_field = data.samples;


    // Filter the samples for the object with the desired sample number
    function filtering_samples(samps) {
      return samps.id == sample;
    }

    let filtered_sample = sample_field.filter(filtering_samples);


    function sort_by_key(array, key) {
    return array.sort(function(a, b)
    {
      var x = a[key]; var y = b[key];
     return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    };

    let sorted_filtered_samples = sort_by_key(filtered_sample, 'sample_values');

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sorted_filtered_samples[0].otu_ids;
    let otu_labels = sorted_filtered_samples[0].otu_labels;
    let sample_values = sorted_filtered_samples[0].sample_values;


    // Build a Bubble Chart

    let trace1 = {
      text: otu_labels,
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "YlGnBu",
      }
    };

    var data = [trace1];


    let layout = {
      title: "Bacteria cultures per sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of bacteria"},
     };

    // Render the Bubble Chart
   Plotly.newPlot("bubble", data, layout);



    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks_long = otu_ids.map(function(current) {
      return `OTU ${current}`;
    });


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately -> 

    let yticks = yticks_long.slice(0,10).reverse();
    let xticks = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();

    let trace2 = {
      text: labels,
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      marker:{
        color: xticks,
        colorscale: "YlGnBu",
      }   
      };

    let layout2 = {
        title: "Top 10 Bacteria cultures found",
        hovermode: "closest",
        xaxis: {title: "Number of bacteria"},
        yaxis: {title: "OTU"},
      };
      var data2 = [trace2];

    // Render the Bar Chart

    Plotly.newPlot("bar", data2, layout2)

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let Menu = d3.select(`#selDataset`);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let current_name = 0; current_name < names.length; current_name++) {
      Menu.append("option").text(names[current_name]).property("value",names[current_name]);
    }


    // Get the first sample from the list
    let selection_one = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(selection_one);
    buildCharts(selection_one);  


  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  buildMetadata(dataset)
  buildCharts(dataset);  
}

// Initialize the dashboard
init();

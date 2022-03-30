<template>
  <div
    v-if="!dataLoaded || !data2Loaded"
    style="
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div>Loading...</div>
  </div>
  <div v-else style="flex-grow: 1; display: flex; position: relative">
    <div
      style="flex-grow: 1"
      id="basemap-container"
      onresize="updateBasemap()"
    ></div>
    <div id="basemap-tooltip"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean,
});

const documentsByNE = ref({});
const NEByDocument = ref({});
const NECoordinates = ref({});
const data2Loaded = ref(false);

onMounted(() => {
  // Add event listener
  window.addEventListener("resize", updateBasemap);
  // Load Infomedia CSV
  console.log("Loading named entities data...");
  let _documentsByNE = {};
  let _NEByDocument = {};
  d3.csv("/add-datascape/data/infomedia_docid_NER.csv", (row) => {
    const doc = row.duid;
    const NEList = row[0].split("|");
    _NEByDocument[doc] = NEList;
    NEList.forEach((ne) => {
      if (_documentsByNE[ne] === undefined) {
        _documentsByNE[ne] = [];
      }
      _documentsByNE[ne].push(doc);
    });
  })
    .then(() => {
      console.log("...named entities data loaded.");
      documentsByNE.value = _documentsByNE;
      NEByDocument.value = _NEByDocument;
      data2Loaded.value = true;
    })
    .then(() => {
      console.log("Loading basemap data...");
      let _NECoordinates = {};
      d3.csv("/add-datascape/data/NE basemap.csv", (row) => {
        let ne = row["named entity"];
        if (_documentsByNE[ne] != undefined) {
          _NECoordinates[ne] = row;
        }
      }).then(() => {
        console.log("...basemap data loaded.");
        NECoordinates.value = _NECoordinates;
        updateBasemap();
      });
    });
});

onUnmounted(() => {
  // Add event listener
  window.removeEventListener("resize", updateBasemap);
});

watch(() => props.docs, updateBasemap);

function updateBasemap() {
  console.log("Update basemap. Documents:", (props.docs || []).length);

  if (!document.getElementById("basemap-container")) {
    return;
  }

  // Delete existing vis
  document.getElementById("basemap-container").innerHTML = "";

  // Get data
  let docList = props.docs.map((d) => d.id);
  console.log("Compute index...");
  // Aggregate the named entities of those documents
  let neIndex = {};
  docList.forEach((id) => {
    let neList = NEByDocument.value[id] || [];
    neList.forEach((ne) => {
      neIndex[ne] = (neIndex[ne] || 0) + 1;
    });
  });
  console.log("...done.");
  const data = Object.values(NECoordinates.value).filter((d, i) => {
    d.x = +d.x;
    d.y = +d.y;
    d.size = +d.size;
    if (isNaN(d.x) || isNaN(d.y) || isNaN(d.size)) return false;
    let ne = d["named entity"];
    d.count = neIndex[ne] || 0;
    return true;
  });

  // Get size
  const containerWidth =
    document.getElementById("basemap-container").offsetWidth;
  const containerHeight =
    document.getElementById("basemap-container").offsetHeight;

  // set the dimensions and margins of the graph
  const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom;
  const nodeMargin = 8;

  // append the svg object to the body of the page
  const svg = d3
    .select("#basemap-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Plot the data

  // Normalize ranges so that the two axes correspond (in the data)
  var xRange = d3.extent(data, (d) => d.x);
  var yRange = d3.extent(data, (d) => d.y);
  if (xRange[1] - xRange[0] > yRange[1] - yRange[0]) {
    let yMean = 0.5 * (yRange[0] + yRange[1]);
    yRange[0] = yMean - 0.5 * (xRange[1] - xRange[0]);
    yRange[1] = yMean + 0.5 * (xRange[1] - xRange[0]);
  } else {
    let xMean = 0.5 * (xRange[0] + xRange[1]);
    xRange[0] = xMean - 0.5 * (yRange[1] - yRange[0]);
    xRange[1] = xMean + 0.5 * (yRange[1] - yRange[0]);
  }

  // Normalize ranges so that the two axes correspond (in the picture)
  var xPicRange = [3 * nodeMargin, width - 3 * nodeMargin];
  var yPicRange = [3 * nodeMargin, height - 3 * nodeMargin];
  if (xPicRange[1] - xPicRange[0] < yPicRange[1] - yPicRange[0]) {
    let yMean = 0.5 * (yPicRange[0] + yPicRange[1]);
    yPicRange[0] = yMean - 0.5 * (xPicRange[1] - xPicRange[0]);
    yPicRange[1] = yMean + 0.5 * (xPicRange[1] - xPicRange[0]);
  } else {
    console.log("gogo")
    let xMean = 0.5 * (xPicRange[0] + xPicRange[1]);
    xPicRange[0] = xMean - 0.5 * (yPicRange[1] - yPicRange[0]);
    xPicRange[1] = xMean + 0.5 * (yPicRange[1] - yPicRange[0]);
  }

  // Add X axis
  var x = d3.scaleLinear().domain(xRange).range(xPicRange);
  // svg.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain(yRange).range([yPicRange[1], yPicRange[0]]);
  // svg.append("g")
  //   .call(d3.axisLeft(y));

  const sizeRatio = 0.2;
  const highlightScale = function (count) {
    return 0.08 * Math.sqrt(Math.log(2 + 1000 * (count - 1)));
  };

  var Tooltip = d3.select("#basemap-tooltip");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (e, d) {
    Tooltip.style("opacity", 1);
  };
  var mousemove = function (e, d) {
    Tooltip.html(
      d["named entity"] + "<br>Appears in " + d.count + " of these documents"
    )
      .style("left", d3.pointer(e)[0] + 20 + "px")
      .style("top", d3.pointer(e)[1] + "px");
  };
  var mouseleave = function (e, d) {
    Tooltip.style("opacity", 0);
  };

  // Background
  svg
    .append("g")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#c0cbcd");

  // Add dots background
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", function (d) {
      return sizeRatio * d.size + nodeMargin;
    })
    .style("fill", "#bfbda8");

  // Add dots (non highlight)
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", function (d) {
      return sizeRatio * d.size;
    })
    .style("fill", "#acaa92");

  // Add dots (highlight halo)
  svg
    .append("g")
    .selectAll("dot")
    .data(data.filter((d) => d.count > 0))
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", function (d) {
      return highlightScale(d.count) * d.size + 0.5 * nodeMargin;
    })
    .style("fill", "#dfddce")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Add dots (highlight)
  svg
    .append("g")
    .selectAll("dot")
    .data(data.filter((d) => d.count > 0))
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", function (d) {
      return highlightScale(d.count) * d.size;
    })
    .style("fill", "#303040")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}
</script>

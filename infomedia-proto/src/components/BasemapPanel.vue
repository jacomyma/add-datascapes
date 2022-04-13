<template>
  <div
    v-if="!dataLoaded"
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

<style>
#basemap-container {
  position: relative;
  overflow: hidden;
}
.bgCanvas, .hlCanvas, .hiddenCanvas {
  position: absolute;
}
.hiddenCanvas {
  display: none;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";
import * as StackBlur from "stackblur-canvas"

console.log("SB", StackBlur);

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean,
});

const NECoordinates = ref({});

onMounted(() => {
  console.log("Loading basemap data...");
  let _NECoordinates = {};
  d3.csv("/add-datascape/data/infomedia basemap.csv", (row) => {
    let ne = row["Id"];
    _NECoordinates[ne] = row;
  }).then(() => {
    console.log("...basemap data loaded.");
    NECoordinates.value = _NECoordinates;
    updateBasemap();
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
    /*let neList = NEByDocument.value[id] || [];
    neList.forEach((ne) => {
      neIndex[ne] = (neIndex[ne] || 0) + 1;
    });*/
  });
  console.log("...done.");
  const data = Object.values(NECoordinates.value).filter((d, i) => {
    d.x = +d.x;
    d.y = +d.y;
    d.size = +d.size;
    if (isNaN(d.x) || isNaN(d.y) || isNaN(d.size)) return false;
    let ne = d["Id"];
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
  const nodeMargin = 4;

  let bgCanvas = d3.select('#basemap-container')
    .append('canvas')
    .classed('bgCanvas', true)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let hlCanvas = d3.select('#basemap-container')
    .append('canvas')
    .classed('hlCanvas', true)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let hiddenCanvas = d3.select('#basemap-container')
    .append('canvas')
    .classed('hiddenCanvas', true)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
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
    let xMean = 0.5 * (xPicRange[0] + xPicRange[1]);
    xPicRange[0] = xMean - 0.5 * (yPicRange[1] - yPicRange[0]);
    xPicRange[1] = xMean + 0.5 * (yPicRange[1] - yPicRange[0]);
  }

  // Add X axis
  var x = d3.scaleLinear().domain(xRange).range(xPicRange);

  // Add Y axis
  var y = d3.scaleLinear().domain(yRange).range([yPicRange[1], yPicRange[0]]);

  const sizeRatio = 1;
  const highlightScale = function (count) {
    return Math.sqrt(Math.log(5 + 500 * (count - 1)));
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

  // Test draw on Canvas
  let bgCtx = bgCanvas.node().getContext('2d');
  let hlCtx = hlCanvas.node().getContext('2d');
  bgCtx.fillStyle = '#c0cbcd';
  bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);

  // Add dots background
  bgCtx.fillStyle = '#bfbda8';
  data.forEach(d => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio + nodeMargin, 0, 2*Math.PI);
    bgCtx.fill();
  })

  // Add dots (non highlight)
  bgCtx.fillStyle = '#acaa92';
  data.forEach(d => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio, 0, 2*Math.PI);
    bgCtx.fill();
  })

  // Blur!
  StackBlur.canvasRGB(bgCtx.canvas, 0, 0, bgCtx.canvas.width, bgCtx.canvas.height, bgCtx.canvas.width/128);

  // Add dots (highlight halo)
  hlCtx.fillStyle = '#dfddce';
  data.forEach(d => {
    hlCtx.beginPath();
    hlCtx.arc(x(d.x), y(d.y), highlightScale(d.count) * sizeRatio + 2, 0, 2*Math.PI);
    hlCtx.fill();
  })

  // Blur!
  StackBlur.canvasRGBA(hlCtx.canvas, 0, 0, hlCtx.canvas.width, hlCtx.canvas.height, hlCtx.canvas.width/32);

  // Add dots (highlight)
  hlCtx.fillStyle = '#FFF';
  data.forEach(d => {
    hlCtx.beginPath();
    hlCtx.arc(x(d.x), y(d.y), highlightScale(d.count) * sizeRatio, 0, 2*Math.PI);
    hlCtx.fill();
  })
}
</script>

<template>
  <div style="flex-grow: 1; display: flex; position: relative">
    <div
      style="flex-grow: 1"
      id="basemap-container"
      onresize="updateBasemap()"
    >
      <canvas class="bgCanvas"></canvas>
      <canvas class="hlCanvas"></canvas>
      <canvas class="hiddenCanvas"></canvas>
    </div>
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

const props = defineProps({
  focusedEntities: Array
});

const NECoordinates = ref({});
let data

onMounted(() => {
  console.log("Loading basemap data...");
  let _NECoordinates = {};
  d3.csv("/add-datascape/data/infomedia basemap.csv", (row) => {
    row["Id"] = row["Id"].toLowerCase();
    let ne = row["Id"]
    _NECoordinates[ne] = row;
  }).then(() => {
    console.log("...basemap data loaded.");
    NECoordinates.value = _NECoordinates;

    data = Object.values(NECoordinates.value).filter((d, i) => {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      if (isNaN(d.x) || isNaN(d.y) || isNaN(d.size)) return false;
      else return true;
    });

    updateBasemap();
  });
});

onUnmounted(() => {
  // Add event listener
  window.removeEventListener("resize", updateBasemap);
});

watch(() => props.focusedEntities, updateBasemap);

function updateBasemap() {
  console.log("Update basemap. Entities:", (props.focusedEntities || []).length);

  updateBackground()
  updateHighlight()

  return

  
  // var Tooltip = d3.select("#basemap-tooltip");

  // Three function that change the tooltip when user hover / move / leave a cell
  // TODO: make it work on Canvas
  /*var mouseover = function (e, d) {
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
  };*/
}

function updateHighlight() {
  // Get data
  let neIndex = {};
  props.focusedEntities.forEach((entity) => {
    neIndex[entity.toLowerCase()] = true
  });

  data.forEach((d, i) => {
    let ne = d["Id"];
    d.highlight = !!neIndex[d.Id];
    return true;
  });

  const sizing = getSizing();
  const margin = sizing.margin;
  const width = sizing.width;
  const height = sizing.height;
  const nodeMargin = sizing.nodeMargin;
  const x = sizing.x;
  const y = sizing.y;
  const sizeRatio = sizing.sizeRatio;

  let hlCanvas = d3.select('#basemap-container canvas.hlCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let hiddenCanvas = d3.select('#basemap-container canvas.hiddenCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  let hlCtx = hlCanvas.node().getContext('2d');

  // Add dots (highlight halo)
  hlCtx.fillStyle = '#dfddce';
  data
  .filter(d => d.highlight)
  .forEach(d => {
    hlCtx.beginPath();
    hlCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + 2, 0, 2*Math.PI);
    hlCtx.fill();
  })

  // Blur!
  StackBlur.canvasRGBA(hlCtx.canvas, 0, 0, hlCtx.canvas.width, hlCtx.canvas.height, hlCtx.canvas.width/32);

  // Add dots (highlight)
  hlCtx.fillStyle = '#FFF';
  data
  .filter(d => d.highlight)
  .forEach(d => {
    hlCtx.beginPath();
    hlCtx.arc(x(d.x), y(d.y), sizeRatio*d.size, 0, 2*Math.PI);
    hlCtx.fill();
  })

}

function updateBackground() {
  const sizing = getSizing();
  const margin = sizing.margin;
  const width = sizing.width;
  const height = sizing.height;
  const nodeMargin = sizing.nodeMargin;
  const x = sizing.x;
  const y = sizing.y;
  const sizeRatio = sizing.sizeRatio;

  let bgCanvas = d3.select('#basemap-container canvas.bgCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  let bgCtx = bgCanvas.node().getContext('2d');
  bgCtx.fillStyle = '#c0cbcd';
  bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);

  // Add dots background
  bgCtx.fillStyle = '#bfbda8';
  data.forEach(d => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + nodeMargin, 0, 2*Math.PI);
    bgCtx.fill();
  })

  // Add dots (non highlight)
  bgCtx.fillStyle = '#acaa92';
  data.forEach(d => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio*d.size, 0, 2*Math.PI);
    bgCtx.fill();
  })

  // Blur!
  StackBlur.canvasRGB(bgCtx.canvas, 0, 0, bgCtx.canvas.width, bgCtx.canvas.height, bgCtx.canvas.width/128);
}

function getSizing() {
  let ns = {}

  // Get size
  const containerWidth =
    document.getElementById("basemap-container").offsetWidth;
  const containerHeight =
    document.getElementById("basemap-container").offsetHeight;

  // set the dimensions and margins of the graph
  ns.margin = { top: 0, right: 0, bottom: 0, left: 0 };
  ns.width = containerWidth - ns.margin.left - ns.margin.right;
  ns.height = containerHeight - ns.margin.top - ns.margin.bottom;
  ns.nodeMargin = 4;


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
  var xPicRange = [3 * ns.nodeMargin, ns.width - 3 * ns.nodeMargin];
  var yPicRange = [3 * ns.nodeMargin, ns.height - 3 * ns.nodeMargin];
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
  ns.x = d3.scaleLinear().domain(xRange).range(xPicRange);

  // Add Y axis
  ns.y = d3.scaleLinear().domain(yRange).range([yPicRange[1], yPicRange[0]]);

  ns.sizeRatio = 1;

  return ns
}

</script>

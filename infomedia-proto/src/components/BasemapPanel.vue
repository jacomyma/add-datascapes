<template>
  <div style="flex-grow: 1; display: flex; position: relative">
    <div
      style="flex-grow: 1"
      id="basemap-container"
    >
      <canvas class="bgCanvas"></canvas><!-- Background -->
      <canvas class="hlCanvas"></canvas><!-- Highlights -->
      <canvas class="lbCanvas"></canvas><!-- Label blocks -->
      <canvas class="lCanvas"></canvas><!-- Labels -->
      <canvas class="aCanvas"></canvas><!-- Annotations -->
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
.bgCanvas, .hlCanvas, .hiddenCanvas, .lCanvas, .lbCanvas, .aCanvas {
  position: absolute;
}
.lCanvas, .aCanvas {
  width: 100%;
  height: 100%;
}
.hiddenCanvas, .lbCanvas {
  display: none;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";
import * as StackBlur from "stackblur-canvas"
import appSettings from '../plugins/settings';

const props = defineProps({
  focusedEntities: Array
});

const NECoordinates = ref({});
let data

onMounted(() => {
  console.log("Loading basemap data...");
  let _NECoordinates = {};
  d3.csv(appSettings.basemap, (row) => {
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
    window.addEventListener("resize", updateBasemap);
    updateBasemap();
  });
});

onUnmounted(() => {
  // Add event listener
  window.removeEventListener("resize", updateBasemap);
});

watch(() => props.focusedEntities, updateHighlight);

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
  console.log("Update highlights")

  // Get data
  let neIndex = {};
  props.focusedEntities.forEach((entity) => {
    neIndex[entity.toLowerCase()] = true
  });

  data.forEach((d, i) => {
    let ne = d["Id"];
    d.highlight = !!neIndex[d.Id];
  });

  const highlights = props.focusedEntities && props.focusedEntities.length>0;

  const sizing = getSizing();
  const margin = sizing.margin;
  const width = sizing.width;
  const height = sizing.height;
  const nodeMargin = sizing.nodeMargin;
  const x = sizing.x;
  const y = sizing.y;
  const sizeRatio = sizing.sizeRatio;
  const nodeSizeOffset = 16;

  let hlCanvas = d3.select('#basemap-container canvas.hlCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let hlCtx = hlCanvas.node().getContext('2d');
  let lbCanvas = d3.select('#basemap-container canvas.lbCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let lbCtx = lbCanvas.node().getContext('2d');
  let lCanvas = d3.select('#basemap-container canvas.lCanvas')
    .attr('width', (width + margin.left + margin.right)*window.devicePixelRatio)
    .attr('height', (height + margin.top + margin.bottom)*window.devicePixelRatio);
  let lCtx = lCanvas.node().getContext('2d');
  lCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset to avoid any problem
  lCtx.scale(2, 2)
  let hiddenCanvas = d3.select('#basemap-container canvas.hiddenCanvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  let hiddenCtx = hiddenCanvas.node().getContext('2d');
  let aCanvas = d3.select('#basemap-container canvas.aCanvas')
    .attr('width', (width + margin.left + margin.right)*window.devicePixelRatio)
    .attr('height', (height + margin.top + margin.bottom)*window.devicePixelRatio);
  let aCtx = aCanvas.node().getContext('2d');
  aCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset to avoid any problem
  aCtx.scale(2, 2)
  
  let orderedNodes

  if (highlights) {

    // Add dots (highlight halo)
    hlCtx.fillStyle = 'rgba(255,255,255,.2)';
    data
    .filter(d => d.highlight)
    .forEach(d => {
      hlCtx.beginPath();
      hlCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + nodeSizeOffset, 0, 2*Math.PI);
      hlCtx.fill();
    })

    // Blur!
    StackBlur.canvasRGBA(hlCtx.canvas, 0, 0, hlCtx.canvas.width, hlCtx.canvas.height, hlCtx.canvas.width/50);

    // Add dots (highlight)
    hlCtx.fillStyle = '#FFF';
    data
    .filter(d => d.highlight)
    .forEach(d => {
      hlCtx.beginPath();
      hlCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + .5, 0, 2*Math.PI);
      hlCtx.fill();
    })

    // Order nodes for labels
    orderedNodes = data.filter(d => d.highlight)
    lCtx.strokeStyle = "#999785"
    lCtx.fillStyle = "#FFFFFF";

  } else {
    // No highlights: just show the dots
    // Add dots (highlight)
    hlCtx.fillStyle = '#766e6c';
    data
    .forEach(d => {
      hlCtx.beginPath();
      hlCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + .5, 0, 2*Math.PI);
      hlCtx.fill();
    })

    // Order nodes for labels
    orderedNodes = data.filter(d => true)
    lCtx.strokeStyle = "#999785";
    lCtx.fillStyle = "#000000";
  }

  // Order nodes! (to display labels)
  orderedNodes.sort(function(a,b){
    return b.size-a.size
  })

  // Display labels
  const fontSize = 14
  const yOffset = 8
  const boxMargin = 6
  lCtx.font = fontSize+'px sans-serif';
  lCtx.textAlign = 'center';
  lCtx.lineWidth = 4;
  lCtx.lineJoin = "round"
  lCtx.lineCap = "round"
  // Bounding box context
  lbCtx.fillStyle = "#FFFFFF";
  const skip = 3 // Speed up (precision loss though)
  orderedNodes
  .filter((d,i) => i<500)
  .forEach((d,i) => {
    const label = d.Id;
    // Bounding box
    const box = lCtx.measureText(label)
    const w = box.width + 2*boxMargin
    const h = 0.8*fontSize + 2*boxMargin
    const xmin = x(d.x)-w/2
    const ymin = y(d.y)-h/2+yOffset
    const xmax = xmin + w
    const ymax = ymin + h

    let display = true
    for (let x=xmin; x<xmax; x+=skip) {
      for (let y=ymin; y<ymax; y+=skip) {
        var p = lbCtx.getImageData(x, y, 1, 1).data;
        if (p[0]>0) {
          x = xmax
          y = ymax
          display = false
        }
      }
    }

    if (display) {

      lbCtx.rect(xmin, ymin, w, h)
      lbCtx.fill();

      lCtx.strokeText(label, x(d.x), y(d.y)+yOffset);
      lCtx.fillText(label, x(d.x), y(d.y)+yOffset);

    }
  })

  // Annotations
  // Polygons
  aCtx.lineWidth = .8;
  aCtx.strokeStyle = "#FFFFFF"
  appSettings.basemapPolygons.forEach(polygon => {
    aCtx.beginPath()
    polygon.forEach((d,i) => {
      if (i==0) {
        aCtx.moveTo(x(d[0]), y(d[1]))
      } else {
        aCtx.lineTo(x(d[0]), y(d[1]))
      }
    })
    aCtx.stroke()
  })
  // Labels
  aCtx.font = 'italic 18px sans-serif';
  aCtx.lineWidth = 3;
  aCtx.lineJoin = "round"
  aCtx.lineCap = "round"
  aCtx.strokeStyle = "#9ba7a9"
  aCtx.fillStyle = "#FFFFFF";
  appSettings.basemapLabels.forEach(d => {
    aCtx.textAlign = d.anchor || 'center';
    aCtx.strokeText(d.label, x(d.x), y(d.y)+yOffset);
    aCtx.fillText(d.label, x(d.x), y(d.y)+yOffset);
  })

  // Bind mouse stuff
  d3.select('.aCanvas').on('click', function(e){
    let mouseX = e.layerX || e.offsetX;
    let mouseY = e.layerY || e.offsety;
    let X = Math.round(sizing.x.invert(mouseX))
    let Y = Math.round(sizing.y.invert(mouseY))
    console.log(X, Y)
  })

}

function updateBackground() {
  console.log("Update background")
  
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
  bgCtx.fillStyle = '#9ba7a9';
  bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);

  // Add dots background
  bgCtx.fillStyle = '#999785';
  data.forEach(d => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio*d.size + nodeMargin, 0, 2*Math.PI);
    bgCtx.fill();
  })

  // Add dots
  bgCtx.fillStyle = '#615e5b';
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
  ns.nodeMargin = 8;

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

  ns.sizeRatio = appSettings.basemapNodeSizeRatio * .3;

  return ns
}

</script>

<template>
  <div style="flex-grow: 1; display: flex; position: relative">
    <div style="flex-grow: 1" id="basemap-container">
      <canvas class="bgCanvas"></canvas
      ><!-- Background -->
      <canvas class="hlCanvas"></canvas
      ><!-- Highlights -->
      <canvas class="lbCanvas"></canvas
      ><!-- Label blocks -->
      <canvas class="lCanvas"></canvas
      ><!-- Labels -->
      <canvas class="aCanvas"></canvas
      ><!-- Annotations -->
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
.bgCanvas,
.hlCanvas,
.hiddenCanvas,
.lCanvas,
.lbCanvas,
.aCanvas {
  position: absolute;
}
.lCanvas,
.aCanvas {
  width: 100%;
  height: 100%;
}
.hiddenCanvas,
.lbCanvas {
  display: none;
}
</style>



<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";
import * as StackBlur from "stackblur-canvas";
import appSettings from "../plugins/settings";

const props = defineProps({
  focusedEntities: Array,
  showLabels: Boolean,
  showClusterShapes: Boolean,
  showClusterLabels: Boolean,
  quickButUgly: Boolean,
  highlights: Boolean,
});

const NECoordinates = ref({});
let data;

onMounted(() => {
  console.log("Loading basemap data...");
  let _NECoordinates = {};
  d3.csv(appSettings.basemap, (row) => {
    row["Id"] = row["Id"].toLowerCase();
    let ne = row["Id"];
    _NECoordinates[ne] = row;
  }).then(() => {
    console.log("...basemap data loaded.");
    NECoordinates.value = _NECoordinates;

    data = Object.values(NECoordinates.value).filter((d) => {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      d.showlabel = d.showlabel == "true";
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

watch(() => [props.focusedEntities, props.highlights], updateHighlight);
watch(() => props.showLabels, updateHighlight);
watch(() => props.showClusterLabels, updateBackground);
watch(() => props.showClusterShapes, updateBackground);
watch(() => props.quickButUgly, updateBasemap);

function updateBasemap() {
  updateBackground();
  updateHighlight();

  return;

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

let cacheData = []

function updateHighlight() {
  const sizing = getSizing();

  // CACHE
  const signatureElements = {
    h: props.highlights,
    e: props.focusedEntities,
    l: props.showLabels,
    u: props.quickButUgly,
    s: sizing,
  }
  const signature = hashObject(signatureElements)
  const retrieved = caching.retrieve("highlight", signature);
  if (retrieved) {
    let hlCanvas = d3.select("#basemap-container canvas.hlCanvas")
    let hlCtx = hlCanvas.node().getContext("2d");
    hlCtx.putImageData(retrieved.hl, 0, 0)
    let lbCanvas = d3.select("#basemap-container canvas.lbCanvas")
    let lbCtx = lbCanvas.node().getContext("2d");
    lbCtx.putImageData(retrieved.lb, 0, 0)
    let lCanvas = d3.select("#basemap-container canvas.lCanvas")
    let lCtx = lCanvas.node().getContext("2d");
    lCtx.putImageData(retrieved.l, 0, 0)

    return
  }

  // Get data
  let neIndex = {};
  let max = 0;
  let count = 0;
  let total = 0;
  props.focusedEntities.forEach((entityObj) => {
    let score = entityObj.score;
    neIndex[entityObj.label.toLowerCase()] = score;
    max = Math.max(max, score)
    total += score;
    count++;
  });

  const baseOpacity = 0.2;
  const saturation = 1000; // At that point, light is too much...
  const average = baseOpacity * total/(max*count);
  const ratio1 = (average<0.3)?(0.3/average):(1);
  const ratio2 = Math.min(1, saturation / (ratio1 * total / max));
  data.forEach((d) => {
    d.highlight = !!neIndex[d.Id];
    d.score = neIndex[d.Id] || 0;
    d.intensity = Math.max(0, Math.min(1, ratio2 * ratio1 * baseOpacity * d.score/max));
  });

  const highlights = props.highlights; //props.focusedEntities && props.focusedEntities.length > 0;

  const margin = sizing.margin;
  const width = sizing.width;
  const height = sizing.height;
  const x = sizing.x;
  const y = sizing.y;
  const sizeRatio = sizing.sizeRatio;
  const nodeSizeOffset = 16;

  let hlCanvas = d3
    .select("#basemap-container canvas.hlCanvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  let hlCtx = hlCanvas.node().getContext("2d");
  let lbCanvas = d3
    .select("#basemap-container canvas.lbCanvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  let lbCtx = lbCanvas.node().getContext("2d");
  let lCanvas = d3
    .select("#basemap-container canvas.lCanvas")
    .attr(
      "width",
      (width + margin.left + margin.right) * window.devicePixelRatio
    )
    .attr(
      "height",
      (height + margin.top + margin.bottom) * window.devicePixelRatio
    );
  let lCtx = lCanvas.node().getContext("2d");
  lCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset to avoid any problem
  lCtx.scale(2, 2);
  // let hiddenCanvas = d3
  //   .select("#basemap-container canvas.hiddenCanvas")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom);
  // let hiddenCtx = hiddenCanvas.node().getContext("2d");

  let orderedNodes;

  if (highlights) {
    if (props.quickButUgly) {
      // Add dots (highlight halo)
      data
        .filter((d) => d.highlight)
        .forEach((d) => {
          let halfsize = sizeRatio * d.size + 1.2 * nodeSizeOffset
          hlCtx.fillStyle = "rgba(255,255,255,"+(0.5 * d.intensity)+")";
          hlCtx.fillRect(
            x(d.x) - halfsize,
            y(d.y) - halfsize,
            2 * halfsize,
            2 * halfsize,
          )
        });
    } else {
      // Add dots (highlight halo)
      data
        .filter((d) => d.highlight)
        .forEach((d) => {
          hlCtx.fillStyle = "rgba(255,255,255,"+d.intensity+")";
          hlCtx.beginPath();
          hlCtx.arc(
            x(d.x),
            y(d.y),
            sizeRatio * d.size + nodeSizeOffset,
            0,
            2 * Math.PI
          );
          hlCtx.fill();
        });

      // Blur!
      StackBlur.canvasRGBA(
        hlCtx.canvas,
        0,
        0,
        hlCtx.canvas.width,
        hlCtx.canvas.height,
        hlCtx.canvas.width / 50
      );

      // Add dots (highlight)
      hlCtx.fillStyle = "#FFFFFFBB";
      data
        .filter((d) => d.highlight)
        .forEach((d) => {
          hlCtx.beginPath();
          hlCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + .6, 0, 2 * Math.PI);
          hlCtx.fill();
        });
    }

    // Order nodes for labels
    orderedNodes = data.filter((d) => d.highlight);
    lCtx.strokeStyle = "#999785";
    lCtx.fillStyle = "#FFFFFF";
  } else {
    if (props.quickButUgly) {
      // No highlights: just show the dots
      // Add dots (highlight)
      hlCtx.fillStyle = "#766e6c";
      data.forEach((d) => {
        hlCtx.fillRect(x(d.x), y(d.y), 2 * (sizeRatio * d.size + 0.5), 2 * (sizeRatio * d.size + 0.5));
      });
    } else {
      // No highlights: just show the dots
      // Add dots (highlight)
      hlCtx.fillStyle = "#766e6c";
      data.forEach((d) => {
        hlCtx.beginPath();
        hlCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + 0.5, 0, 2 * Math.PI);
        hlCtx.fill();
      });      
    }

    // Order nodes for labels
    orderedNodes = data.filter(() => true);
    lCtx.strokeStyle = "#999785";
    lCtx.fillStyle = "#000000";
  }

  // Display labels
  const yOffset = 8;
  if (props.showLabels) {

    // Order nodes! (to display labels)
    orderedNodes.sort(function (a, b) {
      if (a.showlabel) {
        if (b.showlabel) {
          return b.score-a.score || b.size - a.size;
        } else return -1;
      } else {
        if (b.showlabel) {
          return 1;
        } else return b.score-a.score || b.size - a.size;
      }
    });

    const fontSize = 12;
    const boxMargin = 6;
    const labelsToConsider = props.quickButUgly?150:10000;
    lCtx.font = fontSize + 'px "Nunito", serif';
    lCtx.textAlign = "center";
    lCtx.lineWidth = 4;
    lCtx.lineJoin = "round";
    lCtx.lineCap = "round";
    // Bounding box context
    lbCtx.fillStyle = "#FFFFFF";
    const skip = 5; // Speed up (precision loss though)
    let cap = labelsToConsider;
    orderedNodes
      .filter((d, i) => i < labelsToConsider)
      .forEach((d) => {
        if (cap <= 0) {
          return;
        }
        const label = d.Id;
        // Bounding box
        const box = lCtx.measureText(label);
        const w = box.width + 2 * boxMargin;
        const h = 0.8 * fontSize + 2 * boxMargin;
        const xmin = x(d.x) - w / 2;
        const ymin = y(d.y) - h / 2 + yOffset;
        const xmax = xmin + w;
        const ymax = ymin + h;

        let display = true;
        for (let x = xmin; x < xmax; x += skip) {
          for (let y = ymin; y < ymax; y += skip) {
            var p = lbCtx.getImageData(x, y, 1, 1).data;
            if (p[0] > 0) {
              x = xmax;
              y = ymax;
              display = false;
            }
          }
        }

        if (display) {
          cap--;

          lbCtx.rect(xmin, ymin, w, h);
          lbCtx.fill();

          lCtx.strokeText(label, x(d.x), y(d.y) + yOffset);
          lCtx.fillText(label, x(d.x), y(d.y) + yOffset);
        }
      });
  }

  // Bind mouse stuff
  d3.select(".aCanvas").on("click", function (e) {
    let mouseX = e.layerX || e.offsetX;
    let mouseY = e.layerY || e.offsety;
    let X = Math.round(sizing.x.invert(mouseX));
    let Y = Math.round(sizing.y.invert(mouseY));
    // TODO: remove me
    window.polygon.push("[" + X + "," + Y + "]");
    console.log(window.polygon.join(","));
  });

  // Cache
  const dataToCache = {
    hl: hlCtx.getImageData(0, 0, hlCtx.canvas.width, hlCtx.canvas.height),
    lb: lbCtx.getImageData(0, 0, lbCtx.canvas.width, lbCtx.canvas.height),
    l: lCtx.getImageData(0, 0, lCtx.canvas.width, lCtx.canvas.height),
  }
  caching.store("highlight", signature, dataToCache)
}

const caching = (function(){
  let ns = {};
  ns.stores = {}
  ns.maxStoreSize = 25;

  ns.store = function(store, signature, dataToCache) {
    if (ns.stores[store] === undefined) {
      ns.stores[store] = {}
    }
    let s = ns.stores[store]
    s[signature] = {
      ts: Date.now(),
      data: dataToCache
    }

    // Check size
    let size = Object.keys(s).length
    if (size > ns.maxStoreSize) {
      // Delete oldest element
      let ts = Infinity
      let oldestKey = false
      for (let signature in s) {
        if (s[signature].ts < ts) {
          ts = s[signature].ts
          oldestKey = signature
        }
      }
      delete s[oldestKey]
    }
  }

  ns.retrieve = function(store, signature) {
    if (ns.stores[store]) {
      let s = ns.stores[store]
      if (s[signature] !== undefined) {
        s[signature].ts = Date.now()
        return s[signature].data
      }
    }
    return false
  }

  return ns;
})();

function updateBackground() {
  window.polygon = []; // TODO: remove me

  const sizing = getSizing();
  const margin = sizing.margin;
  const width = sizing.width;
  const height = sizing.height;
  const nodeMargin = sizing.nodeMargin;
  const x = sizing.x;
  const y = sizing.y;
  const sizeRatio = sizing.sizeRatio;

  let bgCanvas = d3
    .select("#basemap-container canvas.bgCanvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  let aCanvas = d3
    .select("#basemap-container canvas.aCanvas")
    .attr(
      "width",
      (width + margin.left + margin.right) * window.devicePixelRatio
    )
    .attr(
      "height",
      (height + margin.top + margin.bottom) * window.devicePixelRatio
    );
  let aCtx = aCanvas.node().getContext("2d");
  aCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset to avoid any problem
  aCtx.scale(2, 2);

  let bgCtx = bgCanvas.node().getContext("2d");
  bgCtx.fillStyle = "#9ba7a9";
  bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);

  // Add dots background
  bgCtx.fillStyle = "#999785";
  data.forEach((d) => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + nodeMargin, 0, 2 * Math.PI);
    bgCtx.fill();
  });

  // Add dots
  bgCtx.fillStyle = "#615e5b";
  data.forEach((d) => {
    bgCtx.beginPath();
    bgCtx.arc(x(d.x), y(d.y), sizeRatio * d.size, 0, 2 * Math.PI);
    bgCtx.fill();
  });

  // Blur!
  if (!props.quickButUgly) {
    StackBlur.canvasRGB(
      bgCtx.canvas,
      0,
      0,
      bgCtx.canvas.width,
      bgCtx.canvas.height,
      bgCtx.canvas.width / 128
    );
  }

  // Annotations
  // Polygons & lines
  const displayPolygons = function (shape) {
    aCtx.beginPath();
    shape.forEach((d, i) => {
      if (i == 0) {
        aCtx.moveTo(x(d[0]), y(d[1]));
      } else {
        aCtx.lineTo(x(d[0]), y(d[1]));
      }
    });
    aCtx.stroke();
  };
  if (props.showClusterShapes) {
    aCtx.lineWidth = 0.8;
    aCtx.strokeStyle = "#286667";
    appSettings.basemapPolygons.forEach(displayPolygons);
  }
  // Labels
  if (props.showClusterLabels) {
    // Label lines
    aCtx.lineWidth = 0.8;
    aCtx.strokeStyle = "#286667";
    appSettings.basemapLabelsLines.forEach(displayPolygons);

    // Label text
    const yOffset = 6;
    aCtx.font = '16px "IBM Plex Serif", sans-serif';
    aCtx.lineWidth = 4;
    aCtx.lineJoin = "round";
    aCtx.lineCap = "round";
    aCtx.strokeStyle = "#9ba7a9";
    aCtx.fillStyle = "#286667";
    appSettings.basemapLabels.forEach((d) => {
      aCtx.textAlign = d.anchor || "center";
      aCtx.strokeText(d.label.toUpperCase(), x(d.x), y(d.y) + yOffset);
      aCtx.fillText(d.label.toUpperCase(), x(d.x), y(d.y) + yOffset);
    });
  }
}

function getSizing() {
  let ns = {};

  // Get size
  const containerWidth =
    document.getElementById("basemap-container").offsetWidth;
  const containerHeight =
    document.getElementById("basemap-container").offsetHeight;

  // set the dimensions and margins of the graph
  ns.margin = { top: 20, right: 80, bottom: 20, left: 80 };
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
  var xPicRange = [
    ns.margin.left + 3 * ns.nodeMargin,
    ns.margin.left + ns.width - 3 * ns.nodeMargin,
  ];
  var yPicRange = [
    ns.margin.top + 3 * ns.nodeMargin,
    ns.margin.top + ns.height - 3 * ns.nodeMargin,
  ];
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

  ns.sizeRatio = appSettings.basemapNodeSizeRatio * 0.3;

  return ns;
}

function hashObject(obj) {
  const txt = JSON.stringify(obj);
  return hashCode(txt);
}

function hashCode(txt) {
  let hash = 0;
  for (let i = 0; i < txt.length; i++) {
      let char = txt.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
</script>

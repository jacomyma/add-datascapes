<template>
  <div style="flex-grow: 1; display: flex; position: relative">
    <div style="flex-grow: 1" id="basemap-container">
      <!-- Background -->
      <canvas class="bgCanvas"></canvas>
      <!-- Highlights -->
      <canvas class="hlCanvas"></canvas>
      <!-- Label blocks -->
      <canvas class="lbCanvas"></canvas>
      <!-- Labels -->
      <canvas class="lCanvas"></canvas>
      <!-- Hidden canvas for click stuff -->
      <canvas class="hiddenCanvas"></canvas>
      <!-- Annotations -->
      <canvas class="aCanvas"></canvas>
    </div>
    <div id="basemap-tooltip" class="card"></div>
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
#basemap-tooltip {
  font: 12px "Nunito", sans-serif;
  pointer-events: none;
}
</style>



<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";
import * as d3hexbin from "d3-hexbin";
import * as StackBlur from "stackblur-canvas";
import appSettings from "../plugins/settings";

const props = defineProps({
  focusedEntities: Array,
  showLabels: Boolean,
  showClusterShapes: Boolean,
  showClusterLabels: Boolean,
  quickButUgly: Boolean,
  highlights: Boolean,
  query: String,
  redrawState: String,
});

const emit = defineEmits(["query"]);

const NECoordinates = ref({});
let data;

// function to create new colors for picking
let colorToNode;
let nextCol = 1;
function genColor(){
  var ret = [];
  if (nextCol < 16777215){
    ret.push(nextCol & 0xff); //R
    ret.push((nextCol & 0xff00) >> 8); //G
    ret.push((nextCol & 0xff0000) >> 16); //B

    nextCol += 1;
  }
  const col = "rgb(" + ret.join(',') + ")";
  return col;
}

onMounted(() => {
  console.log("Loading basemap data...");
  let _NECoordinates = {};
  d3.csv(import.meta.env.BASE_URL+appSettings.basemap, (row) => {
    // row["key"] = row["key"].toLowerCase();
    let ne = row["key"];
    _NECoordinates[ne] = row;
  }).then(() => {
    console.log("...basemap data loaded.");
    NECoordinates.value = _NECoordinates;

    colorToNode = {};

    data = Object.values(NECoordinates.value).filter((d) => {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      d.showlabel = d.showlabel == "true";
      d.hiddenCol = genColor();
      colorToNode[d.hiddenCol] = d
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
watch(() => [props.quickButUgly, props.redrawState], updateBasemap);

document.fonts.ready.then(updateBasemap)

function updateBasemap() {
  if (data) {
    updateBackground();
    updateHighlight();
  }
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
    r: props.redrawState,
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
    let hiddenCanvas = d3.select("#basemap-container canvas.hiddenCanvas")
    let hiddenCtx = hiddenCanvas.node().getContext("2d");
    hiddenCtx.putImageData(retrieved.hidden, 0, 0)

    return
  }

  // Get data
  let neIndex = {};
  let max = 0;
  let count = 0;
  let total = 0;
  props.focusedEntities.forEach(entityObj => {
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
    let key = d.key.toLowerCase();
    d.highlight = !!neIndex[key];
    d.score = neIndex[key] || 0;
    d.intensity = Math.max(0, Math.min(1, ratio2 * ratio1 * baseOpacity * d.score/max));
  });

  const highlights = props.highlights;

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
  lCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  let hiddenCanvas = d3
    .select("#basemap-container canvas.hiddenCanvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  let hiddenCtx = hiddenCanvas.node().getContext("2d");

  let orderedNodes;

  if (highlights) {
    const filteredData = data.filter(d => d.highlight)
    if (props.quickButUgly) {
      // Add dots (highlight halo)
      filteredData.forEach(d => {
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
      // // Hexbin
      // const hsize = Math.min(width, height) * 0.04; // Hex radius
      // var inputForHexbinFun = []
      // filteredData.forEach(function(d) {
      //   inputForHexbinFun.push( [x(d.x), y(d.y)] )
      // })
      // // Prepare a color palette
      // var color = d3.scalePow()
      //     .exponent(0.666)
      //     .domain([0, 60]) // Number of points (order of magnitude)
      //     .range(["transparent",  "#EEEEEE"])
      //     .clamp(true)
      // // Compute the hexbin data
      // var hexbin = d3hexbin.hexbin()
      //   .radius(hsize) // size of the bin in px
      //   .extent([ [0, 0], [width + margin.left + margin.right, height + margin.top + margin.bottom] ])
      // // Draw
      // hexbin(inputForHexbinFun).forEach(h => {
      //   hlCtx.fillStyle = color(h.length);
      //   hlCtx.beginPath();
      //   hlCtx.moveTo(h.x + hsize * Math.cos(Math.PI/6), h.y + hsize * Math.sin(Math.PI/6));
      //   for (let side=0; side < 7; side++) {
      //     hlCtx.lineTo(h.x + hsize * Math.cos(Math.PI/6 + side * 2 * Math.PI/6), h.y + hsize * Math.sin(Math.PI/6 + side * 2 * Math.PI/6));
      //   }
      //   hlCtx.fill();
      // });

      // /// Compute and draw density contours
      // const densityBandwidth = Math.min(width, height) * 0.03
      // const densityThresholds = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(d => 0.01*Math.pow(1.6,d))
      // const densityContourColor = "#FFFFFF"
      // const densityContourThickness = 1
      // // Compute
      // let contours = d3.contourDensity()
      //     .x(d => x(d.x))
      //     .y(d => y(d.y))
      //     .weight(d => d.score)
      //     .size([width + margin.left + margin.right, height + margin.top + margin.bottom])
      //     .cellSize(Math.min(width, height)/256)
      //     .bandwidth(densityBandwidth)
      //     .thresholds(densityThresholds)
      //   (filteredData);
      // // Draw density contours
      // hlCtx.strokeStyle = densityContourColor;
      // hlCtx.lineWidth = densityContourThickness;
      // const generator = d3.geoPath().context(hlCtx);
      // contours.forEach(multipolygon => {
      //   hlCtx.beginPath();
      //   generator(multipolygon)
      //   hlCtx.stroke();
      // });

      // Improvised KDE
      const densityRadius = Math.min(width, height) * 0.04 // aka bandwidth
      // Paint it black
      hlCtx.fillStyle = "#000000";
      hlCtx.fillRect(0, 0, hlCtx.canvas.width, hlCtx.canvas.height);
      // Draw dots semi-transparently
      hlCtx.fillStyle = "#FFFFFF55";
      filteredData.forEach((d) => {
          hlCtx.beginPath();
          hlCtx.arc(x(d.x), y(d.y), sizeRatio * 200, 0, 2 * Math.PI);
          hlCtx.fill();
        })
      // Blur (bandwidth)
      StackBlur.canvasRGB(
        hlCtx.canvas,
        0,
        0,
        hlCtx.canvas.width,
        hlCtx.canvas.height,
        densityRadius
      )
      // Edit imagedata directly
      let imgd = hlCtx.getImageData(0, 0, hlCtx.canvas.width, hlCtx.canvas.height)
      const steepness = 0.1
      const levels = 6
      for (let i=0; i<imgd.data.length; i+=4) {
        let lvl = 255 * Math.log(1+steepness*imgd.data[i])/Math.log(1+steepness*255)
        lvl = Math.floor(lvl * levels/255) * 255/levels
        lvl = Math.floor(lvl)
        // Rewrite the pixel as white with transparency
        imgd.data[i  ] = 255
        imgd.data[i+1] = 255
        imgd.data[i+2] = 255
        imgd.data[i+3] = lvl
      }
      hlCtx.putImageData(imgd, 0, 0)
      
      
      // Add dots (highlight)
      hlCtx.fillStyle = "#FFFFFFBB";
      filteredData.forEach((d) => {
          hlCtx.beginPath();
          hlCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + .8, 0, 2 * Math.PI);
          hlCtx.fill();
        });
    }

    // Order nodes for labels
    orderedNodes = filteredData.slice(0);
    orderedNodes.sort(function(a,b){return b.score - a.score})
    orderedNodes = orderedNodes.filter((d,i) => i<8 || (i<250 && d.score>=3))
    lCtx.strokeStyle = "#999785";
    lCtx.fillStyle = "#FFFFFF";
  } else {
    if (props.quickButUgly) {
      // No highlights: just show the dots
      // Add dots (highlight)
      hlCtx.fillStyle = "#6c655e";
      data.forEach((d) => {
        hlCtx.fillRect(x(d.x), y(d.y), 2 * (sizeRatio * d.size + 0.5), 2 * (sizeRatio * d.size + 0.5));
      });
    } else {
      // No highlights: just show the dots
      // Add dots (highlight)
      hlCtx.fillStyle = "#6c655e";
      data.forEach((d) => {
        hlCtx.beginPath();
        hlCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + 0.5, 0, 2 * Math.PI);
        hlCtx.fill();
      });
    }

    // Order nodes for labels
    orderedNodes = data.slice(0);
    lCtx.strokeStyle = "#999785";
    lCtx.fillStyle = "#000000";
  }

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

  orderedNodes.forEach((d,i)=>{
    d.order = i
  })

  // Display labels
  const yOffset = 8;
  if (props.showLabels) {

    const fontSize = 12;
    const boxMargin = 6;
    const labelsToConsider = props.quickButUgly?150:10000;
    lCtx.font = fontSize + 'px "Nunito", sans-serif';
    lCtx.textAlign = "center";
    lCtx.lineWidth = 4;
    lCtx.lineJoin = "round";
    lCtx.lineCap = "round";
    // Bounding box context
    lbCtx.fillStyle = "#FFFFFF";
    const skip = 5; // Speed up (precision loss though)
    let cap = 100; // How many labels fit in screen
    orderedNodes
      .filter((d, i) => i < labelsToConsider)
      .forEach((d,i) => {
        if (cap <= 0) {
          return;
        }
        const label = d.label;
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
          d.labelDisplayed = true
        } else {
          d.labelDisplayed = false
        }
      });
  }

  // Display message if no entities in the basemap
  if (props.highlights && props.focusedEntities.length == 0) {
    lCtx.textAlign = "left";
    const message = "No entity to display"
    const msgX = 20
    const msgY = height + margin.top + margin.bottom - 20
    lCtx.fillText(message, msgX, msgY);
  }

  // Draw nodes in hidden canvas
  orderedNodes.sort(function (a, b) {
    if (!a.labelDisplayed) {
      if (!b.labelDisplayed) {
        return b.order-a.order;
      } else return -1;
    } else {
      if (!b.labelDisplayed) {
        return 1;
      } else return b.order-a.order;
    }
  })
  const halfsize = 10;
  orderedNodes.forEach((d) => {
    hiddenCtx.fillStyle = d.hiddenCol;
    hiddenCtx.fillRect(
      x(d.x) - halfsize,
      y(d.y) - halfsize,
      2 * halfsize,
      2 * halfsize
    );
  });


  // Bind mouse stuff
  d3.select(".aCanvas").on("click", function (e) {
    let mouseX = e.layerX || e.offsetX;
    let mouseY = e.layerY || e.offsety;
    let X = Math.round(sizing.x.invert(mouseX));
    let Y = Math.round(sizing.y.invert(mouseY));
    // TODO: remove me
    // window.polygon.push("[" + X + "," + Y + "]");
    // console.log(window.polygon.join(","));

    
    if (HoveredNode) {
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        if (props.query && props.query.length>0) {
          emit("query", props.query+' AND "'+HoveredNode.label.replace(/"/gi,'')+'"')
        } else {
          emit("query", '"'+HoveredNode.label.replace(/"/gi,'')+'"')
        }
      } else {
        emit("query", '"'+HoveredNode.label.replace(/"/gi,'')+'"')
      }
    }
    // Browse the entities nearby
    // Goal: pick the closest entity, only looking
    // at those highlighted (unless no highlight)
    // let closest = false
    // let closestDistance2 = Infinity
    // orderedNodes.forEach(d => {
    //   if (!props.highlights || d.score > 0) {
    //     let d2 = Math.pow(X-d.x, 2) + Math.pow(Y-d.y, 2)
    //     if (d2 < closestDistance2) {
    //       closest = d
    //       closestDistance2 = d2
    //     }
    //   }
    // })
    // let d = Math.sqrt(closestDistance2)
    // emit("query", '"'+closest.label.replace(/"/gi,'')+'"')

  });

  const Tooltip = d3.select("#basemap-tooltip");
  const TopCanvas = d3.select("#basemap-container canvas.aCanvas")
  let HoveredNode

  // Three function that change the tooltip when user hover / move / leave a cell
  d3.select(".aCanvas").on("mousemove", function (e) {
    const mouseX = e.layerX || e.offsetX;
    const mouseY = e.layerY || e.offsety;
    const col = hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data;
    const colKey = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
    const d = colorToNode[colKey];
    if (d) {
      HoveredNode = d
      let html = d.label
      // if (d.score && d.score > 0) {
      //   html += "<br>Appears in " + d.score + " filtered document"+((d.score==1)?(''):('s'))
      // }
      Tooltip.html(html)
        .style("left", d3.pointer(e)[0] + 20 + "px")
        .style("top", d3.pointer(e)[1] + "px")
        .style("opacity", 1)
      TopCanvas.style("cursor", "pointer")
    } else {
      HoveredNode = false
      Tooltip.style("opacity", 0);
      TopCanvas.style("cursor", "default")
    }
  })
  d3.select(".aCanvas").on("mouseleave", function (e) {
    HoveredNode = false
    Tooltip.style("opacity", 0)
    TopCanvas.style("cursor", "default")
  })

  // Cache
  const dataToCache = {
    hl: hlCtx.getImageData(0, 0, hlCtx.canvas.width, hlCtx.canvas.height),
    lb: lbCtx.getImageData(0, 0, lbCtx.canvas.width, lbCtx.canvas.height),
    l: lCtx.getImageData(0, 0, lCtx.canvas.width, lCtx.canvas.height),
    hidden: hiddenCtx.getImageData(0, 0, hiddenCtx.canvas.width, hiddenCtx.canvas.height)
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
  aCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

  let bgCtx = bgCanvas.node().getContext("2d");

  if (props.quickButUgly) {
    bgCtx.fillStyle = "#9ba7a9";
    bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);

    // Add dots background (squares)
    bgCtx.fillStyle = "#999785";
    data.forEach((d) => {
      let halfsize = sizeRatio * d.size + nodeMargin
      bgCtx.fillRect(
        x(d.x) - halfsize,
        y(d.y) - halfsize,
        2 * halfsize,
        2 * halfsize,
      )
    });

    // Add dots (squares)
    bgCtx.fillStyle = "#504132";
    data.forEach((d) => {
      let halfsize = sizeRatio * d.size
      bgCtx.fillRect(
        x(d.x) - halfsize,
        y(d.y) - halfsize,
        2 * halfsize,
        2 * halfsize,
      )
    });
  } else {
    // Heat map
    bgCtx.fillStyle = "#000000";
    bgCtx.fillRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);
    bgCtx.fillStyle = "rgba(255,255,255)";
    data.forEach((d) => {
      bgCtx.beginPath();
      bgCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + sizeRatio * appSettings.heatmapSpread, 0, 2 * Math.PI);
      bgCtx.fill();
    });
    StackBlur.canvasRGB(
      bgCtx.canvas,
      0,
      0,
      bgCtx.canvas.width,
      bgCtx.canvas.height,
      bgCtx.canvas.width / 32
    );

    // Compute hillshading from there
    const hsData = computeHillshading(bgCtx.getImageData(0, 0, bgCtx.canvas.width, bgCtx.canvas.height))

    // Color
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
    bgCtx.fillStyle = "#504132";
    data.forEach((d) => {
      bgCtx.beginPath();
      bgCtx.arc(x(d.x), y(d.y), sizeRatio * d.size + 0.5, 0, 2 * Math.PI);
      bgCtx.fill();
    });

    // Blur!
    StackBlur.canvasRGB(
      bgCtx.canvas,
      0,
      0,
      bgCtx.canvas.width,
      bgCtx.canvas.height,
      bgCtx.canvas.width / 64
    );

    // Apply hillshading
    const hillshadingDarkness = 0.2
    const lGradient = l => Math.pow(Math.max(0, .2+.8*Math.min(1, 1.4*l||0)), .6)
    let imgd = bgCtx.getImageData(0, 0, bgCtx.canvas.width, bgCtx.canvas.height)
    for (let I=0; I<imgd.data.length; I+=4) {
      const l = hsData[I/4]
      imgd.data[I  ] = Math.floor(imgd.data[I  ]*((1-hillshadingDarkness)+hillshadingDarkness*lGradient(l)))
      imgd.data[I+1] = Math.floor(imgd.data[I+1]*((1-hillshadingDarkness)+hillshadingDarkness*lGradient(l)))
      imgd.data[I+2] = Math.floor(imgd.data[I+2]*((1-hillshadingDarkness)+hillshadingDarkness*lGradient(l)))
    }
    bgCtx.putImageData(imgd, 0, 0)

    // Blur!
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
    aCtx.font = '16px "IBM Plex Serif", serif';
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

function computeHillshading(imgd) {
  let options = {}
  options.elevation_strength = 0.0012
  options.hillshading_sun_azimuth = Math.PI * 0.6 // angle in radians
  options.hillshading_sun_elevation = Math.PI * 0.3 // angle in radians

  const width = imgd.width
  const height = imgd.height
  let lPixelMap = new Float64Array((width+1) * (height+1))
  
  // Hillshading formulas from https://observablehq.com/@sahilchinoy/hillshader
  const getSlope = (dzdx, dzdy, z=.2) => Math.atan(z * Math.sqrt(dzdx ** 2 + dzdy ** 2)); // the z factor controls how exaggerated the peaks look
  const getAspect = (dzdx, dzdy) => { return Math.atan2(-dzdy, -dzdx); }
  const getReflectance = function(aspect, slope, sunAzimuth, sunElevation) {
    return Math.cos(Math.PI - aspect - sunAzimuth) * Math.sin(slope) * Math.sin(Math.PI * .5 - sunElevation) + 
      Math.cos(slope) * Math.cos(Math.PI * .5 - sunElevation);
  }
  for (let I=0; I<imgd.data.length; I+=4) {
    // We search the indexes of pixels on the left, right, top and bottom.
    // If on border, we use the central pixel instead.
    const h = imgd.data[I]
    const i = I/4
    const x = i%(width+1)
    const y = (i-x)/(width+1)
    const i_left = (i%(width+1) == 0) ? (i) : (i-1)
    const i_right = (i%(width+1) == (width+1) - 1) ? (i) : (i+1)
    const i_top = (i < (width+1)) ? (i) : (i - (width+1))
    const i_bottom = (i > (width+1) * ((height+1) - 1)) ? (i) : (i + (width+1))
    const hleft = imgd.data[4*i_left]
    const hright = imgd.data[4*i_right]
    const htop = imgd.data[4*i_top]
    const hbottom = imgd.data[4*i_bottom]
    const dx = hleft - hright
    const dy = htop - hbottom
    const slope = getSlope(dx, dy, options.elevation_strength * Math.sqrt(width * height))
    const aspect = getAspect(dx, dy)
    const L = getReflectance(aspect, slope, options.hillshading_sun_azimuth, options.hillshading_sun_elevation)
    lPixelMap[i] = L
  }
  return lPixelMap
}
</script>

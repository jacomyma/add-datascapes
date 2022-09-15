// SETTINGS: CHANGE ME
export default {
  title: "Poney (change this title)", // The name displayed on top of the datascape
  helpPage: "help",                   // The route to the help page
  basemap: "data/Sample basemap.csv", // Edit to match the namr of your basemap file

  // ElasticSearch configuration
  esURL: "xxxxxx",                    // The URL to connect to ElasticSearch
  esUsername: "xxxxxx",               // The username to connect to the index
  esPassword: "XXXXXX",               // The password to connect to the index
  esIndex: "infomedia",               // The name of the ElasticSearch index where the documents are stored
  esTextField: "text",                // Field name for the document text
  esEntitiesField: "entities",        // Field name for the words, expressions or named entities
  esTitleField: "heading",            // Field name for the document title
  esSourceField: "sourcename",        // Field name for the source title (ex: journal)
  esDateField: "publishdate",         // Field name for the document date

  // Graphical settings
  heatmapSpread: 2,         // Higher means larger hill shades
  basemapNodeSizeRatio: 1,  // Higher means bigger nodes
  basemapLabels: [          // Add labels to the basemap (same coordinates as the nodes)
    { x: -473, y: 1036, anchor: "right", label: "Danish politics" },
    { x: -321, y: 1170, anchor: "center", label: "The Chinese dilemma" },
  ],
  basemapLabelsLines: [     // Add lines to the basemap (same coordinates as the nodes)
    [
      // The Chinese dilemma
      [-121, 846],
      [-321, 1130],
    ],
  ],
  basemapPolygons: [        // Add polygons to the basemap (same coordinates as the nodes)
    [
      // The Chinese dilemma
      [-62, 870],
      [31, 815],
      [78, 725],
      [94, 604],
      [55, 511],
      [-39, 491],
      [-70, 608],
      [-78, 718],
      [-133, 796],
      [-121, 846],
      [-62, 870],
    ],
    [
      // Danish politics
      [-86, 339],
      [-43, 366],
      [-51, 452],
      [-109, 597],
      [-117, 714],
      [-215, 835],
      [-308, 948],
      [-457, 998],
      [-667, 987],
      [-812, 827],
      [-831, 616],
      [-741, 515],
      [-605, 441],
      [-523, 378],
      [-386, 316],
      [-277, 304],
      [-168, 312],
      [-86, 339],
    ],
  ],
};
# Datascape template

## Config

Before you work with the project (dev or build), you need to configure it with data that is not part of this repository.

### 1. Choose a name for your datascape.
This allows you deploy different datascapes in parallel. For the sake of the example, I arbitrary pick the name ```poney```.

### 2. Edit the ```vite.config.js``` file to assign the name you've chosen to the ```base``` variable:

```js
const base = '/poney/';
```

### 3. Upload the basemap file in the folder ```public/data/```.

A default file named ```Sample basemap.csv``` is already present, copy its structure. This file contains the coordinates of the nodes visualized as the basemap (words, ngrams and/or named entities). The structure is as follows:

```csv
Id,label,x,y,size,showlabel
A Brief History of Time,A Brief History of Time,189.89796,-341.16403,1.2530332,false
```

* ```Id``` must match the identifier of the expression in the ElasticSearch engine;
* ```label``` is the expression displayed in the basemap;
* ```x,y``` are the coordinates in the basemap (obtained from Gephi);
* ```size``` is the radius of the dot (obtained from Gephi);
* ```showlabel``` is set to false for the words or expressions that are less important to display.

### 4. Edit the settings in the file ```src/plugins/settings.js```.

This is where you set up the connection with the ElasticSearch engine you need to have set up beforehand. That is also where you may add annotations to the basemap, and tune things like the datascape title.

The polygons and labels are just annotations, and they are entirely optional. Leave each list empty if you do not want them.

```js
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
```

### 5. (optional) change the Help page.

The default help may not correspond to your datascape. You have two solutions.

**Solution 1.** Just edit the help page from its template. The file is ```src/views/Help.vue```.

**Solution 2.** Create a new page in the same folder, for exemple ```src/views/MyBetterHelp.vue```, and edit the routing and the settings to refer to that page.

The routing is set up in the file ```src/router/index.js``` and you have to add a section like this one:
```js
{
  path: "/myBetterHelp",
  name: "myBetterHelp",
  component: () => import("../views/MyBetterHelp.vue"),
},
```

Then in the settings (see step 4 just above) the line about help should reflect the route:
```js
export default {
	// ...
  helpPage: "myBetterHelp",	// The route to the help page
  // ...
}
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

Your project is intended to be deployed in a directory of the chosen name (ex: ```poney```).
In your production environment, you need to create a ```.htaccess``` file with the following lines (*replace "poney" with the name you have chosen*):

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /poney
    RewriteRule ^poney/index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /poney/index.html [L]
</IfModule>
```

This file needs to go at the root of the folder named ```poney``` or whatever name you have chosen.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

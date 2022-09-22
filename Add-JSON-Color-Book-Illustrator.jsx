var doc = app.activeDocument;
var swatchgroup;
var isSpot = false;
var colorspace;

function init() {
  var file = File.openDialog(["Pick a JSON Color Book", "", false]);
  if (file) {
    var content = readJSONFile(file);
    if (content.records) {
      try {
        swatchgroup = doc.swatchGroups.getByName(content.title);
      } catch (e) {
        swatchgroup = doc.swatchGroups.add();
        swatchgroup.name = content.title;
      }
      isSpot = content.isSpot;
      colorspace = content.colorSpace;
      createSwatches(content.records);
    }
  }
}

function readJSONFile(file) {
  var file = File(file);
  file.open("r");
  var content = file.read();
  file.close();
  // Can't JSON.parse(content) in ExtendScript
  // Workaround from https://gist.github.com/chulman444/de5982c0c9735ca15d067548482a05e4
  content = eval("(" + content + ")");
  return content;
}

function createSwatches(records) {
  for (var i = 0; i < records.length; i++) {
    var swatch = records[i];
    var name = records[i].name;
    var components = records[i].components;
    addSwatch(name, components);
  }
}

function addSwatch(name, components) {
  if (!checkSwatch(name)) {
    if (colorspace === "RGB") {
      var color = new LabColor();
      color.r = components[0];
      color.g = components[1];
      color.b = components[2];
    }
    if (colorspace === "LAB") {
      var color = new LabColor();
      color.l = components[0];
      color.a = components[1];
      color.b = components[2];
    }
    if (colorspace === "CMYK") {
      var color = new CMYKColor();
      color.cyan = components[0];
      color.magenta = components[1];
      color.yellow = components[2];
      color.black = components[3];
    }

    var newSpot = doc.spots.add();
    newSpot.name = name;
    if (isSpot) {
      newSpot.colorType = ColorModel.SPOT;
      newSpot.spotKind = SpotColorKind.SPOTLAB;
    }
    newSpot.color = color;

    var newSpotColor = new SpotColor();
    newSpotColor.spot = newSpot;
    swatchgroup.addSpot(newSpot);
  }
}

function checkSwatch(name) {
  try {
    var check = doc.spots.getByName(name);
  } catch (e) {
    return false;
  }
  if (check.name) {
    return true;
  }
  return false;
}

init();

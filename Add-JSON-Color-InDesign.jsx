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
        doc.colorGroups.itemByName(content.title).id;
      } catch (e) {
        doc.colorGroups.add(content.title);
        swatchgroup = content.title;
      }
      isSpot = content.isSpot;
      if (content.colorSpace==="LAB") {
        colorspace = ColorSpace.LAB;
      } else if (content.colorSpace==="CMYK") {
        colorspace = ColorSpace.CMYK;
      } else if (content.colorSpace==="RGB") {
        colorspace = ColorSpace.RGB;
      } 
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
    if (isSpot) {
      var model = ColorModel.SPOT;
    } else {
      model = ColorModel.PROCESS;
    }
    var color = doc.colors.add({
      name: name,
      space: colorspace,
      model: model,
      colorValue: components,
    });
    doc.colorGroups.itemByName(swatchgroup).colorGroupSwatches.add(color);
  }
}

function checkSwatch(name) {
  var check = doc.colors.itemByName(name);
  try {
    check.name;
  } catch (e) {
    return false;
  }
  return true;
}

init();

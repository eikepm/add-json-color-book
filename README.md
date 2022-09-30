## Add JSON Color Books

An ExtendScript for adding JSON Color Books to the swatches panel in both Illustrator and InDesign. A JSON Color Book is a converted Adobe Color Book `.acb` file.

## Converting
For converting Adobe Color Book `.acb` files into JSON Color Book files you need my fork of Rong Shen's (jacobbubu) `acb repository` (CoffeeScript) at https://github.com/eikepm/convert-acb-to-json

## Usage
The script will open a file dialog for loading a converted `.json` Color Book. Adding the swatches to your panel might take a while depending on the size of the color book. All the new swatches will be added to it's own group folder. The name of this folder is taken from the JSON file.

## Warning
This script can potentially slow down Illustrator or Indesign when opening large color books. It even might become fully unresponsive. In this case, don't worry it's still running the script and at some point it will be done.

```
Save your work before you execute this script and use at your own risk!
```

As a reference: I opened a Color Book with 2k+ colors in Illustrator on a MacBook Pro which took about 3 ~ 4 minutes to finish (during this period Illustrator was unresponsive). Small Color Books load pretty fast.

## Notes
Supported color spaces: RGB, CMYK and LAB.

## To Do
Error handling regarding loading wrong file-type or improper converted JSON file.

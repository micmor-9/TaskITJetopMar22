const fs = require("fs");
const { resourceUsage } = require("process");
const inputFolder = "./input";
const outputFolder = "./output";
let inputFiles = [];
let result = {};
let searchResult = {};

fs.readdirSync(inputFolder).forEach((file) => {
  inputFiles.push(file);
});

if(fs.access(outputFolder, fs.constants.F_OK, (err) => {
  if(err) {
    fs.mkdir(outputFolder, {}, (err) => {
      console.error(err);
    });
  }
}));

console.log(inputFiles);

inputFiles.forEach((file) => {
  const path = inputFolder + '/' + file;
  fs.readFile(path, (err, data) => {
    if(err) {
      console.error(err);
      return;
    }
    data = JSON.parse(data);
    console.log(JSON.stringify(data));
    
    //Recursive function to navigate json and remove fields

    console.log('\nResult: ');
    console.log(JSON.stringify(result));
  });
});
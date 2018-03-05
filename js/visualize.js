var gridWidth = 10;
var gridHeight = 10;
var pixelWidth = 32;
var pixelHeight = 32;
var pixelColor = "black";
var rbm;

$(document).ready(function() {
  let trainingDataCanvas = new GridCanvas(document.getElementById("trainingDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, true);
  let testDataCanvas = new GridCanvas(document.getElementById("testDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, true);
  let reconstructedDataCanvas = new GridCanvas(document.getElementById("reconstructedDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, false);
  
  var trainingResetButton = document.getElementById("trainingResetButton");
  var addAndTrainButton = document.getElementById("addAndTrainButton");
  var testResetButton = document.getElementById("testResetButton");
  var reconstructButton = document.getElementById("reconstructButton");
  var startDaydreamButton = document.getElementById("startDaydreamButton");
  var stopDaydreamButton = document.getElementById("stopDaydreamButton");
  
  createRbm();
  
  trainingResetButton.addEventListener('click', function() {
    trainingDataCanvas.clearAllPixels();
  });
  
  addAndTrainButton.addEventListener('click', function() {
    var trainingData = [];
    trainingData.push(trainingDataCanvas.getImageAs1DArray());
    rbm = trainData(rbm, trainingData);
    
    var reconstructedData = reconstructData(rbm, trainingData);
    reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
    trainingDataCanvas.clearAllPixels();
  });
  
  testResetButton.addEventListener('click', function() {
    testDataCanvas.clearAllPixels();
  });
  
  reconstructButton.addEventListener('click', function() {
    var trainingData = [];
    trainingData.push(testDataCanvas.getImageAs1DArray());
    
    var reconstructedData = reconstructData(rbm, trainingData);
    reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
  });
  
  startDaydreamButton.addEventListener('click', function() {
    if (reconstructedDataCanvas.daydream === 0) {
      reconstructedDataCanvas.daydream = setInterval(function() {
        var trainingData = [];
        trainingData.push(testDataCanvas.getImageAs1DArray());
        
        var reconstructedData = reconstructData(rbm, trainingData);
        reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
      }, 1000);
    }
  });
  
  stopDaydreamButton.addEventListener('click', function() {
    clearInterval(reconstructedDataCanvas.daydream);
    reconstructedDataCanvas.daydream = 0;
  });
  
  function createRbm() {
    rbm = new RBM({
      n_visible : gridWidth * gridHeight,
      n_hidden : 10
    });
    
    rbm.set('log level', 0);
  }
  
  function trainData(rbm, trainingData) {
    rbm.train({
      lr: 0.6,
      k: 1,
      epochs: 1,
      input: trainingData
    });

    return rbm
  }

  function reconstructData(trainedRbm, testData) {
    return trainedRbm.reconstruct(testData);
  }
});

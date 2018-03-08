var gridWidth = 5;
var gridHeight = 5;
var pixelWidth = 32;
var pixelHeight = 32;
var pixelColor = "black";
var rbm;

var mnistGridWidth = 28;
var mnistGridHeight = 28;
var mnistPixelWidth = 12;
var mnistPixelHeight = 12;
//var mnistDataFilePath = "mnistdigittrainingdata/train-images.idx3-ubyte";
var mnistDigitWeightsFilePath = "mnistdigittrainingdata/mnistDigitWeights3.json";
var mnistDigitsRbm;

document.addEventListener('DOMContentLoaded', function() {
  let trainingDataCanvas = new GridCanvas(document.getElementById("trainingDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, true);
  let testDataCanvas = new GridCanvas(document.getElementById("testDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, true);
  let reconstructedDataCanvas = new GridCanvas(document.getElementById("reconstructedDataCanvas"), gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, false);
  let mnistTestDataCanvas = new GridCanvas(document.getElementById("mnistTestDataCanvas"), mnistGridWidth, mnistGridHeight, mnistPixelWidth, mnistPixelHeight, pixelColor, true);
  let mnistReconstructedDataCanvas = new GridCanvas(document.getElementById("mnistReconstructedDataCanvas"), mnistGridWidth, mnistGridHeight, mnistPixelWidth, mnistPixelHeight, pixelColor, false);
  
  
  var trainingResetButton = document.getElementById("trainingResetButton");
  var addAndTrainButton = document.getElementById("addAndTrainButton");
  var testResetButton = document.getElementById("testResetButton");
  var reconstructButton = document.getElementById("reconstructButton");
  var startDaydreamButton = document.getElementById("startDaydreamButton");
  var stopDaydreamButton = document.getElementById("stopDaydreamButton");
  
  var mnistTestResetButton = document.getElementById("mnistTestResetButton");
  var mnistReconstructButton = document.getElementById("mnistReconstructButton");
  var mnistStartDaydreamButton = document.getElementById("mnistStartDaydreamButton");
  var mnistStopDaydreamButton = document.getElementById("mnistStopDaydreamButton");
  
  createRbm();
  createMnistDigitRbm();
  
  trainingResetButton.addEventListener('click', function() {
    trainingDataCanvas.clearAllPixels();
  });
  
  addAndTrainButton.addEventListener('click', function() {
    var trainingData = [];
    trainingData.push(trainingDataCanvas.getImageAs1DArray());
    rbm = trainData(rbm, trainingData, 1);
    
    var reconstructedData = reconstructData(rbm, trainingData);
    reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
    trainingDataCanvas.clearAllPixels();
  });
  
  testResetButton.addEventListener('click', function() {
    testDataCanvas.clearAllPixels();
  });
  
  reconstructButton.addEventListener('click', function() {
    var testData = [];
    testData.push(testDataCanvas.getImageAs1DArray());
    
    var reconstructedData = reconstructData(rbm, testData);
    reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
  });
  
  startDaydreamButton.addEventListener('click', function() {
    if (reconstructedDataCanvas.daydream === 0) {
      reconstructedDataCanvas.daydream = setInterval(function() {
        var testData = [];
        testData.push(testDataCanvas.getImageAs1DArray());

        var reconstructedData = reconstructData(rbm, testData);
        reconstructedDataCanvas.display1DArrayAsImage(probToBinaryMat(reconstructedData)[0]);
      }, 1000);
    }
  });
  
  stopDaydreamButton.addEventListener('click', function() {
    clearInterval(reconstructedDataCanvas.daydream);
    reconstructedDataCanvas.daydream = 0;
  });
  
  
  mnistTestResetButton.addEventListener('click', function() {
    mnistTestDataCanvas.clearAllPixels();
  });
  
  mnistReconstructButton.addEventListener('click', function() {
    var testData = [];
    testData.push(displayToMnist(mnistTestDataCanvas.getImageAs1DArray(), mnistGridWidth, mnistGridHeight));
    
    var reconstructedData = reconstructData(mnistDigitsRbm, testData);
    mnistReconstructedDataCanvas.display1DArrayAsImage(mnistToDisplay(probToBinaryMat(reconstructedData)[0], mnistGridWidth, mnistGridHeight));
  });
  
  mnistStartDaydreamButton.addEventListener('click', function() {
    if (mnistReconstructedDataCanvas.daydream === 0) {
      mnistReconstructedDataCanvas.daydream = setInterval(function() {
        var testData = [];
        testData.push(displayToMnist(mnistTestDataCanvas.getImageAs1DArray(), mnistGridWidth, mnistGridHeight));
        
        var reconstructedData = reconstructData(mnistDigitsRbm, testData);
        mnistReconstructedDataCanvas.display1DArrayAsImage(mnistToDisplay(probToBinaryMat(reconstructedData)[0], mnistGridWidth, mnistGridHeight));
      }, 1000);
    }
  });
  
  mnistStopDaydreamButton.addEventListener('click', function() {
    clearInterval(mnistReconstructedDataCanvas.daydream);
    mnistReconstructedDataCanvas.daydream = 0;
  });
  
  function createRbm() {
    rbm = new RBM({
      n_visible : gridWidth * gridHeight,
      n_hidden : 10
    });
    
    rbm.set('log level', 0);
  }
  
  function createMnistDigitRbm() {
    mnistDigitsRbm = new RBM({
      n_visible : mnistGridWidth * mnistGridHeight,
      n_hidden : 100,
      W : weights
    });
  }
  
  function trainData(rbm, trainingData, numEpochs) {
    rbm.train({
      lr: 0.6,
      k: 1,
      epochs: numEpochs,
      input: trainingData
    });

    return rbm
  }

  function reconstructData(trainedRbm, testData) {
    return trainedRbm.reconstruct(testData);
  }
  
  function mnistToDisplay(imageData, width, height) {
    // mnist digit dataset has the images flipped (mirrored) and rotated 90 degrees anti-clockwise
    // so we need to flip and rotate them back to display.
    // we should re-train the model and convert the images before input them as training data.
    var imageDataAfterFlip = flipVertical(imageData, width, height);
    return rotate90Clockwise(imageDataAfterFlip, width, height);    
  }
  
  function displayToMnist(imageData, width, height) {
    var imageDataAfterRotate = imageData;
    for (var i = 0; i < 3; i++) {
      imageDataAfterRotate = rotate90Clockwise(imageDataAfterRotate, width, height);
    }
    return flipVertical(imageDataAfterRotate, width, height);
  }
  
  function flipVertical(imageData, width, height) {
    var imageDataAfterFlip = new Array(width * height).fill(0);
    
    for (var pixel = 0; pixel < imageData.length; pixel++) {
      if (imageData[pixel] === 1) {
        var x = pixel % width;
        var y = Math.floor(pixel / width);
        
        y = height - y - 1;
        
        imageDataAfterFlip[y * width + x] = 1;
      }
    }
    
    return imageDataAfterFlip
  }
  
  function rotate90Clockwise(imageData, width, height) {
    var imageDataAfterRotate = new Array(width * height).fill(0);
    
    for (var pixel = 0; pixel < imageData.length; pixel++) {
      if (imageData[pixel] === 1) {
        var x = pixel % width;
        var y = Math.floor(pixel / width);
        
        imageDataAfterRotate[x * width + height - y - 1] = 1;
      }
    }
    
    return imageDataAfterRotate;
  }  
});

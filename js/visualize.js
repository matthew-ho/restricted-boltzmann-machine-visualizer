$(document).ready(function() {
  var trainingData = [[1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0]];
  $("#trainingData").html(trainingData);

  var rbm = new RBM({
      input : trainingData,
      n_visible : 16,
      n_hidden : 16
  });

  rbm.set('log level', 0);

  rbm.train({
      lr : 0.6,
      k : 1,
      epochs : 1
  });

  var testData = [[1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0]];
  $("#testData").html(testData);
  $("#result").html(rbm.reconstruct(testData));
  $("#hLayerProbs").html(rbm.sampleHgivenV(testData)[0]);
});

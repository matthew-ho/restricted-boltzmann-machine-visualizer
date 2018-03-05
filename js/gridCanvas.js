class GridCanvas {
  constructor(canvas, gridWidth, gridHeight, pixelWidth, pixelHeight, pixelColor, isDrawable) {
    this.canvas = canvas;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.canvas.width = gridWidth * pixelWidth;
    this.canvas.height = gridHeight * pixelHeight;
    this.ctx = this.canvas.getContext("2d");
    
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.pixelColor = pixelColor;
    
    this.mouse = {};
    this.mark;
    
    this.drawPos = [];
    
    window.requestAnimationFrame(this.render.bind(this));

    if (isDrawable) {
      this.canvas.addEventListener("mousemove", this.recordMouseMovement.bind(this));
      this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
      document.body.addEventListener("mouseup", this.stopDrawing.bind(this));
      this.canvas.addEventListener("contextmenu", this.clearPixel.bind(this));
    }
  }
  
  getImageAs1DArray() {
    var numPixels = (this.canvas.width / this.pixelWidth) * (this.canvas.height / this.pixelHeight);
    var imageData = new Array(numPixels).fill(0);
    
    for (var i = 0; i < this.drawPos.length; i++) {
      imageData[(this.drawPos[i].x / this.pixelWidth) + (this.drawPos[i].y / this.pixelHeight) * (this.canvas.width / this.pixelWidth)] = 1;
    }
    
    return imageData;
  }
  
  display1DArrayAsImage(reconstructedData) {
    var newDrawPos = []
    for (var i = 0; i < reconstructedData.length; i++) {
      if (reconstructedData[i] > 0.5) {
        newDrawPos.push({
          x : (i % this.gridWidth) * this.pixelWidth,
          y : Math.floor(i / this.gridWidth) * this.pixelHeight,
          color : "black"
        });
      }
    }
    
    this.drawPos = newDrawPos;
  }
  
  drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(150, 150, 150, 0.75)";
    for (var x = 0; x <= this.canvas.width; x += this.pixelWidth) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }
    for (var y = 0; y <= this.canvas.height; y += this.pixelHeight) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawImage(pos) {
    for (var p = 0; p < pos.length; p++) {
      this.ctx.fillStyle = pos[p].color || this.pixelColor;
      this.ctx.fillRect(pos[p].x, pos[p].y, this.pixelWidth, this.pixelHeight);
    }
  }

  render() {
    this.clearCanvas();
    this.drawGrid();
    this.drawImage(this.drawPos);
    window.requestAnimationFrame(this.render.bind(this));
  }
  
  getMousePos(event) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: (Math.round((event.clientX - rect.left - (this.pixelWidth  / 2)) / this.pixelWidth)  * this.pixelWidth),
      y: (Math.round((event.clientY - rect.top  - (this.pixelHeight / 2)) / this.pixelHeight) * this.pixelHeight)
    };
  }

  recordMouseMovement(event) {
    this.mouse = this.getMousePos(event);
  }

  startDrawing(event) {
    if(event.button == 0) {
      this.mark = setInterval((function() {
        var pos = this.mouse;
        if (this.drawPos.length > 1 && this.drawPos.slice(-1)[0].x == pos.x && this.drawPos.slice(-1)[0].y == pos.y) {
        } else {
          pos['color'] = this.pixelColor;
          this.drawPos.push(pos);
        }
      }).bind(this), 10);
    }
  }

  stopDrawing(event) {
    clearInterval(this.mark);
    this.mark = 0;
  }

  clearPixel(event) {
    event.preventDefault();
    var savedPos = this.drawPos.filter((function(savedPos) { 
      return !(savedPos.x == this.mouse.x && savedPos.y == this.mouse.y); 
    }).bind(this));
    this.drawPos = savedPos;
    return false;
  }

  clearAllPixels() {
    this.drawPos = [];
  }
}
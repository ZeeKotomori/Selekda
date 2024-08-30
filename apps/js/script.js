document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const layerList = document.getElementById('layerList');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const brushTool = document.getElementById('brushTool');
    const eraserTool = document.getElementById('eraserTool');
    const moveTool = document.getElementById('moveTool');
    const shapeTool = document.getElementById('shapeTool');
    const textTool = document.getElementById('textTool');
    const cloneStampTool = document.getElementById('cloneStampTool');
    const colorPickerTool = document.getElementById('colorPickerTool');
    const paintBucketTool = document.getElementById('paintBucketTool');
    const importTool = document.getElementById('importTool');
    const exportTool = document.getElementById('exportTool');
    const layerOpacity = document.getElementById('layerOpacity');
    const layerBrightness = document.getElementById('layerBrightness');
    const layerSaturation = document.getElementById('layerSaturation');
    const layerGreyscale = document.getElementById('layerGreyscale');
    const selectionTool = document.getElementById('selectionTool');
  
    // State variables
    let isDrawing = false;
    let tool = 'brush';
    let brushSettings = { size: 5, shape: 'round', opacity: 1 };
    let history = [];
    let historyStep = -1;
    let zoomLevel = 100;
    let selectedLayer = null;
    let layers = [];
    let selectedArea = null;
    let cloneStampSource = null;
  
    // Initialize the app: fade out welcome screen
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
    }, 1000);
  
    // General utility functions
    function saveState() {
      if (historyStep < 4) {
        history.push(canvas.toDataURL());
        historyStep++;
      } else {
        history.shift();
        history.push(canvas.toDataURL());
      }
    }
  
    function restoreState(step) {
      const img = new Image();
      img.src = history[step];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  
    function zoomCanvas() {
      canvas.style.transform = `scale(${zoomLevel / 100})`;
      document.getElementById('zoomLevel').textContent = `${zoomLevel}%`;
    }
  
    function addLayer(name) {
      const layer = {
        name,
        opacity: 1,
        brightness: 1,
        saturation: 1,
        greyscale: 0,
        visible: true,
      };
      layers.push(layer);
      renderLayers();
    }
  
    function renderLayers() {
      layerList.innerHTML = '';
      layers.forEach((layer, index) => {
        const layerItem = document.createElement('li');
        layerItem.textContent = layer.name;
        layerItem.style.opacity = layer.opacity;
        layerItem.style.filter = `brightness(${layer.brightness}) 
          saturate(${layer.saturation}) 
          grayscale(${layer.greyscale})`;
        layerItem.classList.add(layer.visible ? 'visible' : 'hidden');
        layerItem.addEventListener('click', () => selectLayer(index));
        layerList.appendChild(layerItem);
      });
    }
  
    function selectLayer(index) {
      selectedLayer = index;
      // Highlight selected layer
      document.querySelectorAll('#layerList li').forEach((li, i) => {
        li.classList.toggle('selected', i === index);
      });
    }
  
    // Brush tool functionality
    function setBrushTool() {
      tool = 'brush';
      canvas.style.cursor = 'crosshair';
    }
  
    function draw(e) {
      if (!isDrawing) return;
      ctx.lineWidth = brushSettings.size;
      ctx.lineCap = brushSettings.shape === 'round' ? 'round' : 'square';
      ctx.strokeStyle = `rgba(0, 0, 0, ${brushSettings.opacity})`;
  
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  
    // Eraser tool functionality
    function setEraserTool() {
      tool = 'eraser';
      canvas.style.cursor = 'crosshair';
    }
  
    function erase(e) {
      if (!isDrawing) return;
      ctx.clearRect(e.offsetX, e.offsetY, brushSettings.size, brushSettings.size);
    }
  
    // Move tool functionality
    function setMoveTool() {
      tool = 'move';
      canvas.style.cursor = 'move';
    }
  
    function moveCanvas(e) {
      // Implement drag and move logic for layers
    }
  
    // Shape tool functionality
    function setShapeTool() {
      tool = 'shape';
      canvas.style.cursor = 'crosshair';
    }
  
    function drawShape(e) {
      if (!isDrawing) return;
      ctx.fillStyle = 'black'; // Shape color
      ctx.beginPath();
      // Draw shapes based on user selection
      ctx.rect(e.offsetX, e.offsetY, 50, 50); // Example for a rectangle
      ctx.fill();
    }
  
    // Text tool functionality
    function setTextTool() {
      tool = 'text';
      canvas.style.cursor = 'text';
    }
  
    function drawText(e) {
      const text = prompt('Enter text:');
      if (text) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(text, e.offsetX, e.offsetY);
      }
    }
  
    // Clone stamp tool functionality
    function setCloneStampTool() {
      tool = 'clone';
      canvas.style.cursor = 'copy';
    }
  
    function startCloning(e) {
      if (e.altKey) {
        cloneStampSource = { x: e.offsetX, y: e.offsetY };
      }
    }
  
    function clone(e) {
      if (!cloneStampSource) return;
      ctx.drawImage(
        canvas,
        cloneStampSource.x - 25,
        cloneStampSource.y - 25,
        50,
        50,
        e.offsetX - 25,
        e.offsetY - 25,
        50,
        50
      );
    }
  
    // Paint bucket tool functionality
    function setPaintBucketTool() {
      tool = 'bucket';
      canvas.style.cursor = 'pointer';
    }
  
    function fillArea(e) {
      // Implement flood fill algorithm to fill adjacent pixels
    }
  
    // Color picker tool functionality
    function setColorPickerTool() {
      tool = 'colorPicker';
      canvas.style.cursor = 'pointer';
    }
  
    function pickColor(e) {
      const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
      const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      document.getElementById('selectedColor').style.backgroundColor = color;
    }
  
    // Selection tool functionality
    function setSelectionTool() {
      tool = 'selection';
      canvas.style.cursor = 'crosshair';
    }
  
    function selectArea(e) {
      if (!isDrawing) return;
      ctx.strokeStyle = 'red';
      ctx.setLineDash([6]);
      ctx.strokeRect(e.offsetX, e.offsetY, 100, 100);
      selectedArea = { x: e.offsetX, y: e.offsetY, width: 100, height: 100 };
    }
  
    function copySelection() {
      if (!selectedArea) return;
      // Copy selected area for further use
    }
  
    function pasteSelection() {
      // Paste copied selection on a new layer
    }
  
    // Undo/Redo functionality
    undoBtn.addEventListener('click', () => {
      if (historyStep > 0) {
        historyStep--;
        restoreState(historyStep);
        document.getElementById('undoCount').textContent = historyStep;
      }
    });
  
    redoBtn.addEventListener('click', () => {
      if (historyStep < history.length - 1) {
        historyStep++;
        restoreState(historyStep);
        document.getElementById('redoCount').textContent = historyStep;
      }
    });
  
    // Zoom functionality
    zoomInBtn.addEventListener('click', () => {
      zoomLevel = Math.min(200, zoomLevel + 10);
      zoomCanvas();
    });
  
    zoomOutBtn.addEventListener('click', () => {
      zoomLevel = Math.max(10, zoomLevel - 10);
      zoomCanvas();
    });
  
    // Toolbar tool selection
    brushTool.addEventListener('click', setBrushTool);
    eraserTool.addEventListener('click', setEraserTool);
    moveTool.addEventListener('click', setMoveTool);
    shapeTool.addEventListener('click', setShapeTool);
    textTool.addEventListener('click', setTextTool);
    cloneStampTool.addEventListener('click', setCloneStampTool);
    colorPickerTool.addEventListener('click', setColorPickerTool);
    paintBucketTool.addEventListener('click', setPaintBucketTool);
    selectionTool.addEventListener('click', setSelectionTool);
  
    // Import and Export functions
    importTool.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  
    exportTool.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'DSGN-export.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    });
  
    // Canvas event listeners for drawing tools
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      ctx.beginPath();
      switch (tool) {
        case 'brush':
          draw(e);
          break;
        case 'eraser':
          erase(e);
          break;
        case 'shape':
          drawShape(e);
          break;
        case 'text':
          drawText(e);
          break;
        case 'clone':
          startCloning(e);
          break;
        case 'selection':
          selectArea(e);
          break;
        default:
          break;
      }
      saveState();
    });
  
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      ctx.beginPath();
    });
  
    canvas.addEventListener('mousemove', (e) => {
      switch (tool) {
        case 'brush':
          draw(e);
          break;
        case 'eraser':
          erase(e);
          break;
        case 'clone':
          clone(e);
          break;
        default:
          break;
      }
    });
  });
  
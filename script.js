const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  if (!audioContext) {
    await setupMicrophone();
    startButton.textContent = "Stop Microphone";
    drawWaveform();
  } else {
    stopMicrophone();
    startButton.textContent = "Start Microphone";
    stopDrawing();
  }
});

let audioContext;
let analyser;
let microphone;
let animationId;

async function setupMicrophone() {
  // Prompt user for microphone permission
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Set up an "Audio Graph", check WebAudioAPI for further info:
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create input audio node
  microphone = audioContext.createMediaStreamSource(stream);
  // Create analyser audio node
  analyser = audioContext.createAnalyser();
  // Connect input node to analyser
  microphone.connect(analyser);
}

function drawWaveform() {
  // Get length of each audio buffer
  const bufferLength = analyser.frequencyBinCount;
  // Initialize an array for the amplitudes
  const dataArray = new Uint8Array(bufferLength);

  // Define function to be called recursively
  function draw() {
    // Get time domain data (amplitudes of the audio)
    analyser.getByteTimeDomainData(dataArray);

    // Fill canvas background
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Define line color and width
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#4CAF50";
    // Start defining the path to draw
    ctx.beginPath();

    // Split the amplitudes of one audio buffer among the available canvas pixels
    const sliceWidth = canvas.width / bufferLength;

    // Loop over canvas slices and draw individual amplitudes
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      // Normalize to 0-2
      const v = dataArray[i] / 128.0;
      // Normalize to +- canvas height / 2
      const y = (v * canvas.height) / 2;

      // Draw amplitude on canvas
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Next slice
      x += sliceWidth;
    }

    // Draw line to 0 at end of canvas
    ctx.lineTo(canvas.width, canvas.height / 2);
    // Draw defined line
    ctx.stroke();

    // call function recursively - animation loop
    animationId = requestAnimationFrame(draw);
  }

  // initial call of recursive animation loop
  animationId = requestAnimationFrame(draw);
}

// tear down microphone stream
function stopMicrophone() {
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

function stopDrawing() {}

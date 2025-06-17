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

function drawWaveform() {}

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

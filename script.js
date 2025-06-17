const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  await setupMicrophone();
  startButton.textContent = "Stop Microphone";
  drawWaveform();
});

async function setupMicrophone() {
  // Prompt user for microphone permission
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Set up an "Audio Graph", check WebAudioAPI for further info:
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create input audio node
  const microphone = audioContext.createMediaStreamSource(stream);
  // Create analyser audio node
  const analyser = audioContext.createAnalyser();
  // Connect input node to analyser
  microphone.connect(analyser);
}

function drawWaveform() {}

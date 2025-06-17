const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  setupMicrophone();
  startButton.textContent = "Stop Microphone";
  drawWaveform();
});

function setupMicrophone() {}

function drawWaveform() {}

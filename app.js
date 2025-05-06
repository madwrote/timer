// DOM elements
const timerDisplay = document.querySelector(".timer");
const timer = document.getElementById("timing");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const sound = document.getElementById("timer-sound");

// Images
const defaultImg = document.getElementById("defaultImg");
const startImg = document.getElementById("startImg");
const pauseImg = document.getElementById("pauseImg");

// Timer variables
let interval = null;
let isRunning = false;
let isPaused = false;
let remainingSeconds = 0;

// Utility: update display
function updateDisplay() {
  const hrs = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  timerDisplay.textContent =
    (hrs > 0 ? String(hrs).padStart(2, "0") + ":" : "") +
    String(mins).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0");
}

// Utility: get time from inputs
function getInputSeconds() {
  const hrs = parseInt(hoursInput.value) || 0;
  const mins = parseInt(minutesInput.value) || 0;
  const secs = parseInt(secondsInput.value) || 0;
  return hrs * 3600 + mins * 60 + secs;
}

// Image toggle
function showImage(img) {
  defaultImg.classList.add("hidden");
  startImg.classList.add("hidden");
  pauseImg.classList.add("hidden");
  img.classList.remove("hidden");
}

function wiggleTimer() {
  timer.classList.add("wiggle");

  // Timeout after 2 seconds
  setInterval(() => {
    timer.classList.remove("wiggle");
  }, 2000);
}

// Main countdown
function startTimer() {
  interval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(interval);
      wiggleTimer();
      interval = null;
      isRunning = false;
      startBtn.textContent = "Start";
      showImage(startImg);
      sound.play();
    }
  }, 1000);
}

// Toggle Start / Pause / Resume
function toggleTimerState() {
  if (!isRunning && !isPaused) {
    remainingSeconds = getInputSeconds();
    if (remainingSeconds <= 0) return;

    isRunning = true;
    isPaused = false;
    startBtn.textContent = "Pause";
    showImage(startImg);
    startTimer();
  } else if (isRunning && !isPaused) {
    isPaused = true;
    clearInterval(interval);
    interval = null;
    startBtn.textContent = "Resume";
    showImage(pauseImg);
  } else if (isPaused) {
    isPaused = false;
    startBtn.textContent = "Pause";
    showImage(startImg);
    startTimer();
  }
}

// Reset button
function resetTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  isPaused = false;
  startBtn.textContent = "Start";
  remainingSeconds = getInputSeconds();
  updateDisplay();
  showImage(defaultImg);
}

// Event listeners
startBtn.addEventListener("click", toggleTimerState);
resetBtn.addEventListener("click", resetTimer);
document.addEventListener("keydown", (e) => {
  if (!isRunning) {
    if (e.key === "Enter") {
      toggleTimerState();
    }
  }
});

// Update display immediately when inputs change
[hoursInput, minutesInput, secondsInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (!isRunning && !isPaused) {
      remainingSeconds = getInputSeconds();
      updateDisplay();
      startBtn.textContent = "Start";
      showImage(defaultImg);
    }
  });
});

// Initialize
remainingSeconds = getInputSeconds();
updateDisplay();
showImage(defaultImg);

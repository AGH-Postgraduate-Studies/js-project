document.addEventListener("DOMContentLoaded", () => {
  const buttonStart = document.querySelector("#buttonStart");
  const buttonStop = document.querySelector("#buttonStop");
  const gameArea = document.querySelector("#gameArea");
  const minTimeDisplay = document.querySelector("#minTime");
  const maxTimeDisplay = document.querySelector("#maxTime");
  const avgTimeDisplay = document.querySelector("#avgTime");
  const trialInput = document.querySelector("#trialCountInput");
  const bestTimeDisplay = document.querySelector("#bestTime");
  const gameScore = document.querySelector("#gameScore");

  let reactionTimes = [];
  let bestTime = Infinity;
  let startTime;
  let trialCount;
  let currentTrial = 0;
  let timeout;

  function inputValidation() {
    let value = parseInt(trialInput.value, 10);

    if (value < 1 || value > 100 || isNaN(value)) {
      alert("Please enter a number between 1 and 100.");
      trialInput.value = "";
      return false;
    }

    return true;
  }

  function startGame() {
    const isValid = inputValidation();

    if (!isValid) {
      return;
    }

    trialCount = parseInt(trialInput.value, 10) || 5;
    toggleGameButtons(true);
    gameArea.style.backgroundColor = "white";
    gameArea.style.cursor = "pointer";
    gameArea.textContent = "Wait...";
    gameScore.style.visibility = "hidden";

    resetGameState();
    nextTrial();
  }

  function stopGame() {
    clearTimeout(timeout);
    toggleGameButtons(false);

    if (reactionTimes.length > 0) {
      updateStats();
      gameArea.style.cursor = "default";
      gameArea.style.backgroundColor = "grey";
      gameArea.textContent = "Try again!";
      gameScore.style.visibility = "visible";
    }
  }

  function toggleGameButtons(isGameStarted) {
    trialInput.disabled = isGameStarted;
    buttonStart.disabled = isGameStarted;
    buttonStop.disabled = !isGameStarted;
  }

  function resetGameState() {
    reactionTimes.splice(0, reactionTimes.length);
    currentTrial = 0;
  }

  function nextTrial() {
    const time = Math.random() * 2000 + 1000;

    timeout = setTimeout(resetPlayground, time);
    gameArea.style.backgroundColor = "white";
    gameArea.textContent = "Wait...";
  }

  function resetPlayground() {
    gameArea.style.backgroundColor = `gray`;
    gameArea.textContent = "Click now!";
    startTime = new Date();
  }

  function recordReaction() {
    if (!startTime) return;
    if (reactionTimes.length === parseInt(trialInput.value, 10)) return;
    if (reactionTimes.length < parseInt(trialInput.value, 10)) {
      gameScore.style.visibility = "visible";
    }

    const endTime = new Date();
    const reactionTime = endTime - startTime;
    reactionTimes.push(reactionTime);

    if (reactionTime < bestTime) {
      bestTime = reactionTime;
      bestTimeDisplay.textContent = `${bestTime}ms`;
    }

    currentTrial++ < trialCount - 1 ? nextTrial() : stopGame();
  }

  function updateStats() {
    const minTime = Math.min(...reactionTimes);
    const maxTime = Math.max(...reactionTimes);
    const avgTime =
      reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;

    minTimeDisplay.textContent = `${minTime}ms`;
    maxTimeDisplay.textContent = `${maxTime}ms`;
    avgTimeDisplay.textContent = `${avgTime.toFixed(2)}ms`;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === " " && buttonStart.disabled) {
      recordReaction();
    } else if (event.key === "Escape") {
      stopGame();
    }
  });

  gameArea.addEventListener("click", recordReaction);
  buttonStart.addEventListener("click", startGame);
  buttonStop.addEventListener("click", stopGame);
});

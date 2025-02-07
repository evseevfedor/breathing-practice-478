/*
Copyright 2024 Bc. Fedor Evseev
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
*/
// ===== Получаем ссылки на нужные элементы =====
const circle = document.getElementById('breath-circle');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

// ===== Фазы дыхания (в секундах) =====
const phases = [
  { name: 'Вдох', duration: 4, maxSize: 250 }, // Вдох 4 сек - круг увеличивается
  { name: 'Задержка', duration: 7, maxSize: 250 }, // Задержка 7 сек - круг остаётся большим
  { name: 'Выдох', duration: 8, maxSize: 100 } // Выдох 8 сек - круг уменьшается
];

let totalTime = 0; // Общее время сессии
const MAX_TIME = 180; // Максимальное время практики (3 минуты)
let currentPhaseIndex = 0; // Индекс текущей фазы
let currentPhaseTime = 0; // Оставшееся время в текущей фазе
let intervalId = null; // ID интервала для setInterval
let isRunning = false; // Идёт ли анимация
let isPaused = false; // Находится ли на паузе

// ===== Инициализация фазы дыхания =====
function initPhase(phaseIndex) {
  const phase = phases[phaseIndex];
  currentPhaseTime = phase.duration;
  circle.style.transition = `width ${phase.duration}s ease-in-out, height ${phase.duration}s ease-in-out`;
  circle.style.width = phase.maxSize + 'px';
  circle.style.height = phase.maxSize + 'px';
  updateTimerDisplay(currentPhaseTime);
}

// ===== Обновление таймера =====
function updateTimerDisplay(seconds) {
  let mm = Math.floor(seconds / 60);
  let ss = seconds % 60;
  if (mm < 10) mm = '0' + mm;
  if (ss < 10) ss = '0' + ss;
  timerDisplay.textContent = `${mm}:${ss}`;
}

// ===== Старт дыхательной практики =====
function startBreathing() {
  if (isRunning || isPaused) stopBreathing(); // Если уже запущено, сбрасываем
  isRunning = true;
  isPaused = false;
  totalTime = 0;
  currentPhaseIndex = 0;
  initPhase(currentPhaseIndex);
  intervalId = setInterval(() => {
    if (!isPaused) {
      currentPhaseTime--;
      totalTime++;
      updateTimerDisplay(currentPhaseTime);
      if (currentPhaseTime <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        initPhase(currentPhaseIndex);
      }
      if (totalTime >= MAX_TIME) stopBreathing(); // Останавливаем по истечении 3 минут
    }
  }, 1000);
}

// ===== Пауза дыхательной практики =====
function pauseBreathing() {
  if (isRunning && !isPaused) {
    isPaused = true;
    playBtn.style.display = 'inline-block'; // Показываем кнопку "Play"
    pauseBtn.style.display = 'none'; // Скрываем "Pause"
  }
}

// ===== Возобновление дыхательной практики =====
function resumeBreathing() {
  if (isRunning && isPaused) {
    isPaused = false;
    playBtn.style.display = 'none'; // Скрываем "Play"
    pauseBtn.style.display = 'inline-block'; // Показываем "Pause"
  }
}

// ===== Полная остановка дыхательной практики =====
function stopBreathing() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  isPaused = false;
  currentPhaseIndex = 0;
  currentPhaseTime = 0;
  totalTime = 0;
  circle.style.transition = 'none';
  circle.style.width = '100px';
  circle.style.height = '100px';
  updateTimerDisplay(0);
  playBtn.style.display = 'none'; // Скрываем "Play"
  pauseBtn.style.display = 'inline-block'; // Показываем "Pause"
}

// ===== Назначаем обработчики событий кнопкам =====
startBtn.addEventListener('click', startBreathing);
pauseBtn.addEventListener('click', pauseBreathing);
playBtn.addEventListener('click', resumeBreathing);
stopBtn.addEventListener('click', stopBreathing);

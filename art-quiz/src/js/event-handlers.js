import {
  state, blitz, handlers, settings, game, render,
} from '../index';
import * as utils from './util';

let endGameTimer = '';
let shoAnswerTimer = '';

function resetBlitz() {
  blitz.currentImage = 0;
  blitz.currentTime = 0;
  blitz.correctAnswersCount = 0;
  blitz.timeForGame = 60;
}

function clearTimers(idArr) {
  idArr.forEach((id) => {
    clearInterval(id);
  });
}

function blitzGame() {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  state.scoreStorage[state.gameType][state.countOfBlitzGames].picSet = [];
  state.scoreStorage[state.gameType][state.countOfBlitzGames].answers = [];
  state.gameType = 'blitz';
  resetBlitz();
  handlers.setHandler('main blitz-view game-wrapper-main hide', 'header game-wrapper-header hide');

  endGameTimer = setInterval(() => {
    if (blitz.watchTime()) {
      render.drawFinishPopup();
      handlers.handlePopup();
      if (state.settings.audioEnabled) settings.playSound('.end-lose-sound');
      clearTimers([endGameTimer, game.timer, game.timerQuestion, shoAnswerTimer, blitz.timer]);
    }
  }, 1000);
}

function clearSettings() {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  state.settings = {
    volumeLevel: 0.4,
    timeGame: false,
    audioEnabled: false,
    timeGameStep: 20,
  };
  settings.updateSettings();
}

function onBlitzAnswer(target) {
  if (!blitz.isActive) return;

  if (state.settings.audioEnabled) settings.playSound('.click-sound');

  blitz.checkAnswer(target);

  const flyingPopup = document.createElement('div');
  flyingPopup.classList.add('flying-answer');

  target.closest('.main-wrapper').append(flyingPopup);

  state.scoreStorage[state.gameType][state.countOfBlitzGames].picSet.push(state.data[state.lastBlitzPicNumber]);

  if (target.classList.contains('correct')) {
    if (state.settings.audioEnabled) settings.playSound('.correct-sound');
    state.scoreStorage[state.gameType][state.countOfBlitzGames].answers.push(true);
    target.classList.add('correct-active');
    blitz.timeForGame += 5;

    flyingPopup.classList.add('correct', 'active');
  } else {
    if (state.settings.audioEnabled) settings.playSound('.wrong-sound');
    state.scoreStorage[state.gameType][state.countOfBlitzGames].answers.push(false);
    flyingPopup.classList.add('active');
  }

  if (blitz.watchEnd()) {
    if (blitz.correctAnswersCount === 10) {
      setTimeout(() => {
        render.drawGrandPopup();
        handlers.handlePopup();
      }, 300);
      if (state.settings.audioEnabled) settings.playSound('.end-grand-sound');
    } else {
      setTimeout(() => {
        render.drawFinishPopup();
        handlers.handlePopup();
      }, 300);
      if (blitz.correctAnswersCount >= 7) {
        if (state.settings.audioEnabled) settings.playSound('.end-win-sound');
      } else if (state.settings.audioEnabled) settings.playSound('.end-lose-sound');
    }
    state.countOfBlitzGames += 1;
    if (state.countOfBlitzGames > 11) {
      state.countOfBlitzGames = 0;
    }
    utils.updateLocalStorage();
    clearTimers([endGameTimer]);
    return;
  }

  flyingPopup.onanimationend = () => {
    if (blitz.currentImage <= 9) {
      blitz.nextPicture();
    }
    blitz.isActive = true;
    flyingPopup.remove();
  };
}

async function initGame(target) {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  clearTimers([shoAnswerTimer]);
  const startIndex = target.closest('.categories-card').dataset.index;
  state.gamePictures = await game.createQuestionsSet(startIndex, state.gameType);
  state.lastIndexOfCollection = startIndex;
  state.scoreStorage[state.gameType][state.lastIndexOfCollection].picSet = state.gamePictures;
  state.currentImage = 0;
  state.correctAnswersCount = 0;
  handlers.handleGame();

  endGameTimer = setInterval(() => {
    if (game.watchTime()) {
      render.drawFinishPopup();
      handlers.handlePopup();
      if (state.settings.audioEnabled) settings.playSound('.end-lose-sound');
      clearTimers([endGameTimer]);
    }
  }, 1000);

  if (state.settings.timeGame) {
    game.startTimerForQuestion();

    shoAnswerTimer = setInterval(() => {
      if (game.watchQuestionTimer()) {
        clearTimers([shoAnswerTimer]);
        render.drawPopup();
        handlers.handlePopup();
        if (state.settings.audioEnabled) settings.playSound('.wrong-sound');
        game.currentImage += 1;
        state.currentImage += 1;
      }
    }, 1000);
  }
}

function answerQuestion(target) {
  clearTimers([shoAnswerTimer]);
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  if (state.currentImage >= 10) return;

  const checkAnswer = (isRight) => {
    render.drawPopup(isRight);
    game.checkAnswer(target);
    handlers.handlePopup();
  };

  if (target.classList.contains('correct') || target.classList.contains('correct-art')) {
    state.scoreStorage[state.gameType][state.lastIndexOfCollection].answers[state.currentImage] = true;
    checkAnswer(true, target);
    if (state.settings.audioEnabled) settings.playSound('.correct-sound');
  } else {
    state.scoreStorage[state.gameType][state.lastIndexOfCollection].answers[state.currentImage] = false;
    checkAnswer(false, target);
    if (state.settings.audioEnabled) settings.playSound('.wrong-sound');
  }
}

function nextQuestion(target) {
  handlers.handlePopup();
  clearTimers([shoAnswerTimer, blitz.timer]);
  if (state.settings.audioEnabled) settings.playSound('.click-sound');

  if (state.settings.timeGame) {
    game.refreshTimerForQuestion();
    shoAnswerTimer = setInterval(() => {
      if (game.watchQuestionTimer()) {
        clearTimers([shoAnswerTimer]);
        render.drawPopup();
        handlers.handlePopup();
        if (state.settings.audioEnabled) settings.playSound('.wrong-sound');
        game.currentImage += 1;
        state.currentImage += 1;
      }
    }, 1000);
  }

  if (target.classList.contains('finish-btn')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    clearTimers([shoAnswerTimer, blitz.timer]);
  }

  if (game.watchFinish()) {
    const resultInStorage = state[`${state.gameType}Completed`][state.lastIndexOfCollection];
    if (state.correctAnswersCount === 10) {
      state[`${state.gameType}Completed`][state.lastIndexOfCollection] = state.correctAnswersCount;
      setTimeout(() => {
        render.drawGrandPopup();
        handlers.handlePopup();
      }, 300);
      if (state.settings.audioEnabled) settings.playSound('.end-grand-sound');
    } else {
      resultInStorage > state.correctAnswersCount ? null
        : state[`${state.gameType}Completed`][state.lastIndexOfCollection] = state.correctAnswersCount;
      setTimeout(() => {
        render.drawFinishPopup();
        handlers.handlePopup();
      }, 300);
      if (state.correctAnswersCount >= 7) {
        if (state.settings.audioEnabled) settings.playSound('.end-win-sound');
      } else if (state.settings.audioEnabled) settings.playSound('.end-lose-sound');
    }
    utils.updateLocalStorage();
    return;
  }

  if (state.currentImage <= 9) {
    game.changeQuestion();
  }
}

function finishToHome() {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  state.currentImage = 0;
  game.currentTime = 0;
  clearTimers([game.timer, game.timerQuestion, shoAnswerTimer, blitz.timer]);

  game.currentImage = 0;
  handlers.handleMenu();
  handlers.handlePopup();
}

function resetCounters() {
  game.currentImage = 0;
  game.currentTime = 0;
  state.currentImage = 0;
}

async function nextQuiz() {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  const startIndex = +state.lastIndexOfCollection + 1;
  state.lastIndexOfCollection = startIndex;
  state.gamePictures = await game.createQuestionsSet(startIndex, state.gameType);
  state.correctAnswersCount = 0;
  resetCounters();
  clearTimers([game.timer, game.timerQuestion, shoAnswerTimer, blitz.timer]);

  handlers.handleCategories();
  handlers.handlePopup();
}

function quitGame() {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  if (state.gameType === 'blitz') {
    resetBlitz();
    clearTimers([blitz.timer]);
    handlers.handleMenu();
    return;
  }
  resetCounters();
  clearTimers([game.timer, game.timerQuestion, shoAnswerTimer, blitz.timer]);
  handlers.handleCategories();
}

function navigate(target) {
  if (state.settings.audioEnabled) settings.playSound('.click-sound');
  const hash = target.closest('.nav-btn').href.split('#')[1];
  const navBtns = document.querySelectorAll('.nav-btn');
  if (hash === 'score') {
    handlers.handleScoreChoose();
  } else if (hash === 'blitz') {
    state.gameType = 'artists';
    handlers.handleCategories();
  } else if (hash === 'artists' || hash === 'pictures') {
    handlers.handleCategories();
  } else if (hash === 'menu') {
    handlers.handleMenu();
  } else if (hash === 'settings') {
    handlers.handleSettings();
  }
  navBtns.forEach((btn) => btn.classList.remove('active'));
  clearTimers([game.timer, game.timerQuestion, shoAnswerTimer, blitz.timer]);

  target.closest('.nav-btn').classList.add('active');
}

function chooseScoreCategory(target) {
  if (target.classList.contains('score-artists')) {
    state.gameType = 'artists';
    handlers.handleScore();
  } else if (target.classList.contains('score-pictures')) {
    state.gameType = 'pictures';
    handlers.handleScore();
  } else {
    state.gameType = 'blitz';
    handlers.handleScore();
  }
}

export {
  blitzGame, chooseScoreCategory, navigate, quitGame, clearSettings, onBlitzAnswer, initGame, answerQuestion, nextQuestion, finishToHome, nextQuiz,
};

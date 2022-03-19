import Draw from './js/draw';
import Game from './js/game';
import CreateHTML from './js/createHTML';
import Settings from './js/settings';
import Blitz from './js/blitz-game';
import Canvas from './js/canvas';
import Handlers from './js/handlers';
import * as utils from './js/util';
import * as eventHandlers from './js/event-handlers';
import './styles/style.scss';
import './styles/media-520.scss';
import './styles/media-768.scss';
import './styles/media-1024.scss';

const state = {
  gameType: 'artists',
  data: [],
  gamePictures: [],
  artistsCompleted: (new Array(12)).fill(0),
  picturesCompleted: (new Array(12)).fill(0),
  currentImage: 0,
  correctAnswersCount: 0,
  lastIndexOfCollection: 0,
  lastBlitzPicNumber: 0,
  countOfBlitzGames: 0,
  scoreStorage: {
    artists: {

    },
    pictures: {

    },
    blitz: {

    },
  },
  showScoreIndex: 0,
  settings: {
    volumeLevel: 0.4,
    timeGame: false,
    audioEnabled: false,
    timeGameStep: 20,
    lang: 'en',
  },
};

const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const header = document.querySelector('.header');

const create = new CreateHTML();
const game = new Game();
const blitz = new Blitz();
const canvas = new Canvas();
const handlers = new Handlers(header, main, footer);

if (localStorage.getItem('art-quiz')) {
  state = JSON.parse(localStorage.getItem('art-quiz'));
} else {
  utils.connect();
}

const render = new Draw(main, header, footer);
const settings = new Settings();

window.addEventListener('load', () => render.drawMenu());

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (hash === 'artists') {
    state.gameType = hash;
  } else if (hash === 'pictures') {
    state.gameType = hash;
  }
});

window.addEventListener('click', async (e) => {
  const { target } = e;

  if (target.closest('.lang-select')) {
    state.settings.lang = target.previousElementSibling.value;
    game.getData();
  }

  if (target.classList.contains('btn-arrow')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    handlers.handleMenu();
  }

  if (target.classList.contains('save-btn')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    utils.updateLocalStorage();
    handlers.handleMenu();
  }

  if (target.classList.contains('time-btn')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    if (target.classList.contains('plus-time')) {
      settings.chooseTimeHandler('+');
    } else {
      settings.chooseTimeHandler('-');
    }
  }

  if (target.classList.contains('default-settings')) {
    eventHandlers.clearSettings();
  }

  if (target.closest('.main-button') && !target.closest('.main-button').classList.contains('blitz-btn')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    handlers.handleCategories();
  }

  if (target.classList.contains('blitz-btn')) {
    eventHandlers.blitzGame();
  }

  if (target.classList.contains('blitz-ans-button')) {
    eventHandlers.onBlitzAnswer(target);
  }

  if (target.closest('.card-pic')) {
    eventHandlers.initGame(target);
  }

  if (target.closest('.categories-popup')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    state.showScoreIndex = +target.closest('.categories-card').dataset.index;
    handlers.handleScoreResults();
  }

  if (target.classList.contains('ans-button') || target.classList.contains('art-ans')) {
    eventHandlers.answerQuestion(target);
  }

  if (target.classList.contains('next-btn')) {
    eventHandlers.nextQuestion(target);
  }

  if (target.classList.contains('finish-btn-home')) {
    eventHandlers.finishToHome();
  }

  if (target.classList.contains('next-quiz-btn')) {
    eventHandlers.nextQuiz();
  }

  if (target.closest('.quit-game-btn')) {
    eventHandlers.quitGame();
  }

  if (target.closest('.nav-btn')) {
    eventHandlers.navigate(target);
  }

  if (target.closest('.placeholder-card')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    main.classList.add('hide');
    state.showScoreIndex = +target.closest('.placeholder-card').dataset.index;
    handlers.handleScoreResults();
  }

  if (target.closest('.correct-card')) {
    if (state.settings.audioEnabled) settings.playSound('.click-sound');
    const popup = target.closest('.correct-card').querySelector('.score-popup');
    popup.classList.toggle('hidden');
  }

  if (target.classList.contains('score-btn')) {
    eventHandlers.chooseScoreCategory(target);
  }

  if (target.closest('.save-pic-btn')) {
    canvas.init();
  }

  if (canvas.isOpen && !target.closest('.download-popup') && !target.closest('.save-pic-btn')) {
    canvas.destroy();
  }

  if (target.classList.contains('header-logo')) handlers.handleMenu();
});

window.addEventListener('transitionend', (e) => {
  const { target } = e;

  if (target.classList.contains('settings-view') && target.classList.contains('hide')) {
    render.drawSettings();
    settings.init();
  }
  if (target.classList.contains('menu-view') && target.classList.contains('main') && target.classList.contains('hide')) {
    render.drawMenu();
  }
  if (target.classList.contains('cat-view') && target.classList.contains('hide') && !target.classList.contains('score-choose-view')) {
    render.drawCategories();
  }
  if (target.classList.contains('blitz-view') && target.classList.contains('hide')) {
    render.drawBlitzGame();
    blitz.startGame();
  }
  if (target.classList.contains('game-view') && target.classList.contains('main') && target.classList.contains('hide')) {
    render.drawGame();
  }
  if (target.classList.contains('game-view') && target.classList.contains('main') && !target.classList.contains('hide')) {
    game.startGame();
  }
  if (target.classList.contains('score-view')) {
    render.drawScoreTable();
  }
  if (target.classList.contains('score-results-view')) {
    render.drawScoreResults();
  }
  if (target.classList.contains('score-choose-view')) {
    render.drawScoreChoose();
  }
});

export {
  state,
  game,
  create,
  blitz,
  handlers,
  settings,
  render,
};

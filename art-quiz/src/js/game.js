import * as utils from './util';
import { state, create } from '../index';

export default class Game {
  constructor() {
    this.url = './images1.json';
    this.currentImage = 0;
    this.timeForGame = 300;
    this.timer = '';
    this.timerQuestion = '';
    this.currentTime = 0;
  }

  async getData() {
    const response = await fetch(this.url);
    const data = await response.json();
    state.data = data[state.settings.lang];
    return data;
  }

  async getRandomAuthors() {
    const { data } = state;
    const correctAuthor = state.gamePictures[state.currentImage].author;
    const correctAnswerPlace = utils.getRandomNumber(3, 0);
    let authorsSet = new Set();
    while (authorsSet.size !== 4) {
      if (authorsSet.size === correctAnswerPlace) {
        authorsSet.add(correctAuthor);
      } else {
        const randomAuthorIndex = utils.getRandomNumber(data.length - 1, 0);
        const tempAuthor = data[randomAuthorIndex].author;
        if (tempAuthor !== correctAuthor) authorsSet.add(tempAuthor);
      }
    }
    authorsSet = [...authorsSet];
    authorsSet = authorsSet.map((item) => {
      const splited = item.split(' ');
      if (splited.length > 1) splited[0] = `${splited[0].slice(0, 1)}.`;
      return splited.join(' ');
    });
    return [authorsSet, correctAnswerPlace];
  }

  checkAnswer(trigger) {
    this.currentImage += 1;
    state.currentImage = this.currentImage;
    trigger.classList.contains('correct') || trigger.classList.contains('correct-art') ? state.correctAnswersCount += 1 : null;
  }

  async createQuestionsSet(idx, type) {
    const fullData = await this.getData(this.url);
    const data = fullData[state.settings.lang];
    let gameData = [];
    if (type !== 'artists') {
      gameData = data.slice(idx * 10, (idx * 10) + 10);
    } else {
      gameData = data.slice((idx * 10) + 120, ((idx * 10) + 120) + 10);
    }
    return gameData;
  }

  loadPictures() {
    const picture = document.querySelectorAll('.game-pic');
    const pictureNumber = state.gamePictures[state.currentImage].imageNum;
    picture.forEach((pic) => pic.classList.remove('correct-art'));
    const gamePictures = new Set();
    gamePictures.add(pictureNumber);
    if (state.gameType === 'pictures') {
      picture.forEach((pic) => utils.loadPicture(pic, pictureNumber));
    } else {
      const rightAnswerPlace = utils.getRandomNumber(3, 0);
      picture.forEach((pic, i) => {
        if (i === rightAnswerPlace) {
          utils.loadPicture(pic, pictureNumber);
          pic.classList.add('correct-art');
        } else {
          let randomPicture = utils.getRandomNumber(239, 0);
          while (gamePictures.has(randomPicture)) {
            randomPicture = utils.getRandomNumber(239, 0);
          }
          gamePictures.add(randomPicture);
          utils.loadPicture(pic, randomPicture);
        }
      });
    }
  }

  async changeQuestion() {
    const answersBlock = document.querySelector('.answers-block');
    const question = document.querySelector('.question');
    this.loadPictures();
    question.innerHTML = create.createQuestionForImg();
    if (state.gameType === 'pictures') {
      answersBlock.innerHTML = await create.createAnswers();
    }
  }

  updateTime(widthPerPercent) {
    const percents = (this.currentTime * 100) / this.timeForGame;
    const currentWidth = percents * widthPerPercent;
    const watches = document.querySelector('.time');
    const bar = document.querySelector('.fill-progress');
    bar.style.width = `${currentWidth}px`;

    const minutes = Math.floor((this.timeForGame - this.currentTime) / 60);
    const seconds = (this.timeForGame - this.currentTime) % 60;
    watches.textContent = `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`;
    this.currentTime += 1;
  }

  startGame() {
    const progressBar = document.querySelector('.fill-progress');
    const parentBar = progressBar.closest('.progress-bar');
    this.timeForGame = state.settings.timeGame ? +state.settings.timeGameStep * 10 + 10 : 300;
    this.timeForGame = state.gameType === 'blitz' ? 60 : this.timeForGame;
    const parentWidth = parentBar.getBoundingClientRect().width;
    const widthPerPercent = parentWidth / 100;
    this.updateTime(widthPerPercent);
    this.timer = setInterval(() => {
      this.updateTime(widthPerPercent);
    }, 1000);
  }

  refreshTimerForQuestion() {
    const timer = document.querySelector('.play-with-timer span');
    timer.textContent = state.settings.timeGameStep;
    clearInterval(this.timerQuestion);
    this.startTimerForQuestion();
  }

  updateTimeForQuestion() {
    const timer = document.querySelector('.play-with-timer span');
    let currentTime = +timer.textContent;
    currentTime -= 1;
    timer.textContent = currentTime;
  }

  startTimerForQuestion() {
    this.timerQuestion = setInterval(() => {
      this.updateTimeForQuestion();
    }, 1000);
  }

  watchFinish() {
    if (this.currentImage > 9) {
      this.currentImage = 0;
      return true;
    }
    return false;
  }

  watchTime() {
    if (this.currentTime > this.timeForGame) {
      this.currentTime = 0;
      clearInterval(this.timer);
      return true;
    }
    return false;
  }

  watchQuestionTimer() {
    const timer = document.querySelector('.play-with-timer span');
    if (+timer.textContent <= 0) {
      clearInterval(this.timerQuestion);
      return true;
    }
    return false;
  }
}

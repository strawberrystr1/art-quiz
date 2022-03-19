import {
  state,
} from '../index';
import * as utils from './util';

export default class Blitz {
  constructor() {
    this.currentImage = 0;
    this.currentTime = 0;
    this.timeForGame = 10;
    this.timer = '';
    this.correctAnswersCount = 0;
    this.lastPicNumber = 0;
    this.isActive = true;
  }

  createBlitzPicture() {
    this.lastPicNumber = utils.getRandomNumber(239, 0);
    if (this.isCorrect()) {
      state.lastBlitzPicNumber = this.lastPicNumber;
    } else {
      this.lastPicNumber = utils.getRandomNumber(239, 0);
    }
  }

  isCorrect() {
    const correctAnswer = utils.getRandomNumber(1, 0);
    if (correctAnswer < 1) {
      return false;
    }
    return true;
  }

  randomAnswerPlace() {
    const answers = document.querySelectorAll('.blitz-ans-button');
    answers.forEach((ans) => ans.classList.remove('correct'));
    if (state.lastBlitzPicNumber === this.lastPicNumber) {
      answers[0].classList.add('correct');
    } else {
      answers[1].classList.add('correct');
    }
  }

  nextPicture() {
    this.createBlitzPicture();
    const picture = document.querySelector('.game-pic');
    const question = document.querySelector('.question');
    question.textContent = this.createQuestionForImg();
    utils.loadPicture(picture, this.lastPicNumber);
    this.randomAnswerPlace();
    state.lastBlitzPicNumber = this.lastPicNumber;
  }

  checkAnswer(trigger) {
    this.currentImage += 1;
    state.currentImage = this.currentImage;
    trigger.classList.contains('correct') ? this.correctAnswersCount += 1 : null;
    this.isActive = false;
  }

  createQuestionForImg() {
    const correctAuthor = state.data[this.lastPicNumber].author;
    return `${state.settings.lang === 'en' ? `Is this ${correctAuthor}'s picture?`
      : `Эту картину написал ${correctAuthor}?`}`;
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
    this.createBlitzPicture();
    this.randomAnswerPlace();
    const picture = document.querySelector('.game-pic');
    utils.loadPicture(picture, this.lastPicNumber);
    const progressBar = document.querySelector('.fill-progress');
    const parentBar = progressBar.closest('.progress-bar');
    const parentWidth = parentBar.getBoundingClientRect().width;
    const widthPerPercent = parentWidth / 100;
    this.updateTime(widthPerPercent);
    this.timer = setInterval(() => {
      this.updateTime(widthPerPercent);
    }, 1000);
  }

  watchEnd() {
    if (this.currentImage > 9) {
      return true;
    }
    return false;
  }

  watchTime() {
    if (this.currentTime > this.timeForGame) {
      return true;
    }
    return false;
  }
}

import {
  state,
  game,
} from '../index';

export default class CreateHTML {
  constructor() {
    this.totalPicturesForCategory = 120;
    this.imgInOneGame = 10;
  }

  async createAnswers() {
    let template = '';
    const [authorSet, correctAnswerPlace] = await game.getRandomAuthors();
    template = authorSet.reduce((acc, item, i) => {
      if (i !== correctAnswerPlace) {
        return `${acc}<button class="ans-button">${item}</button>`;
      }
      return `${acc}<button class="ans-button correct">${item}</button>`;
    }, '');
    return template;
  }

  createCards() {
    let template = '';
    const border = this.totalPicturesForCategory / this.imgInOneGame;
    const type = state.gameType === 'blitz' ? 'artists' : state.gameType;
    for (let i = 0; i < border; i += 1) {
      const itemInStorage = state[`${type}Completed`][i];
      template += `
                <a href="#game" class="categories-card ${itemInStorage ? 'colored-card' : 'grey-card'}" data-index="${i}">
                <div class="card-text">
                    <p>${state.settings.lang === 'en' ? `Round ${i + 1}` : `Раунд ${i + 1}`}</p>
                    ${itemInStorage ? `<p>${itemInStorage}/10</p>` : ''}
                </div>
                <img src="./assets/icons/loader.svg" alt="mask" class="card-pic">
                ${state[`${type}Completed`][i] ? `
                <div class=categories-popup>
                    <img src="./assets/icons/star.svg" alt="star">
                    <p>${state.settings.lang === 'en' ? 'Watch score' : 'Счёт'}</p>
                </div>` : ''}
                </a>
            `;
    }
    return template;
  }

  createQuestions() {
    let template = '';
    if (state.gameType === 'artists') {
      template = `
                <img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic artist art-ans">
                <img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic artist art-ans">
                <img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic artist art-ans">
                <img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic artist art-ans">
            `;
    } else if (state.gameType === 'pictures') {
      template = '<img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic pictures">';
    } else {
      template = '<img crossorigin="anonymous" src="./assets/icons/loader.svg" alt="picture" class="game-pic blitz-pic pictures">';
    }
    return template;
  }

  createQuestionForImg() {
    if (state.gameType === 'artists') {
      return `${state.settings.lang === 'en' ? `Which is the ${state.gamePictures[state.currentImage].author} picture?`
        : `Какую картину написал ${state.gamePictures[state.currentImage].author}?`}`;
    } if (state.gameType === 'pictures') {
      return `${state.settings.lang === 'en' ? 'Who is the author of this picture?' : 'Кто автор этой картины ?'}`;
    }
  }

  createScoreTable() {
    let template = '';
    let border = this.totalPicturesForCategory / this.imgInOneGame;
    if (state.gameType === 'blitz') {
      let counter = 0;
      for (const [value] of Object.entries(state.scoreStorage.blitz)) {
        if (value.answers.length) {
          counter += 1;
        }
      }
      border = counter;
    }

    for (let i = 0; i < border; i += 1) {
      template += `
            <div class="placeholder-card" data-index="${i}">
                <p>${state.settings.lang === 'en' ? `Watch score of Round${+(i + 1)}` : `Счёт раунда ${+(i + 1)}`}</p>
            </div>
            `;
    }
    return template;
  }

  createScoreResults() {
    const data = state.scoreStorage[state.gameType][state.showScoreIndex].picSet;
    const currentLangData = state.data;
    const { answers } = state.scoreStorage[state.gameType][state.showScoreIndex];
    const template = answers.reduce((acc, item, i) => acc += `
            <div class="score-card ${item ? 'correct-card' : ''}">
            <div class="score-card-head">
                <p>${state.settings.lang === 'en' ? 'Picture' : 'Картина'} ${i + 1}</p>
                <img src="./assets/icons/${item ? 'correct-score' : 'wrong-score'}.svg" alt="score result">
            </div>
                ${item ? `<div class="score-popup hidden">
                    <p class="score-name">${currentLangData[data[i].imageNum].author}</p>
                    <p class="score-pic">${currentLangData[data[i].imageNum].name}</p>
                    <p class="score-year">${currentLangData[data[i].imageNum].year}</p>
                    </div>` : ''}
            </div>
            `, '');
    return template;
  }
}

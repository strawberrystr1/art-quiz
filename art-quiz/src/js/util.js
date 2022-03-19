import { state, game, create } from '../index';

function updateLocalStorage() {
  localStorage.setItem('art-quiz', JSON.stringify(state));
}

function getRandomNumber(max, min) {
  return Math.abs(Math.floor(min - 0.5 + Math.random() * (max - min + 1)));
}

async function connect() {
  await game.getData();
  const countOfCategories = create.totalPicturesForCategory / create.imgInOneGame;

  for (let i = 0; i < countOfCategories; i += 1) {
    let artistsImages = await game.createQuestionsSet(i, 'artists');
    let picturessImages = await game.createQuestionsSet(i, 'pictures');

    while (!artistsImages.length && !picturessImages.length) {
      artistsImages = await game.createQuestionsSet(i, 'artists');
      picturessImages = await game.createQuestionsSet(i, 'pictures');
    }

    state.scoreStorage.artists[i] = {
      answers: (new Array(10)).fill(false, 0, 10),
      picSet: artistsImages,
    };
    state.scoreStorage.pictures[i] = {
      answers: (new Array(10)).fill(false, 0, 10),
      picSet: picturessImages,
    };
    state.scoreStorage.blitz[i] = {
      answers: [],
      picSet: [],
    };
  }
  updateLocalStorage();
}

function loadPicture(elem, picNumber) {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/strawberrystr1/image-data/master/img/${picNumber}.jpg`;
  elem.classList.add('img-hidden');
  img.onload = () => {
    elem.src = `https://raw.githubusercontent.com/strawberrystr1/image-data/master/img/${picNumber}.jpg`;
    elem.classList.remove('img-hidden');
  };
}

function destroyPopup() {
  const popup = document.querySelector('.popup-overlay');
  popup.remove();
}

function handlePopup() {
  const popup = document.querySelector('.popup');
  const popupBG = document.querySelector('.popup-overlay');
  popup.classList.toggle('popup-hide');
  popupBG.classList.toggle('visible');
}

export {
  handlePopup, updateLocalStorage, getRandomNumber, connect, loadPicture, destroyPopup,
};

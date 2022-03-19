import {
  state,
} from '../index';

export default class Canvas {
  constructor() {
    this.indexToDownload = 0;
    this.pics = [];
    this.isOpen = false;
  }

  init() {
    if (state.gameType === 'artists') {
      this.createElements();
      this.isOpen = true;
    } else {
      this.pics = [...document.querySelectorAll('.game-pic')];
      this.createCanvas();
    }
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1280;
    const image = this.pics[this.indexToDownload];
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const dataImage = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.target = '_self';
    link.download = 'img.jpg';
    link.href = dataImage;
    link.click();
  }

  createElements() {
    const div = document.createElement('div');
    const select = document.createElement('select');
    const btn = document.createElement('a');
    div.classList.add('download-popup', 'hidden');
    const placeToAppend = document.querySelector('.main-wrapper');
    this.pics = [...document.querySelectorAll('.game-pic')];
    let template = '';

    this.pics.forEach((item, i) => {
      template += `<option value="${i}">Download picture №${i + 1}</option>`;
    });

    select.innerHTML = template;

    btn.textContent = 'Donwload';
    btn.classList.add('download-btn');

    select.addEventListener('change', (e) => {
      this.indexToDownload = e.target.value;
    });

    this.downloadBtn = btn;

    btn.addEventListener('click', () => {
      this.createCanvas();
      this.destroy(div);
    });

    div.append(select);
    div.append(btn);

    placeToAppend.append(div);

    div.classList.remove('hidden');
  }

  destroy() {
    document.querySelector('.download-popup').remove();
    this.isOpen = false;
  }
}

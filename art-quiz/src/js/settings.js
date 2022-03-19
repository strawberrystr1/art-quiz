import { state } from '../index';

export default class Settings {
  init() {
    const {
      volumeLevel, timeGame, audioEnabled, timeGameStep,
    } = state.settings;

    this.timeToggler = document.querySelector('#input-time');
    this.countOfSeconds = document.querySelector('input[type="number"]');
    this.music = document.querySelector('#input-music');
    this.range = document.querySelector('input[type="range"]');
    this.lang = document.querySelector(`.${state.settings.lang}`);

    this.range.value = volumeLevel;
    this.countOfSeconds.value = timeGameStep;
    this.music.checked = audioEnabled;
    this.timeToggler.checked = timeGame;

    this.range.addEventListener('input', this.volumeHandler.bind(this));
    this.timeToggler.addEventListener('change', this.timeGameHandler.bind(this));
    this.music.addEventListener('change', this.musicHandler.bind(this));
    this.lang.checked = true;
  }

  volumeHandler() {
    state.settings.volumeLevel = this.range.value;
  }

  timeGameHandler() {
    state.settings.timeGame = this.timeToggler.checked;
  }

  musicHandler() {
    state.settings.audioEnabled = this.music.checked;
  }

  chooseTimeHandler(sign) {
    if (sign === '+') {
      if (this.countOfSeconds.value >= 30) return;
      this.countOfSeconds.value = +this.countOfSeconds.value + 5;
    } else {
      if (this.countOfSeconds.value <= 5) return;
      this.countOfSeconds.value = +this.countOfSeconds.value - 5;
    }
    state.settings.timeGameStep = this.countOfSeconds.value;
  }

  playSound(selector) {
    const sound = document.querySelector(selector);
    sound.currentTime = 0;
    sound.volume = state.settings.volumeLevel;
    sound.play();
  }

  updateSettings() {
    this.timeToggler.checked = false;
    this.countOfSeconds.value = 20;
    this.range.value = 0.4;
    this.music.checked = false;
    state.settings.lang = 'en';
    document.querySelector(`.${state.settings.lang}`).checked = true;
  }
}

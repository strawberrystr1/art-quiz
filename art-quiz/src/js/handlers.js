export default class Handlers {
  constructor(header, main, footer) {
    this.header = header;
    this.main = main;
    this.footer = footer;
  }

  setHandler(main, header, footer) {
    if (main) {
      this.main.className = main;
    }
    if (header) {
      this.header.className = header;
    }
    if (footer) {
      this.footer.className = footer;
    }
  }

  handlerBlitz() {
    this.setHandler('main blitz-view game-wrapper-main hide', 'header game-wrapper-header hide');
  }

  handleSettings() {
    this.setHandler('main settings-view settings-wrapper-main hide', 'header settings-view settings-wrapper-header', 'footer settings-view');
  }

  handleMenu() {
    this.setHandler('main menu-view hide settings-wrapper-main', 'header menu-view hide settings-wrapper-header', 'footer menu-view');
  }

  handleCategories() {
    this.setHandler('main cat-view hide categories-wrapper-main', 'header cat-view categories-wrapper-header', 'footer cat-view categories-wrapper-footer');
  }

  handleGame() {
    this.setHandler('main game-view hide', 'header game-view hide game-wrapper-header', 'footer game-view');
  }

  handlePopup() {
    const popup = document.querySelector('.popup');
    const popupBG = document.querySelector('.popup-overlay');
    popup.classList.toggle('popup-hide');
    popupBG.classList.toggle('visible');
  }

  handleScore() {
    this.setHandler('main score-view hide');
  }

  handleScoreChoose() {
    this.setHandler('main score-choose-view hide', 'header score-choose-view', 'footer score-choose-view');
  }

  handleScoreResults() {
    this.main.className = 'main score-results-view';
    this.main.classList.add('hide');
  }
}

export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }
  getRefs(selector) {
    const refs = {};
    refs.showBtn = document.querySelector(selector);
    refs.label = refs.showBtn.querySelector('.label');

    return refs;
  }

  enable() {
    this.refs.showBtn.disabled = false;
    this.refs.label.textContent = 'Show more';
  }

  disable() {
    this.refs.showBtn.disabled = true;
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.showBtn.classList.remove('is-hidden');
  }
  hide() {
    this.refs.showBtn.classList.add('is-hidden');
  }
}

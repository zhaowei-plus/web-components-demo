class FcDialog extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  get open() {
    return this.getAttribute('open') !== null;
  }

  get title() {
    return this.getAttribute('title') || 'dialog';
  }

  get type () {
    return this.getAttribute('type');
  }

  render () {
    this.dom = document.createElement('div')
    this.dom.innerHTML = `
    <div class="box">
      <div class="title">这是一个标题</div>
      <div class="content">这是内容</div>
    </div>
    `
    this.replaceWith(this.dom)
  }
}

customElements.define('fc-dialog', FcDialog)
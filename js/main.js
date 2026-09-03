'use strict';

{
  // console.log("script.js 読み込みOK");

  // ページトップボタン
  const pagetopBtn = document.querySelector(".pagetop");

  pagetopBtn.addEventListener("click", () => {
    window.scroll({
      top: 0, 
      behavior: "smooth" 
    });
  });

  window.addEventListener("scroll", () => {
    pagetopBtn.style.opacity = window.scrollY > 100 ? "1" : "0";
  });


  // ハンバーガーメニュー
  const hamburgerBtn = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  hamburgerBtn.addEventListener("click", () => {
    menu.classList.toggle("open");      // メニュー開閉
    hamburgerBtn.classList.toggle("active");  // ボタン状態切り替え
  });


  // 書籍情報インスタンス作成
  class BookCard {
    constructor({ img, title, description }) {
      this.img = img;
      this.title = title;
      this.description = description;
      this.el = this.createElement();
    }

    createElement() {
      const container = document.createElement('div');
      container.className = 'container';

      const image = document.createElement('img');
      image.src = this.img;
      image.alt = this.title;

      const intro = document.createElement('div');
      intro.className = 'intro';

      const h3 = document.createElement('h3');
      h3.innerHTML = this.title;

      const p = document.createElement('p');
      p.innerHTML = this.description;

      intro.appendChild(h3);
      intro.appendChild(p);
      container.appendChild(image);
      container.appendChild(intro);

      return container;
    }

    render() {
      return this.el;
    }
  }

  const list = document.getElementById('book-list');

  books.forEach(book => {
    const card = new BookCard(book);
    list.appendChild(card.render());
  });

}
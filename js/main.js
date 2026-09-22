'use strict';

{
  // ページトップボタン
  const pagetopBtn = document.querySelector('.pagetop');

  pagetopBtn?.addEventListener('click', () => {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', () => {
    if (pagetopBtn) {
      pagetopBtn.style.opacity = window.scrollY > 100 ? '1' : '0';
    }
  });

  // ハンバーガーメニュー
  const hamburgerBtn = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');

  hamburgerBtn?.addEventListener('click', () => {
    menu?.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
  });

  const list = document.getElementById('book-list');

  if (list) {
    const category = list.dataset.category;
    loadBooks(category);
  }

  async function loadBooks(category) {
    try {
      const response = await fetch('data/books.json');

      if (!response.ok) {
        throw new Error(`JSONの読み込みに失敗しました: ${response.status}`);
      }

      const bookData = await response.json();
      const books = bookData[category];

      if (!Array.isArray(books)) {
        throw new Error(`カテゴリ「${category}」のデータが見つかりません。`);
      }

      renderBooks(books);
    } catch (error) {
      console.error(error);
      showLoadError();
    }
  }

  function renderBooks(books) {
    const fragment = document.createDocumentFragment();

    books.forEach((book) => {
      fragment.appendChild(createBookCard(book));
    });

    list.replaceChildren(fragment);
  }

  function createBookCard(book) {
    const button = document.createElement('button');
    button.className = 'book-card';
    button.type = 'button';
    button.setAttribute('aria-label', `${stripHtml(book.title)}の詳細を表示`);

    const image = document.createElement('img');
    image.src = book.img;
    image.alt = stripHtml(book.title);
    image.loading = 'lazy';

    const titleOverlay = document.createElement('span');
    titleOverlay.className = 'book-card__title';
    titleOverlay.innerHTML = book.title;

    button.append(image, titleOverlay);
    button.addEventListener('click', () => openBookModal(book));

    return button;
  }

  function openBookModal(book) {
    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `${stripHtml(book.title)}の詳細`);

    modal.innerHTML = `
      <div class="book-modal__backdrop" data-close-modal></div>
      <div class="book-modal__panel">
        <button class="book-modal__close" type="button" aria-label="詳細を閉じる" data-close-modal>×</button>
        <div class="book-modal__image-wrap">
          <img class="book-modal__image" src="${book.img}" alt="${escapeHtml(stripHtml(book.title))}">
        </div>
        <div class="book-modal__content">
          <h3 class="book-modal__title">${book.title}</h3>
          <p class="book-modal__description">${book.description}</p>
        </div>
      </div>
    `;

    const closeModal = () => {
      modal.remove();
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    modal.querySelectorAll('[data-close-modal]').forEach((element) => {
      element.addEventListener('click', closeModal);
    });

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleEscape);
    modal.querySelector('.book-modal__close')?.focus();
  }

  function stripHtml(value) {
    const temp = document.createElement('div');
    temp.innerHTML = value;
    return temp.textContent ?? '';
  }

  function escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showLoadError() {
    list.innerHTML = `
      <p class="load-error">
        書籍データを読み込めませんでした。<br>
        JSONを読み込むため、HTMLファイルを直接開くのではなくローカルサーバー経由で表示してください。
      </p>
    `;
  }
}

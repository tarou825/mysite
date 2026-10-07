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

    books.forEach((book, index) => {
      fragment.appendChild(createBookCard(book, index, books));
    });

    list.replaceChildren(fragment);
  }

  function createBookCard(book, index, books) {
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
    button.addEventListener('click', () => openBookModal(book, index, books, button));

    return button;
  }

  function openBookModal(book, index, books, trigger) {
    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `${stripHtml(book.title)}の詳細`);

    modal.innerHTML = `
      <div class="book-modal__backdrop" data-close-modal></div>
      <section class="book-modal__panel" aria-labelledby="book-modal-title">
        <button class="book-modal__close" type="button" aria-label="詳細を閉じる" data-close-modal>×</button>
        <div class="book-modal__image-wrap"></div>
        <div class="book-modal__content"></div>
      </section>
    `;

    const closeModal = () => {
      modal.remove();
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
      trigger.focus();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const renderBook = (bookIndex) => {
      const currentBook = books[bookIndex];
      const imageWrap = modal.querySelector('.book-modal__image-wrap');
      const content = modal.querySelector('.book-modal__content');

      modal.setAttribute('aria-label', `${stripHtml(currentBook.title)}の詳細`);
      imageWrap.innerHTML = `
        <img class="book-modal__image" src="${currentBook.img}" alt="${escapeHtml(stripHtml(currentBook.title))}">
      `;
      content.innerHTML = `
        <h3 class="book-modal__title" id="book-modal-title">${currentBook.title}</h3>
        <div class="book-modal__description">${currentBook.description}</div>
        <nav class="book-modal__pagination" aria-label="巻を移動">
          <button class="book-modal__action" type="button" data-book-index="${bookIndex - 1}" ${bookIndex === 0 ? 'disabled' : ''}>
            ← 前の巻
          </button>
          <span>${bookIndex + 1} / ${books.length}</span>
          <button class="book-modal__action" type="button" data-book-index="${bookIndex + 1}" ${bookIndex === books.length - 1 ? 'disabled' : ''}>
            次の巻 →
          </button>
        </nav>
      `;
    };

    modal.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (event.target.closest('[data-close-modal]')) {
        closeModal();
        return;
      }

      const pageButton = event.target.closest('[data-book-index]');
      if (pageButton && !pageButton.disabled) {
        index = Number(pageButton.dataset.bookIndex);
        renderBook(index);
      }
    });

    renderBook(index);
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

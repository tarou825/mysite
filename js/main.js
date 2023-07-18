'use strict';

{
  const pagetop_btn = document.querySelector(".pagetop");

  pagetop_btn.addEventListener('click', scroll_top);

  function scroll_top() {
    window.scroll({ top: 0, behavior: "smooth" });
  }

  window.addEventListener("scroll", scroll_event);
  function scroll_event() {
    if (window.scrollY > 100) {
      pagetop_btn.style.opacity = "1";
    } else {
      pagetop_btn.style.opacity = "0";
    }
  }
}
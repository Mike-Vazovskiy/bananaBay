const burger  = document.querySelector('.header__burger');
const sidebar = document.querySelector('.sidebar');
const sidebarClose = document.querySelector('.sidebar__close')

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    sidebar.classList.toggle('open');
});

// закрываем меню кликом по пункту (опционально)
sidebar.querySelectorAll('.sidebar__item').forEach(el =>
    el.addEventListener('click', () => {
        burger.classList.remove('active');
        sidebar.classList.remove('open');
    })
);

sidebarClose.addEventListener('click', () => {
  burger.classList.remove('active');
  sidebar.classList.remove('open');
})
document.querySelectorAll('.location__card').forEach(card => {
    const btn       = card.querySelector('.more');
    const label     = card.querySelector('.more__label');   // текст кнопки
    const textBlock = card.querySelector('.collapsible');
    const imgBlock  = card.querySelector('.imgs-collapsible'); // может отсутствовать

    if (!btn || !label || !textBlock) return; // критично только label и textBlock

    btn.addEventListener('click', () => {
        // переключаем видимость блоков
        textBlock.classList.toggle('open');
        if (imgBlock) imgBlock.classList.toggle('open');

        // переключаем состояние кнопки
        btn.classList.toggle('open'); 
        label.textContent = btn.classList.contains('open') ? 'Свернуть' : 'Подробнее об участке';
    });
});

// const items = document.querySelectorAll('.places__item');

// items.forEach(item => {
//     item.addEventListener('click', () => {
//         // Убираем active со всех
//         items.forEach(i => i.classList.remove('active'));
//         // Добавляем active только к текущему
//         item.classList.add('active');
//     });
// });

document.querySelectorAll('.location__card').forEach((card) => {
  // главный слайдер
  const mainSwiper = new Swiper(card.querySelector('.mySwiper2'), {
    spaceBetween: 10,
    navigation: {
      nextEl: card.querySelector('.swiper-button-next'),
      prevEl: card.querySelector('.swiper-button-prev'),
    },
    on: {
      // синхронизируем активную миниатюру при листании стрелками/тачем
      slideChange(swiper) {
        setActiveThumb(swiper.realIndex);
      },
    },
  });

  const thumbs = card.querySelectorAll('.location-thumbs img');

  // функция подсветки активного превью
  const setActiveThumb = (index) => {
    thumbs.forEach((img, i) =>
      img.classList.toggle('active', i === index),
    );
  };

  // клики по миниатюрам
  thumbs.forEach((img, i) => {
    img.addEventListener('click', () => {
      mainSwiper.slideTo(i);      // перейти к нужному слайду
      setActiveThumb(i);          // подсветить миниатюру сразу
    });
  });

  // первоначальная подсветка
  setActiveThumb(0);
});

const whatsappButton = document.querySelector('.whatsapp');
const locations = document.querySelector('#locations');
const footer = document.querySelector('.footer');

const defaultBottom = 30; // px (уменьшено для более компактного расположения)
let lastTranslateY = 0; // Для сглаживания изменений

const updateButtonState = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const locationsRect = locations.getBoundingClientRect();
    const locationsTop = scrollY + locationsRect.top;
    const locationsHeight = locations.offsetHeight;
    const locationsMid = locationsTop + (locationsHeight / 2);

    const footerRect = footer.getBoundingClientRect();
    const footerTop = scrollY + footerRect.top;

    const buttonHeight = whatsappButton.offsetHeight;

    // Появление кнопки
    if (scrollY + windowHeight >= locationsMid) {
        whatsappButton.classList.add('visible');
    } else {
        whatsappButton.classList.remove('visible');
    }

    // Проверка: близко ли кнопка к футеру
    const buffer = -65; // Уменьшен буфер для меньшего поднятия
    const stopPoint = footerTop - buttonHeight - buffer;
    const overlap = Math.max(0, scrollY + windowHeight - stopPoint);

    // Сглаживание только при движении вверх, для движения вниз — мгновенно
    const targetTranslateY = overlap > 0 ? -overlap : 0;
    const smoothingFactor = targetTranslateY < lastTranslateY ? 0.4 : 1; // Быстрее вниз (1 = без сглаживания)
    const smoothedTranslateY = lastTranslateY + (targetTranslateY - lastTranslateY) * smoothingFactor;
    lastTranslateY = smoothedTranslateY;

    whatsappButton.style.transform = `translateY(${smoothedTranslateY}px)`;

    // Продолжаем обновление, если страница прокручивается
    if (isScrolling) {
        requestAnimationFrame(updateButtonState);
    }
};

// Запускаем обновление только при скролле или ресайзе
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateButtonState);
    }
});
window.addEventListener('resize', () => {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateButtonState);
    }
});

// Останавливаем requestAnimationFrame, когда скролл прекращается
window.addEventListener('scroll', () => {
    clearTimeout(window.scrollEndTimer);
    window.scrollEndTimer = setTimeout(() => {
        isScrolling = false;
    }, 100); // Уменьшено до 100 мс для большей отзывчивости
});
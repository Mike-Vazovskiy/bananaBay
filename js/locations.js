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
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

    const defaultBottom = 50; // px

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
        const distanceFromBottom = document.documentElement.scrollHeight - (scrollY + windowHeight);

        const footerHeight = footer.offsetHeight;
        const stopPoint = footerTop - buttonHeight + 60; // 20px буфер

        if ((scrollY + windowHeight) > stopPoint) {
            const overlap = (scrollY + windowHeight) - stopPoint;
            whatsappButton.style.transform = `translateY(-${overlap}px)`;
        } else {
            whatsappButton.style.transform = `translateY(0)`;
        }
    };

    window.addEventListener('scroll', updateButtonState);
    window.addEventListener('resize', updateButtonState);
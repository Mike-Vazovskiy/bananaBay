   // Получаем значение отступа из CSS-переменной
    const gap = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--slide-gap')
    );

    new Swiper('.swiper-1', {
      slidesPerView: 'auto',     // Автоматическая ширина слайдов (определяется CSS)
      slidesPerGroup: 1,         // Прокручивать по одному слайду
      autoHeight: true,
      spaceBetween: gap,         // Отступ между слайдами
      centeredSlides: false,     // Отключаем центрирование
      breakpoints: {
        // Для экранов <= 768px
        768: {
          slidesPerView: 1,      // Один слайд на мобильных
          slidesPerGroup: 1,     // Прокручивать по одному слайду
          spaceBetween: 0        // Без отступа на мобильных
        },
        // Для экранов > 768px
        769: {
          slidesPerView: 'auto', // Автоматическая ширина слайдов
          slidesPerGroup: 1,     // Прокручивать по одному слайду
          spaceBetween: gap      // Отступ между слайдами
        }
      },
      navigation: {
        nextEl: '.swiper-button-next-1',
        prevEl: '.swiper-button-prev-1'
      }
    });
    var swiper2 = new Swiper(".mySwiper2", {
      slidesPerView: 2,
      spaceBetween: 30,
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });

  document.querySelectorAll('.accordion-header').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item   = btn.parentElement;
      const panel  = item.querySelector('.panel');
      item.classList.toggle('open');

      if(item.classList.contains('open')){
        // раскрываем: выставляем точную max-height
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }else{
        // сворачиваем
        panel.style.maxHeight = 0;
      }
    });
  });



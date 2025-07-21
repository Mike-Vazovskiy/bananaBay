   // Получаем значение отступа из CSS-переменной
    const gap = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--slide-gap')
    );

    new Swiper('.swiper-1', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      autoHeight: true,
      spaceBetween: gap,
      centeredSlides: false,
      breakpoints: {
        768: {
          autoHeight: true,
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 0
        },
        769: {
          autoHeight: true,
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          spaceBetween: gap
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



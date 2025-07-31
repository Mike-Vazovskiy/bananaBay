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

  //  const whatsappButton = document.querySelector('.whatsapp');
  //   const locations = document.querySelector('#locations');
  //   const footer = document.querySelector('.footer');

  //   const defaultBottom = 50; // px

  //   const updateButtonState = () => {
  //       const scrollY = window.scrollY;
  //       const windowHeight = window.innerHeight;

  //       const locationsRect = locations.getBoundingClientRect();
  //       const locationsTop = scrollY + locationsRect.top;
  //       const locationsHeight = locations.offsetHeight;
  //       const locationsMid = locationsTop + (locationsHeight / 2);

  //       const footerRect = footer.getBoundingClientRect();
  //       const footerTop = scrollY + footerRect.top;

  //       const buttonHeight = whatsappButton.offsetHeight;

  //       // Появление кнопки
  //       if (scrollY + windowHeight >= locationsMid) {
  //           whatsappButton.classList.add('visible');
  //       } else {
  //           whatsappButton.classList.remove('visible');
  //       }

  //       // Проверка: близко ли кнопка к футеру
  //       const distanceFromBottom = document.documentElement.scrollHeight - (scrollY + windowHeight);

  //       const footerHeight = footer.offsetHeight;
  //       const stopPoint = footerTop - buttonHeight + 60; // 20px буфер

  //       if ((scrollY + windowHeight) > stopPoint) {
  //           const overlap = (scrollY + windowHeight) - stopPoint;
  //           whatsappButton.style.transform = `translateY(-${overlap}px)`;
  //       } else {
  //           whatsappButton.style.transform = `translateY(0)`;
  //       }
  //   };

  //   window.addEventListener('scroll', updateButtonState);
  //   window.addEventListener('resize', updateButtonState);

  const whatsappButton   = document.querySelector('.whatsapp');
const locations        = document.querySelector('#locations');
const footer           = document.querySelector('.footer');

let   locMid, stopPoint, btnH;
const recalcMetrics = () => {
  const scrollY      = window.scrollY;
  const locRect      = locations.getBoundingClientRect();
  const footerRect   = footer.getBoundingClientRect();

  locMid    = scrollY + locRect.top + locRect.height / 2;
  btnH      = whatsappButton.offsetHeight;
  stopPoint = scrollY + footerRect.top - btnH + 60;
};
recalcMetrics();
window.addEventListener('resize', recalcMetrics);

// --- rAF-throttled scroll handler ---
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY + innerHeight;

    // показать / скрыть
    whatsappButton.classList.toggle('visible', y >= locMid);

    // подвинуть, если перекрываем футер
    const overlap = Math.max(0, y - stopPoint);
    whatsappButton.style.transform = `translate3d(0, -${overlap}px, 0)`;

    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true }); /* пассивный слушатель! */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.intlTelInput) {
    console.error('intlTelInput не загружен.');
    return;
  }

  const phoneInputs = document.querySelectorAll('input.js-phone');
  const itiInstances = new Map();
  let cachedCountry = null;

  const geoIpLookup = cb => {
    if (cachedCountry) { cb(cachedCountry); return; }
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(data => {
        cachedCountry = data.country_code || 'US';
        cb(cachedCountry);
      })
      .catch(() => { cachedCountry = 'US'; cb('US'); });
  };

  phoneInputs.forEach((input, idx) => {
    if (!input.id) input.id = `phone_${idx+1}`;

    const iti = window.intlTelInput(input, {
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.5.3/js/utils.js',
      initialCountry: 'ru',
      separateDialCode: true,
      autoPlaceholder: 'aggressive',   // << показать пример формата
      formatOnDisplay: true,           // << автоформат когда возможно
      geoIpLookup,
    });
    itiInstances.set(input, iti);

    // --- Фильтр ввода: блокируем недопустимые символы до вставки в поле ---
    const allowedKeyPattern = /^[0-9()+\-\s]$/;

    input.addEventListener('beforeinput', e => {
      // Разрешаем удаления / форматные операции
      if (
        e.inputType === 'deleteContentBackward' ||
        e.inputType === 'deleteContentForward' ||
        e.inputType === 'deleteByCut' ||
        e.inputType === 'historyUndo' ||
        e.inputType === 'historyRedo' ||
        e.inputType === 'insertFromPaste' // обработаем отдельно
      ) {
        return;
      }
      // Печатный символ
      if (e.data && !allowedKeyPattern.test(e.data)) {
        e.preventDefault();
      }
    });

    // Санитизация вставок (paste / drop)
    const sanitize = raw => {
      // оставляем цифры и один ведущий +
      let txt = raw.replace(/[^\d+]/g, '');
      // гарантируем, что + только в начале (если был не вначале — переместим)
      const plusCount = (txt.match(/\+/g) || []).length;
      if (plusCount > 1) {
        txt = txt.replace(/\+/g, '');
        txt = '+' + txt;
      } else if (plusCount === 1 && txt[0] !== '+') {
        txt = txt.replace(/\+/g, '');
        txt = '+' + txt;
      }
      return txt;
    };

    input.addEventListener('paste', e => {
      e.preventDefault();
      const raw = (e.clipboardData || window.clipboardData).getData('text');
      const clean = sanitize(raw);
      input.value = clean;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // --- Автоформат при blur (похоже на маску) ---
    input.addEventListener('blur', () => {
      // дожидаемся загрузки utils (она async)
      if (iti.promise) {
        iti.promise.then(() => formatCurrentInput(input, iti));
      } else {
        formatCurrentInput(input, iti);
      }
    });

    // Отладка
    input.addEventListener('input', () => {
      console.log(`Phone input #${input.id} changed:`, input.value);
    });
  });

  function formatCurrentInput(input, iti) {
    const rawIntl = iti.getNumber(); // E.164 (если распарсилось)
    if (!rawIntl) return;            // не форматируем пустое / нераспознанное
    try {
      const iso2 = iti.getSelectedCountryData().iso2;
      // хотим показать «национальный» формат (без кода страны) внутри поля,
      // т.к. у нас separateDialCode=true. Можно выбрать INTERNATIONAL.
      const formatted = window.intlTelInputUtils.formatNumber(
        rawIntl,
        iso2,
        window.intlTelInputUtils.numberFormat.NATIONAL
      );
      if (formatted) input.value = formatted;
    } catch (err) {
      console.warn('format error', err);
    }
  }

  // --- Общий submit (как раньше) ---
  const forms = document.querySelectorAll('form.js-contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const phoneInput = form.querySelector('input.js-phone');
      const iti = itiInstances.get(phoneInput);
      const formData = new FormData(form);
      const phoneNumber = iti ? iti.getNumber() : phoneInput.value;

      if (!iti || !phoneNumber || !iti.isValidNumber()) {
        const errorCode = iti ? iti.getValidationError() : -1;
        let errorMessage = 'Пожалуйста, введите корректный номер телефона.';
        switch (errorCode) {
          case 1: errorMessage = 'Номер слишком короткий.'; break;
          case 2: errorMessage = 'Номер слишком длинный.'; break;
          case 3: errorMessage = 'Номер не соответствует формату выбранной страны.'; break;
          case 4: errorMessage = 'Неверный код страны.'; break;
        }
        alert(errorMessage);
        return;
      }

      formData.set('phone', phoneNumber);

      try {
        const resp = await fetch(form.action || 'send.php', {
          method: form.method || 'POST',
          body: formData
        });
        if (resp.ok) {
          alert('Спасибо! Заявка отправлена.');
          form.reset();
          iti.setNumber('');
          if (form.id === 'popupForm') {
            const popup = document.getElementById('popup');
            if (popup) popup.style.display = 'none';
          }
        } else {
          const txt = await resp.text();
          alert('Ошибка: ' + txt);
        }
      } catch (err) {
        console.error('Network error:', err);
        alert('Ошибка сети. Попробуйте позже.');
      }
    });
  });

  
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const openPopup = document.getElementById('openPopup');
  if (openPopup) openPopup.addEventListener('click', () => { if (popup) popup.style.display = 'flex'; });
  if (closePopup) closePopup.addEventListener('click', () => { if (popup) popup.style.display = 'none'; });
});
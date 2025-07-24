document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------
     0. intl‑tel‑input
  ------------------------------------------------------------------ */
  if (!window.intlTelInput) { console.error('intlTelInput не загружен'); return; }

  const phoneInputs  = document.querySelectorAll('input.js-phone');
  const itiInstances = new Map();
  let   cachedCountry = null;

  const geoIpLookup = cb => {
    if (cachedCountry) { cb(cachedCountry); return; }
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(d => { cachedCountry = d.country_code || 'US'; cb(cachedCountry); })
      .catch(() => { cachedCountry = 'US'; cb('US'); });
  };

  phoneInputs.forEach((input, idx) => {
    if (!input.id) input.id = `phone_${idx + 1}`;

    const iti = window.intlTelInput(input, {
      utilsScript     : 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.5.3/js/utils.js',
      initialCountry  : 'id',
      geoIpLookup,
      separateDialCode: true,
      formatOnDisplay : false,
    });
    itiInstances.set(input, iti);

    const allowed = /^[0-9()+\-\s]$/;
    input.addEventListener('beforeinput', e => {
      const removable = e.inputType?.startsWith('delete') ||
                       e.inputType === 'historyUndo'      ||
                       e.inputType === 'historyRedo'      ||
                       e.inputType === 'insertFromPaste';
      if (removable) return;
      if (e.data && !allowed.test(e.data)) e.preventDefault();
    });

    const sanitize = raw => {
      let t = raw.replace(/[^\d+]/g, '');
      const plus = (t.match(/\+/g) || []).length;
      if (plus > 1)            t = '+' + t.replace(/\+/g, '');
      else if (plus === 1 && t[0] !== '+') t = '+' + t.replace(/\+/g, '');
      return t;
    };
    input.addEventListener('paste', e => {
      e.preventDefault();
      input.value = sanitize((e.clipboardData || window.clipboardData).getData('text'));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  /* ------------------------------------------------------------------
     1. формы
  ------------------------------------------------------------------ */
  const forms = document.querySelectorAll('form.js-contact-form');
  forms.forEach(form => {
    const waRadio = form.querySelector('input[name="method"][value="whatsapp"]');
    const tgRadio = form.querySelector('input[name="method"][value="telegram"]');
    const waBlock = form.querySelector('.method--whatsapp');
    const tgBlock = form.querySelector('.method--telegram');
    const hasSwitcher = waRadio && tgRadio && waBlock && tgBlock;

    const toggle = () => {
      if (!hasSwitcher) return;
      const waActive = waRadio.checked;
      waBlock.toggleAttribute('data-disabled', !waActive);
      tgBlock.toggleAttribute('data-disabled',  waActive);
      waBlock.querySelectorAll('input').forEach(i => { i.disabled = !waActive; });
      tgBlock.querySelectorAll('input').forEach(i => { i.disabled =  waActive; });
    };
    if (hasSwitcher) {
      toggle();
      waRadio.addEventListener('change', toggle);
      tgRadio.addEventListener('change', toggle);
      tgBlock.addEventListener('focusin', () => { tgRadio.checked = true; toggle(); });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn && (btn.disabled = true);

      const fd   = new FormData(form);
      const name = fd.get('name')?.trim();
      if (!name) {
        showPopupMessage('Ошибка', 'Введите имя');
        btn && (btn.disabled = false);
        return;
      }

      /* === WhatsApp ================================================= */
      if (!hasSwitcher || waRadio.checked) {
        const waInput  = form.querySelector('input[name="whatsapp"]');
        const itiWa    = itiInstances.get(waInput);
        const waNumber = itiWa ? itiWa.getNumber() : waInput.value.trim();

        if (!waNumber) {
          showPopupMessage('Ошибка', 'Введите номер WhatsApp');
          btn && (btn.disabled = false);
          return;
        }
        if (itiWa && !itiWa.isValidNumber()) {
          showPopupMessage('Ошибка', 'Неверный номер WhatsApp');
          btn && (btn.disabled = false);
          return;
        }
        fd.set('whatsapp', waNumber);
        fd.delete('telegram');

      /* === Telegram ================================================= */
      } else {
        const tgPhoneEl = form.querySelector('input[name="tg_phone"]');
        const itiTg     = itiInstances.get(tgPhoneEl);
        const tgPhone   = itiTg ? itiTg.getNumber() : tgPhoneEl.value.trim();
        const tgUser    = fd.get('tg_username')?.trim();

        if (!tgPhone && !tgUser) {
          showPopupMessage('Ошибка', 'Укажите номер ИЛИ ник Telegram');
          btn && (btn.disabled = false);
          return;
        }
        if (tgPhone && itiTg && !itiTg.isValidNumber()) {
          showPopupMessage('Ошибка', 'Неверный номер телефона Telegram');
          btn && (btn.disabled = false);
          return;
        }

        let tgField = '';
        if (tgPhone) tgField += tgPhone;
        if (tgUser)  tgField += (tgField ? ' (' + tgUser + ')' : tgUser);

        fd.set('telegram', tgField);
        fd.delete('whatsapp');
      }

      try {
        const resp = await fetch(form.getAttribute('action') || 'send.php', {
          method: form.getAttribute('method') || 'POST',
          body  : fd,
        });
        if (resp.ok) {
          showPopupMessage('Спасибо!', 'Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время.');
          form.reset();
          toggle();
          form.querySelectorAll('input.js-phone').forEach(inp => {
            const iti = itiInstances.get(inp);
            iti && iti.setNumber('');
          });
        } else {
          showPopupMessage('Ошибка', await resp.text());
        }
      } catch (err) {
        console.error('Network error:', err);
        showPopupMessage('Ошибка сети', 'Пожалуйста, попробуйте позже.');
      }

      btn && (btn.disabled = false);
    });
  });

  /* ------------------------------------------------------------------
     2. Попап
  ------------------------------------------------------------------ */
  const popup = document.getElementById('popup');
  const open  = document.querySelectorAll('.openPopup');
  const close = document.getElementById('closePopup');

  open.forEach(element => {
    element.addEventListener('click', () => popup.classList.add('show'));
  });

  close?.addEventListener('click', () => popup.classList.remove('show'));
  document.getElementById("closeSuccess")?.addEventListener('click', () => {
    document.getElementById('popupSuccess').style.display = 'none';
  });

  /* ------------------------------------------------------------------
     3. Функция отображения popup-сообщений
  ------------------------------------------------------------------ */
  const showPopupMessage = (title, message) => {
    const popup    = document.getElementById('popupSuccess');
    const titleEl  = document.getElementById('popupSuccessTitle');
    const textEl   = document.getElementById('popupSuccessText');
    if (titleEl && textEl && popup) {
      titleEl.textContent = title;
      textEl.textContent  = message;
      popup.style.display = 'flex';
    } else {
      console.warn('popupSuccess элементы не найдены');
    }
  };
});

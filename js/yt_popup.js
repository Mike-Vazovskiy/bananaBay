(function(){
  const modal  = document.getElementById('yt-modal');
  const iframe = document.getElementById('yt-iframe');
  let lastFocused = null;

  /* --------- Утилита: достаём ID и параметры --------- */
  function parseYouTube(raw){
    if (!raw) return null;
    raw = raw.trim();

    // Если передан только ID (11 символов, но не всегда), возьмём как есть.
    // Более надёжно: если нет "youtube" / "youtu.be" в строке — считаем ID.
    const isLikelyId = !/youtu\.?be/i.test(raw) && !/youtube\.com/i.test(raw);
    let videoId = null;
    let params  = {};

    if (isLikelyId) {
      videoId = raw;
    } else {
      try {
        const url = new URL(raw);
        // youtu.be/<id>
        if (/youtu\.be$/i.test(url.hostname)) {
          videoId = url.pathname.slice(1);
        }
        // youtube.com/watch?v=<id> или другое
        if (!videoId) {
          videoId = url.searchParams.get('v');
        }
        // playlist?
        const list = url.searchParams.get('list');
        if (list) params.list = list;

        // Старт может быть t=42s или t=1m10s; start=секунды
        const t = url.searchParams.get('t');
        if (t) params.start = parseTimeToSeconds(t);
        const start = url.searchParams.get('start');
        if (start) params.start = start;

        const end = url.searchParams.get('end');
        if (end) params.end = end;
      } catch (e) {
        // если URL не распарсился — fallback: считать raw как ID
        videoId = raw;
      }
    }

    if (!videoId) return null;
    return { videoId, params };
  }

  /* --------- Преобразование t=1m10s -> секунды --------- */
  function parseTimeToSeconds(t){
    if (!t) return null;
    // примеры: "42", "42s", "1m10s", "2h3m5s"
    const re = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
    if (/^\d+$/.test(t)) return t;
    const m = t.match(re);
    if (!m) return null;
    const h = parseInt(m[1]||0,10);
    const mnt = parseInt(m[2]||0,10);
    const s = parseInt(m[3]||0,10);
    return h*3600 + mnt*60 + s;
  }

  /* --------- Собираем финальный embed-src --------- */
  function buildEmbedSrc(trigger){
    const raw = trigger.dataset.youtube;
    const parsed = parseYouTube(raw);
    if (!parsed) return null;

    const { videoId, params: parsedParams } = parsed;

    // параметры по умолчанию
    const defaults = {
      autoplay: trigger.dataset.autoplay ?? 1,
      rel:      trigger.dataset.rel ?? 0,
    };

    // перезапишем из data-* если заданы
    // поддержка start, end, list, cc_load_policy и любых др. data-имён
    const extra = {};
    for (const [name, value] of Object.entries(trigger.dataset)) {
      if (name === 'youtube') continue; // уже обработан
      // dataset camelCase -> paramName 그대로
      // пример: dataCcLoadPolicy -> cc_load_policy
      const paramName = name.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
      extra[paramName] = value;
    }

    const allParams = Object.assign({}, defaults, parsedParams, extra);

    // строим строку
    const usp = new URLSearchParams();
    for (const [k,v] of Object.entries(allParams)) {
      if (v == null || v === '') continue;
      usp.set(k, v);
    }

    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${usp.toString()}`;
  }

  /* --------- Открытие / закрытие --------- */
  function openModalWithTrigger(trigger){
    const src = buildEmbedSrc(trigger);
    if (!src) return;
    lastFocused = document.activeElement;
    iframe.src = src;
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-close-modal]').focus();
    document.addEventListener('keydown', escHandler);
  }

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = ''; // сбрасываем, чтобы остановить воспроизведение
    document.removeEventListener('keydown', escHandler);
    if (lastFocused) lastFocused.focus();
  }

  function escHandler(e){
    if (e.key === 'Escape') closeModal();
  }

  /* --------- Делегированный клик --------- */
  document.addEventListener('click', function(e){
    const trigger = e.target.closest('.yt-popup-trigger');
    if (trigger) {
      e.preventDefault();
      openModalWithTrigger(trigger);
      return;
    }
    if (e.target.matches('[data-close-modal]')) {
      e.preventDefault();
      closeModal();
    }
  });
})();
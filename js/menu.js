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

// Функциональность переключения языка
const langElements = document.querySelectorAll('.lang');

// Функция определения языка браузера
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    console.log('Язык браузера:', browserLang);
    
    // Если язык браузера русский, возвращаем 'RU', иначе 'EN'
    if (browserLang.toLowerCase().startsWith('ru')) {
        return 'RU';
    } else {
        return 'EN';
    }
}

// Функция для принудительного обновления языка (для тестирования)
function refreshLanguage() {
    console.log('Обновляю язык...');
    location.reload();
}

// Функция для очистки сохраненного языка (симуляция первого визита)
function resetLanguageChoice() {
    localStorage.removeItem('siteLanguage');
    console.log('Язык сброшен. Перезагрузите страницу для симуляции первого визита.');
    location.reload();
}

// Добавляем функции в глобальную область для тестирования
window.refreshLanguage = refreshLanguage;
window.resetLanguageChoice = resetLanguageChoice;

// Проверяем, есть ли сохраненный язык пользователя
let savedLanguage = localStorage.getItem('siteLanguage');

// Если нет сохраненного языка (первый визит), определяем по браузеру
if (!savedLanguage) {
    savedLanguage = detectBrowserLanguage();
    localStorage.setItem('siteLanguage', savedLanguage);
    console.log('Первый визит - язык определен по браузеру:', savedLanguage);
} else {
    console.log('Используем сохраненный язык пользователя:', savedLanguage);
}

let currentLanguage = savedLanguage.toLowerCase();

// Устанавливаем начальный текст кнопок (показываем язык, НА КОТОРЫЙ можно переключиться)
langElements.forEach(element => {
    element.textContent = savedLanguage === 'RU' ? 'EN' : 'RU';
});

// Функция для перевода всех элементов на странице
function translatePage(language) {
    console.log('Начинаю перевод на язык:', language);
    console.log('Доступен ли объект translations:', !!window.translations);
    
    if (!window.translations) {
        console.error('Объект translations не найден!');
        return;
    }
    
    const elementsToTranslate = document.querySelectorAll('[data-lang]');
    console.log('Найдено элементов для перевода:', elementsToTranslate.length);
    
    elementsToTranslate.forEach((element, index) => {
        const key = element.getAttribute('data-lang');
        console.log(`Элемент ${index + 1}: key="${key}"`);
        
        if (window.translations[key]) {
            const translation = window.translations[key][language] || window.translations[key]['ru'];
            console.log(`Перевод найден: "${translation}"`);
            
            // Проверяем, содержит ли перевод HTML теги
            if (translation.includes('<') || translation.includes('&')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        } else {
            console.warn(`Перевод не найден для ключа: ${key}`);
        }
    });
    
    // Обновляем placeholder'ы в формах
    const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
    console.log('Найдено placeholder элементов:', placeholderElements.length);
    
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (window.translations[key]) {
            const translation = window.translations[key][language] || window.translations[key]['ru'];
            element.setAttribute('placeholder', translation);
            console.log(`Placeholder обновлен: ${key} -> ${translation}`);
        }
    });
    
    // Обновляем alt атрибуты
    const altElements = document.querySelectorAll('[data-lang-alt]');
    altElements.forEach(element => {
        const key = element.getAttribute('data-lang-alt');
        if (window.translations[key]) {
            const translation = window.translations[key][language] || window.translations[key]['ru'];
            element.setAttribute('alt', translation);
        }
    });
    
    console.log('Перевод завершен!');
}

// Обработчик клика на все элементы языка
langElements.forEach(langElement => {
    langElement.addEventListener('click', () => {
        console.log('Клик по переключателю языка');
        
        const buttonText = langElement.textContent;
        console.log('Текст кнопки (язык для переключения):', buttonText);
        
        if (buttonText === 'EN') {
            // Кнопка показывает 'EN' - переключаемся на английский
            langElements.forEach(el => el.textContent = 'RU');
            currentLanguage = 'en';
            localStorage.setItem('siteLanguage', 'EN');
            switchToEnglish();
        } else {
            // Кнопка показывает 'RU' - переключаемся на русский
            langElements.forEach(el => el.textContent = 'EN');
            currentLanguage = 'ru';
            localStorage.setItem('siteLanguage', 'RU');
            switchToRussian();
        }
        
        // Переводим все элементы на странице
        translatePage(currentLanguage);
    });
});

// Функция переключения на английский язык
function switchToEnglish() {
    console.log('Переключено на английский язык');
    
    document.documentElement.setAttribute('lang', 'en');
    document.body.classList.add('lang-en');
    document.body.classList.remove('lang-ru');
}

// Функция переключения на русский язык
function switchToRussian() {
    console.log('Переключено на русский язык');
    
    document.documentElement.setAttribute('lang', 'ru');
    document.body.classList.add('lang-ru');
    document.body.classList.remove('lang-en');
}

// Применяем определенный язык при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, применяю язык:', savedLanguage);
    console.log('🌍 Информация о языке:');
    console.log('  - Язык браузера:', navigator.language);
    console.log('  - Текущий язык сайта:', savedLanguage);
    console.log('  - Найдено кнопок переключения языка:', langElements.length);
    console.log('📝 Первый визит: язык по браузеру | Повторный визит: сохраненный выбор');
    
    if (savedLanguage === 'EN') {
        currentLanguage = 'en';
        switchToEnglish();
    } else {
        currentLanguage = 'ru';
        switchToRussian();
    }
    
    // Переводим страницу при загрузке с небольшой задержкой
    setTimeout(() => {
        translatePage(currentLanguage);
    }, 100);
});
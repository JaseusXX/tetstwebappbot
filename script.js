/**
 * JavaScript логика для Telegram Mini App
 * Работа с Telegram WebApp API и интерактивные элементы
 */

// === Инициализация Telegram Web App ===
const tg = window.Telegram.WebApp;

// Расширяем приложение на весь экран
tg.expand();

// Сообщаем Telegram, что приложение готово
tg.ready();

// === Состояние приложения ===
const appState = {
    currentPage: 'home',
    theme: 'light',
    counter: 0,
    totalClicks: 0,
    incrementClicks: 0,
    decrementClicks: 0,
    currentColor: '#6366f1'
};

// === Массив мотивирующих фраз ===
const motivationalQuotes = [
    'Вы можете всё, что угодно! Главное — начать. 💪',
    'Каждый день — это новая возможность стать лучше! ✨',
    'Верь в себя, и всё получится! 🌟',
    'Маленькие шаги ведут к большим достижениям! 🚀',
    'Твой успех начинается сегодня! 🎯',
    'Не бойся ошибок — они делают тебя сильнее! 💎',
    'Мечты сбываются, если за них бороться! 🌈',
    'Ты сильнее, чем думаешь! 🦁',
    'Каждая попытка приближает тебя к цели! 🎪',
    'Будущее создаёшь ты сам! 🌅',
    'Твоё время — сейчас! ⏰',
    'Невозможное возможно! Просто попробуй! 🌠'
];

// === Массив цветов для генератора ===
const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f59e0b', '#10b981', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1'
];

// === Получение элементов DOM ===
const elements = {
    // Навигация
    navButtons: document.querySelectorAll('.nav__button'),
    pages: document.querySelectorAll('.page'),
    
    // Страница Home
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeText: document.getElementById('theme-text'),
    userName: document.getElementById('user-name'),
    userId: document.getElementById('user-id'),
    userTheme: document.getElementById('user-theme'),
    userPlatform: document.getElementById('user-platform'),
    
    // Страница Counter
    counterValue: document.getElementById('counter-value'),
    counterIncrement: document.getElementById('counter-increment'),
    counterDecrement: document.getElementById('counter-decrement'),
    counterReset: document.getElementById('counter-reset'),
    totalClicksEl: document.getElementById('total-clicks'),
    incrementClicksEl: document.getElementById('increment-clicks'),
    decrementClicksEl: document.getElementById('decrement-clicks'),
    
    // Страница Generator
    quoteText: document.getElementById('quote-text'),
    generateQuote: document.getElementById('generate-quote'),
    colorPreview: document.getElementById('color-preview'),
    colorCode: document.getElementById('color-code'),
    changeColor: document.getElementById('change-color'),
    
    // Подвал
    closeApp: document.getElementById('close-app')
};

// === Инициализация приложения ===
function initApp() {
    // Устанавливаем тему из Telegram
    setThemeFromTelegram();
    
    // Заполняем информацию о пользователе
    fillUserInfo();
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Обрабатываем изменение темы в Telegram
    tg.onEvent('themeChanged', handleThemeChange);
    
    console.log('Mini App initialized successfully');
}

// === Установка темы из Telegram ===
function setThemeFromTelegram() {
    const telegramTheme = tg.colorScheme || 'light';
    appState.theme = telegramTheme;
    document.documentElement.setAttribute('data-theme', telegramTheme);
    updateThemeButton();
}

// === Обработчик изменения темы в Telegram ===
function handleThemeChange() {
    setThemeFromTelegram();
}

// === Обновление кнопки переключения темы ===
function updateThemeButton() {
    if (appState.theme === 'dark') {
        elements.themeIcon.textContent = '☀️';
        elements.themeText.textContent = 'Светлая тема';
    } else {
        elements.themeIcon.textContent = '🌙';
        elements.themeText.textContent = 'Тёмная тема';
    }
}

// === Заполнение информации о пользователе ===
function fillUserInfo() {
    try {
        // Безопасное получение данных пользователя
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
            // Используем textContent для безопасности (защита от XSS)
            const firstName = user.first_name || 'Гость';
            const lastName = user.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            
            elements.userName.textContent = fullName;
            elements.userId.textContent = user.id || 'Неизвестно';
        } else {
            elements.userName.textContent = 'Гость';
            elements.userId.textContent = 'Режим разработки';
        }
        
        // Информация о теме и платформе
        elements.userTheme.textContent = appState.theme === 'dark' ? 'Тёмная' : 'Светлая';
        elements.userPlatform.textContent = tg.platform || 'unknown';
        
    } catch (error) {
        console.error('Error filling user info:', error);
        elements.userName.textContent = 'Ошибка загрузки';
        elements.userId.textContent = 'Н/Д';
    }
}

// === Настройка обработчиков событий ===
function setupEventListeners() {
    // Навигация между страницами
    elements.navButtons.forEach(button => {
        button.addEventListener('click', () => handlePageChange(button));
    });
    
    // Переключение темы
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Счётчик
    elements.counterIncrement.addEventListener('click', incrementCounter);
    elements.counterDecrement.addEventListener('click', decrementCounter);
    elements.counterReset.addEventListener('click', resetCounter);
    
    // Генератор
    elements.generateQuote.addEventListener('click', generateQuote);
    elements.changeColor.addEventListener('click', changeColor);
    
    // Закрытие приложения
    elements.closeApp.addEventListener('click', closeApp);
}

// === Навигация между страницами ===
function handlePageChange(button) {
    const targetPage = button.getAttribute('data-page');
    
    if (targetPage === appState.currentPage) return;
    
    // Обновляем состояние
    appState.currentPage = targetPage;
    
    // Обновляем активные классы навигации
    elements.navButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Переключаем страницы
    elements.pages.forEach(page => {
        if (page.id === `page-${targetPage}`) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    // Отправляем haptic feedback (вибрация)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// === Переключение темы ===
function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    updateThemeButton();
    
    // Обновляем отображаемую тему в информации
    elements.userTheme.textContent = appState.theme === 'dark' ? 'Тёмная' : 'Светлая';
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// === Функции счётчика ===
function incrementCounter() {
    appState.counter++;
    appState.totalClicks++;
    appState.incrementClicks++;
    updateCounterDisplay();
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function decrementCounter() {
    appState.counter--;
    appState.totalClicks++;
    appState.decrementClicks++;
    updateCounterDisplay();
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function resetCounter() {
    appState.counter = 0;
    updateCounterDisplay();
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function updateCounterDisplay() {
    // Используем textContent для безопасности
    elements.counterValue.textContent = appState.counter;
    elements.totalClicksEl.textContent = appState.totalClicks;
    elements.incrementClicksEl.textContent = appState.incrementClicks;
    elements.decrementClicksEl.textContent = appState.decrementClicks;
    
    // Добавляем анимацию
    elements.counterValue.style.animation = 'none';
    // Trigger reflow для перезапуска анимации
    void elements.counterValue.offsetWidth;
    elements.counterValue.style.animation = 'pulse 0.3s ease';
}

// === Генератор мотивирующих фраз ===
function generateQuote() {
    // Получаем случайную фразу
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];
    
    // Обновляем текст (используем textContent для безопасности)
    elements.quoteText.textContent = quote;
    
    // Добавляем анимацию появления
    elements.quoteText.style.animation = 'none';
    void elements.quoteText.offsetWidth;
    elements.quoteText.style.animation = 'fadeIn 0.5s ease';
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// === Смена цвета ===
function changeColor() {
    // Получаем случайный цвет
    const randomIndex = Math.floor(Math.random() * colors.length);
    appState.currentColor = colors[randomIndex];
    
    // Обновляем отображение
    elements.colorPreview.style.background = appState.currentColor;
    elements.colorCode.textContent = appState.currentColor;
    
    // Добавляем анимацию
    elements.colorPreview.style.animation = 'none';
    void elements.colorPreview.offsetWidth;
    elements.colorPreview.style.animation = 'pulse 0.3s ease';
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// === Закрытие приложения ===
function closeApp() {
    // Показываем уведомление перед закрытием
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('warning');
    }
    
    // Закрываем Web App
    tg.close();
}

// === Обработка ошибок ===
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // В production можно отправлять ошибки на сервер
});

// === Запуск приложения при загрузке DOM ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM уже загружен
    initApp();
}

// === Экспорт для отладки (только в development) ===
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.appState = appState;
    window.tg = tg;
    console.log('Debug mode enabled. Access appState and tg from console.');
}

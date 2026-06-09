// DOM элементы
const operationSelect = document.getElementById('operation');
const maxNumberInput = document.getElementById('maxNumber');
const questionDiv = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const checkBtn = document.getElementById('checkBtn');
const newBtn = document.getElementById('newBtn');
const feedbackDiv = document.getElementById('feedback');

let currentQuestion = {
    text: '',
    answer: null
};

// Случайное целое от min до max включительно
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Проверка деления нацело
function isIntegerDivision(dividend, divisor) {
    return divisor !== 0 && dividend % divisor === 0;
}

// Генерация нового примера
function generateQuestion() {
    const operation = operationSelect.value;
    let max = parseInt(maxNumberInput.value, 10);
    if (isNaN(max) || max < 5) max = 20;

    let a, b, answer, text;
    let attempts = 0;
    const maxAttempts = 30;

    // Подбираем подходящий пример (особенно для деления)
    while (attempts < maxAttempts) {
        if (operation === '+') {
            a = randomInt(1, max);
            b = randomInt(1, max);
            answer = a + b;
            text = `${a} + ${b}`;
            break;
        } 
        else if (operation === '-') {
            a = randomInt(1, max);
            b = randomInt(1, a); // чтобы ответ неотрицательный
            answer = a - b;
            text = `${a} – ${b}`;
            break;
        }
        else if (operation === '*') {
            // ограничим произведение не более 100 для простоты
            let maxFactor = Math.min(max, 10);
            a = randomInt(2, maxFactor);
            b = randomInt(2, maxFactor);
            answer = a * b;
            if (answer <= 100) {
                text = `${a} × ${b}`;
                break;
            }
        }
        else if (operation === '/') {
            // деление нацело: b * c = a
            let divisor = randomInt(2, 10);
            let quotient = randomInt(2, Math.floor(max / divisor));
            let dividend = divisor * quotient;
            if (dividend <= max && dividend > 0) {
                a = dividend;
                b = divisor;
                answer = quotient;
                text = `${a} ÷ ${b}`;
                break;
            }
        }
        else if (operation === 'all') {
            // случайный выбор из 4 действий
            const ops = ['+', '-', '*', '/'];
            const randomOp = ops[Math.floor(Math.random() * ops.length)];
            if (randomOp === '+') {
                a = randomInt(1, max);
                b = randomInt(1, max);
                answer = a + b;
                text = `${a} + ${b}`;
                break;
            }
            else if (randomOp === '-') {
                a = randomInt(1, max);
                b = randomInt(1, a);
                answer = a - b;
                text = `${a} – ${b}`;
                break;
            }
            else if (randomOp === '*') {
                let maxFactor = Math.min(max, 10);
                a = randomInt(2, maxFactor);
                b = randomInt(2, maxFactor);
                answer = a * b;
                if (answer <= 100) {
                    text = `${a} × ${b}`;
                    break;
                }
            }
            else if (randomOp === '/') {
                let divisor = randomInt(2, 10);
                let quotient = randomInt(2, Math.floor(max / divisor));
                let dividend = divisor * quotient;
                if (dividend <= max && dividend > 0) {
                    a = dividend;
                    b = divisor;
                    answer = quotient;
                    text = `${a} ÷ ${b}`;
                    break;
                }
            }
        }
        attempts++;
    }
    // fallback (если вдруг не подобрали)
    if (!text) {
        a = randomInt(1, max);
        b = randomInt(1, max);
        answer = a + b;
        text = `${a} + ${b}`;
    }

    currentQuestion = { text, answer };
    questionDiv.textContent = text;
    answerInput.value = '';
    feedbackDiv.innerHTML = '';
    feedbackDiv.style.color = '';
}

// Проверка ответа
function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value);
    if (isNaN(userAnswer)) {
        feedbackDiv.innerHTML = '📝 Введи число в поле ответа!';
        feedbackDiv.style.color = '#f97316';
        return;
    }
    if (userAnswer === currentQuestion.answer) {
        feedbackDiv.innerHTML = '✅ Верно! Молодец! 🎉';
        feedbackDiv.style.color = '#10b981';
        // опционально: через секунду автоматически новый пример
        // setTimeout(() => generateQuestion(), 1500);
    } else {
        feedbackDiv.innerHTML = `❌ Неправильно. Правильный ответ: ${currentQuestion.answer}. Попробуй ещё!`;
        feedbackDiv.style.color = '#ef4444';
    }
}

// Обработчики
newBtn.addEventListener('click', () => {
    generateQuestion();
    answerInput.focus();
});
checkBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// При изменении настроек – новый пример
operationSelect.addEventListener('change', generateQuestion);
maxNumberInput.addEventListener('change', generateQuestion);

// Первый пример при загрузке
generateQuestion();

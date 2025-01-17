const themeSwitch = document.getElementById("theme-switch");
const themeIcon = document.getElementById("theme-icon");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (savedTheme === null && prefersDarkScheme.matches);

    if (isDark) {
        document.body.classList.add("dark");
        themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
        document.body.classList.remove("dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }
}

function saveTheme(isDark) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

themeSwitch.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeIcon.classList.toggle("fa-moon", isDark);
    themeIcon.classList.toggle("fa-sun", !isDark);
    saveTheme(isDark);
});

loadTheme();

const defaultList = [
    "\"Что за бред?\"",
    "Невероятный саунд-дизайн",
    "Имена придумываются на ходу",
    "ЛАВОЧКА",
    "\"нормально\"",
    "Нью-Йорк или пригород",
    "ГГ пьёт виски",
    "Все вокруг зарабатывают больше ГГ",
    "ГГ идёт в бар и кого-то встречает",
    "Пизданутые на всю голову цены",
    "Пердёж или отрыжка Озона",
    "ГГ щемят женщины, а он терпит",
    "Нужно найти работу",
    "Внезапно становится маньяком",
    "Отсылки на Тихого Дена",
    "Камео из нижнего интернета",
    "Поездка в такси как завязка сюжета",
    "\"...говорил я себе\""
];

let currentList = [];
let selectedCards = new Set();

const bingoGrid = document.getElementById("bingo-grid");
const resetBtn = document.getElementById("reset-btn");
const editBtn = document.getElementById("edit-btn");
const defaultBtn = document.getElementById("default-btn");

const modalOverlay = document.getElementById("modal-overlay");
const editTextarea = document.getElementById("edit-textarea");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

function saveToLocalStorage() {
    localStorage.setItem("bingoList", JSON.stringify(currentList));
    localStorage.setItem("bingoSelected", JSON.stringify([...selectedCards]));
}

function loadFromLocalStorage() {
    const storedList = localStorage.getItem("bingoList");
    const storedSelected = localStorage.getItem("bingoSelected");

    if (storedList) {
        try {
            currentList = JSON.parse(storedList);
        } catch (e) {
            console.error("Ошибка при парсинге списка:", e);
            currentList = [...defaultList];
        }
    } else {
        currentList = [...defaultList];
    }

    if (storedSelected) {
        try {
            const parsedSelected = JSON.parse(storedSelected);
            selectedCards = new Set(parsedSelected);
        } catch (e) {
            console.error("Ошибка при парсинге выделенных карточек:", e);
            selectedCards = new Set();
        }
    }
}

function renderGrid(list) {
    bingoGrid.innerHTML = "";

    list.forEach((text) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = text;

        if (selectedCards.has(text)) {
            card.classList.add("selected");
        }

        card.addEventListener("click", () => {
            if (selectedCards.has(text)) {
                selectedCards.delete(text);
                card.classList.remove("selected");
            } else {
                selectedCards.add(text);
                card.classList.add("selected");
            }

            saveToLocalStorage();
        });

        bingoGrid.appendChild(card);
    });
}

function resetSelection() {
    selectedCards.clear();
    saveToLocalStorage();
    renderGrid(currentList);
}

function openEditModal() {
    editTextarea.value = currentList.join("\n");
    modalOverlay.classList.add("show");
}

function closeEditModal() {
    modalOverlay.classList.remove("show");
}

function saveEditedList() {
    const newList = editTextarea.value
        .split("\n")
        .map(str => str.trim())
        .filter(str => str);

    const oldSelected = new Set(selectedCards);
    const newSelected = new Set();

    newList.forEach((item) => {
        if (oldSelected.has(item)) {
            newSelected.add(item);
        }
    });

    currentList = newList;
    selectedCards = newSelected;

    saveToLocalStorage();
    renderGrid(currentList);
    closeEditModal();
}

function resetToDefaultList() {
    currentList = [...defaultList];

    const oldSelected = new Set(selectedCards);
    const newSelected = new Set();

    currentList.forEach((item) => {
        if (oldSelected.has(item)) {
            newSelected.add(item);
        }
    });

    selectedCards = newSelected;

    saveToLocalStorage();
    renderGrid(currentList);
}

loadFromLocalStorage();
renderGrid(currentList);

resetBtn.addEventListener("click", resetSelection);
editBtn.addEventListener("click", openEditModal);
cancelBtn.addEventListener("click", closeEditModal);
saveBtn.addEventListener("click", saveEditedList);
defaultBtn.addEventListener("click", resetToDefaultList);

let foundCount = 0;
const totalArtifacts = 6;

let startTime = null;
let timerInterval = null;
let gameActive = false;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

const progressText = document.getElementById("progressText");
const timerText = document.getElementById("timerText");

const modal = document.getElementById("artifactModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalText = document.getElementById("modalText");
const closeModalBtn = document.getElementById("closeModalBtn");

const winModal = document.getElementById("winModal");
const finalTime = document.getElementById("finalTime");
const finalRank = document.getElementById("finalRank");
const restartBtn = document.getElementById("restartBtn");

const hintBtn = document.getElementById("hintBtn");
const hintCount = document.getElementById("hintCount");

const foundSound = new Audio("sounds/found.mp3");
const hintSound = new Audio("sounds/hint.mp3");
const winSound = new Audio("sounds/win.mp3");

/* =========================
   🔊 AMBIENT SOUND (ДОБАВЛЕНО)
========================= */
const ambientSound = new Audio("sounds/ambient.mp3");
ambientSound.loop = true;
ambientSound.volume = 0.25;

let hintsLeft = 3;

const artifactInfo = {
    photo: {
        title: "Архивная фотография",
        image: "assets/photo.png",
        text: "Групповая фотография выпускников и преподавателей МГУПИ, отражающая связь поколений университета."
    },
    blueprint: {
        title: "Чертёж прибора",
        image: "assets/blueprint.png",
        text: "Инженерный чертёж научного оборудования, демонстрирующий традиции приборостроения и технического проектирования."
    },
    ticket: {
        title: "Студенческий билет",
        image: "assets/ticket.png",
        text: "Документ студента Московского государственного университета приборостроения и информатики."
    },
    diploma: {
        title: "Диплом выпускника",
        image: "assets/diploma.png",
        text: "Официальный диплом выпускника МГУПИ, символ завершения обучения и профессионального становления."
    },
    computer: {
        title: "Старый компьютер",
        image: "assets/computer.png",
        text: "Ретро-компьютер как символ развития вычислительной техники и цифровых технологий в образовательной среде."
    },
    badge: {
        title: "Юбилейный значок",
        image: "assets/badge.png",
        text: "Памятный знак МГУПИ к 90-летию университета: 1936–2026."
    }
};

/* Список безопасных позиций на сцене */
const artifactPositions = [
    { top: "10%", left: "7%" },
    { top: "14%", left: "25%" },
    { top: "12%", left: "46%" },
    { top: "16%", left: "67%" },

    { top: "32%", left: "12%" },
    { top: "36%", left: "34%" },
    { top: "34%", left: "55%" },
    { top: "38%", left: "76%" },

    { top: "58%", left: "10%" },
    { top: "62%", left: "30%" },
    { top: "60%", left: "52%" },
    { top: "64%", left: "72%" },

    { top: "78%", left: "18%" },
    { top: "76%", left: "42%" },
    { top: "80%", left: "62%" }
];

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    startGame();
});

function startGame() {
    winSound.pause();
    winSound.currentTime = 0;

    /* 🔊 AMBIENT START */
    ambientSound.currentTime = 0;
    ambientSound.play().catch(() => { });

    foundCount = 0;
    hintsLeft = 3;
    gameActive = true;

    progressText.textContent = "Найдено: 0/6";
    timerText.textContent = "Время: 00:00";

    hintCount.textContent = "Подсказки: 3";
    hintBtn.disabled = false;
    hintBtn.style.opacity = 1;

    modal.classList.add("hidden");
    winModal.classList.add("hidden");

    resetArtifacts();
    resetList();
    showIntroArtifacts();

    document.querySelectorAll(".artifact").forEach(item => {
        item.style.visibility = "hidden";
    });

    randomizeArtifacts();

    setTimeout(() => {
        document.querySelectorAll(".artifact").forEach(item => {
            item.style.visibility = "visible";
        });
    }, 50);

    startTime = Date.now();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!gameActive) return;

        const diff = Math.floor((Date.now() - startTime) / 1000);
        const min = String(Math.floor(diff / 60)).padStart(2, "0");
        const sec = String(diff % 60).padStart(2, "0");

        timerText.textContent = `Время: ${min}:${sec}`;
    }, 1000);
}

function playFoundSound() {
    foundSound.currentTime = 0;
    foundSound.play().catch(() => { });
}

function playHintSound() {
    hintSound.currentTime = 0;
    hintSound.play().catch(() => { });
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play().catch(() => { });
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function randomizeArtifacts() {

    const artifacts = Array.from(document.querySelectorAll(".artifact"));
    const positions = shuffle([...artifactPositions]);

    artifacts.forEach((artifact, index) => {

        const position = positions[index];

        artifact.style.transition = "none";

        artifact.style.top = position.top;
        artifact.style.left = position.left;

        artifact.style.right = "auto";
        artifact.style.bottom = "auto";

        const randomRotation = Math.floor(Math.random() * 16) - 8;
        artifact.style.transform = `rotate(${randomRotation}deg)`;
    });

    setTimeout(() => {
        artifacts.forEach(item => {
            item.style.transition = "";
        });
    }, 50);
}

document.querySelectorAll(".artifact").forEach(item => {
    item.addEventListener("click", () => {
        if (!gameActive) return;
        if (item.classList.contains("found")) return;

        const id = item.dataset.id;
        const info = artifactInfo[id];

        item.classList.add("found-anim");
        playFoundSound();

        setTimeout(() => {
            item.classList.add("found");
        }, 600);

        foundCount++;
        progressText.textContent = `Найдено: ${foundCount}/6`;

        const listItem = document.querySelector(`[data-item="${id}"]`);
        if (listItem) listItem.classList.add("done");

        setTimeout(() => {
            modalTitle.textContent = info.title;
            modalImage.src = info.image;
            modalImage.alt = info.title;
            modalText.textContent = info.text;

            modal.classList.remove("hidden");
        }, 700);
    });
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");

    if (foundCount === totalArtifacts) {
        showWinScreen();
    }
});

function showWinScreen() {
    gameActive = false;
    clearInterval(timerInterval);

    /* 🔊 STOP AMBIENT */
    ambientSound.pause();
    ambientSound.currentTime = 0;

    modal.classList.add("hidden");

    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const rank = getRank(totalSeconds);

    playWinSound();

    winModal.classList.remove("hidden");

    finalTime.textContent = timerText.textContent;
    finalRank.textContent = `Ранг: ${rank}`;
}

restartBtn.addEventListener("click", () => {

    winSound.pause();
    winSound.currentTime = 0;

    /* 🔊 STOP AMBIENT */
    ambientSound.pause();
    ambientSound.currentTime = 0;

    startGame();
});

function resetArtifacts() {
    document.querySelectorAll(".artifact").forEach(a => {
        a.classList.remove("found", "found-anim", "hint-glow");
    });
}

function resetList() {
    document.querySelectorAll(".artifact-list li").forEach(li => {
        li.classList.remove("done");
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");

        if (foundCount === totalArtifacts) {
            showWinScreen();
        }
    }
});

hintBtn.addEventListener("click", () => {
    if (hintsLeft <= 0 || !gameActive) return;

    const items = Array.from(document.querySelectorAll(".artifact"))
        .filter(i => !i.classList.contains("found"));

    if (items.length === 0) return;

    const target = items[Math.floor(Math.random() * items.length)];

    target.classList.add("hint-glow");
    playHintSound();

    setTimeout(() => {
        target.classList.remove("hint-glow");
    }, 2500);

    hintsLeft--;
    hintCount.textContent = `Подсказки: ${hintsLeft}`;

    if (hintsLeft <= 0) {
        hintBtn.disabled = true;
        hintBtn.style.opacity = 0.5;
    }
});

function getRank(seconds) {
    if (seconds <= 40) return "S — архивариус-эксперт";
    if (seconds <= 60) return "A — опытный исследователь";
    if (seconds <= 90) return "B — внимательный студент";
    return "C — начинающий хранитель истории";
}

function showIntroArtifacts() {
    const intro = document.getElementById("introArtifacts");

    intro.classList.remove("hidden");

    setTimeout(() => {
        intro.classList.add("hidden");
    }, 2500);
}
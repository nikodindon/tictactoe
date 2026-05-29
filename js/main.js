/**
 * main.js
 * Point d'entrée principal : initialisation du jeu,
 * écouteurs d'événements et orchestration des modules.
 */

(function () {
    "use strict";

    // ================================================================
    // 1. Référencement des éléments du DOM
    // ================================================================

    var modeSelectScreen = document.getElementById("modeSelectScreen");
    var gameContainer = document.getElementById("gameContainer");

    var btn2Players = document.getElementById("btn2Players");
    var btnVsAI = document.getElementById("btnVsAI");
    var modeToggle = document.getElementById("modeToggle");

    var difficultySelector = document.getElementById("difficultySelector");
    var difficultyIndicator = document.getElementById("difficultyIndicator");
    var diffLabel = document.getElementById("diffLabel");
    var btnEasy = document.getElementById("btnEasy");
    var btnMedium = document.getElementById("btnMedium");
    var btnHard = document.getElementById("btnHard");

    var scoreX = document.getElementById("scoreX");
    var scoreO = document.getElementById("scoreO");
    var scoreDraw = document.getElementById("scoreDraw");

    // --- Win Streak (visible en permanence) ---
    var streakDisplay = document.getElementById("streakDisplay");

    var modalOverlay = document.getElementById("modalOverlay");
    var btnCancelMode = document.getElementById("btnCancelMode");
    var btnConfirmMode = document.getElementById("btnConfirmMode");

    var resetModalOverlay = document.getElementById("resetModalOverlay");
    var btnCancelReset = document.getElementById("btnCancelReset");
    var btnConfirmReset = document.getElementById("btnConfirmReset");
    var resetBtn = document.getElementById("resetBtn");

    var soundToggle = document.getElementById("soundToggle");
    var themeToggle = document.getElementById("themeToggle");

    var statusBar = document.getElementById("statusBar");
    var currentSymbol = document.getElementById("currentSymbol");
    var resultMessage = document.getElementById("resultMessage");
    var restartBtn = document.getElementById("restartBtn");
    var cells = document.querySelectorAll(".cell");

    var confettiContainer = document.getElementById("confettiContainer");

    // --- Modal Stats ---
    var statsModalOverlay = document.getElementById("statsModalOverlay");
    var btnCloseStats = document.getElementById("btnCloseStats");
    var statsBtn = document.getElementById("statsBtn");

    // --- Éléments de stats ---
    var statsTotal = document.getElementById("statsTotal");
    var barX = document.getElementById("barX");
    var barO = document.getElementById("barO");
    var barDraw = document.getElementById("barDraw");
    var valX = document.getElementById("valX");
    var valO = document.getElementById("valO");
    var valDraw = document.getElementById("valDraw");
    var statsStreak = document.getElementById("statsStreak");
    var statsAISec = document.getElementById("statsAISec");
    var aiEasyWins = document.getElementById("aiEasyWins");
    var aiMediumWins = document.getElementById("aiMediumWins");
    var aiHardWins = document.getElementById("aiHardWins");
    var aiEasyRate = document.getElementById("aiEasyRate");
    var aiMediumRate = document.getElementById("aiMediumRate");
    var aiHardRate = document.getElementById("aiHardRate");

    // --- Historique des parties ---
    var historyList = document.getElementById("historyList");

    // ================================================================
    // 2. Configuration des modules avec les éléments DOM
    // ================================================================

    // Configurer AUDIO
    AUDIO.setSoundToggleElement(soundToggle);

    // Configurer EFFECTS
    EFFECTS.setConfettiContainer(confettiContainer);
    EFFECTS.setLegendaryContainer(confettiContainer);

    // Configurer UI avec tous les éléments nécessaires
    var uiElements = {
        // Écrans
        modeSelectScreen: modeSelectScreen,
        gameContainer: gameContainer,
        // Modals
        modalOverlay: modalOverlay,
        resetModalOverlay: resetModalOverlay,
        statsModalOverlay: statsModalOverlay,
        // Scores
        scoreX: scoreX,
        scoreO: scoreO,
        scoreDraw: scoreDraw,
        // Stats
        statsTotal: statsTotal,
        barX: barX,
        barO: barO,
        barDraw: barDraw,
        valX: valX,
        valO: valO,
        valDraw: valDraw,
        statsStreak: statsStreak,
        statsAISec: statsAISec,
        // Streak visible (top-bar)
        streakDisplay: streakDisplay,
        // Historique
        historyList: historyList,
        aiEasyWins: aiEasyWins,
        aiMediumWins: aiMediumWins,
        aiHardWins: aiHardWins,
        aiEasyRate: aiEasyRate,
        aiMediumRate: aiMediumRate,
        aiHardRate: aiHardRate,
        // Jeu
        cells: cells,
        statusBar: statusBar,
        currentSymbol: currentSymbol,
        resultMessage: resultMessage,
        restartBtn: restartBtn,
        difficultySelector: difficultySelector,
        difficultyIndicator: difficultyIndicator,
        diffLabel: diffLabel,
        themeToggle: themeToggle,
        // Variables dynamiques (mises à jour par GAME)
        get scores() { return GAME.getBoard === undefined ? _scores : _scores; },
        set scores(val) { _scores = val; },
        get stats() { return _stats; },
        set stats(val) { _stats = val; },
        get gameMode() { return GAME.getGameMode(); },
        set gameMode(val) { GAME.setGameMode(val); },
        get difficulty() { return GAME.getDifficulty(); },
        set difficulty(val) { GAME.setDifficulty(val); },
        get currentPlayer() { return GAME.getCurrentPlayer(); },
        set currentPlayer(val) { GAME.setCurrentPlayer(val); },
    };

    // Variables de stockage pour UI
    var _scores = null;
    var _stats = null;

    // Ajouter des méthodes pour que UI puisse accéder aux scores et stats
    UI.setElements(uiElements);

    // Configurer GAME
    GAME.configure({
        getCells: function () { return cells; },
    });

    // ================================================================
    // 3. Chargement de la persistance
    // ================================================================

    _scores = STORAGE.loadScores();
    _stats = STORAGE.loadStats();

    STORAGE.loadTheme(themeToggle);

    // Charger l'historique des parties
    var initialHistory = STORAGE.loadHistory();

    UI.updateScoreDisplay();

    // ================================================================
    // 4. Écouteurs d'événements
    // ================================================================

    // --- Sélection du mode ---
    btn2Players.addEventListener("click", function () {
        GAME.startGame("2P");
    });

    btnVsAI.addEventListener("click", function () {
        GAME.startGame("AI");
    });

    // --- Cellules du jeu ---
    for (var i = 0; i < cells.length; i++) {
        (function (cell, index) {
            cell.addEventListener("click", function () {
                GAME.handleCellClick(cell, index);
            });
        })(cells[i], i);
    }

    // --- Rejouer ---
    restartBtn.addEventListener("click", function () {
        GAME.initGame();
    });

    // --- Modal changement de mode ---
    modeToggle.addEventListener("click", function () {
        UI.showModal();
    });

    btnCancelMode.addEventListener("click", function () {
        UI.hideModal();
    });

    btnConfirmMode.addEventListener("click", function () {
        var newMode = GAME.getGameMode() === "2P" ? "AI" : "2P";
        GAME.switchMode(newMode);
    });

    // Fermer le modal en cliquant sur l'overlay
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) UI.hideModal();
    });

    // --- Reset des scores ---
    resetBtn.addEventListener("click", function () {
        UI.showResetModal();
    });

    btnCancelReset.addEventListener("click", function () {
        UI.hideResetModal();
    });

    btnConfirmReset.addEventListener("click", function () {
        GAME.resetScoresAndStats();
        _scores = { x: 0, o: 0, draw: 0 };
        _stats = STORAGE.getDefaultStats();
        STORAGE.saveHistory([]);
        UI.updateScoreDisplay();
        UI.hideResetModal();
        AUDIO.playSound("click");
    });

    // Fermer le modal de reset en cliquant sur l'overlay
    resetModalOverlay.addEventListener("click", function (e) {
        if (e.target === resetModalOverlay) UI.hideResetModal();
    });

    // --- Toggle son ---
    soundToggle.addEventListener("click", function () {
        AUDIO.toggleSound();
    });

    // --- Toggle thème ---
    themeToggle.addEventListener("click", function () {
        UI.toggleTheme();
    });

    // --- Modal Statistiques ---
    statsBtn.addEventListener("click", function () {
        UI.openStatsModal();
    });

    btnCloseStats.addEventListener("click", function () {
        UI.closeStatsModal();
    });

    statsModalOverlay.addEventListener("click", function (e) {
        if (e.target === statsModalOverlay) UI.closeStatsModal();
    });

    // --- Difficulté ---
    btnEasy.addEventListener("click", function () {
        setDifficulty("easy");
    });

    btnMedium.addEventListener("click", function () {
        setDifficulty("medium");
    });

    btnHard.addEventListener("click", function () {
        setDifficulty("hard");
    });

    // ================================================================
    // 5. Fonctions utilitaires locales
    // ================================================================

    /**
     * Change la difficulté et réinitialise la partie.
     * @param {string} newDiff - "easy", "medium", "hard"
     */
    function setDifficulty(newDiff) {
        if (newDiff === GAME.getDifficulty()) return;
        GAME.setDifficulty(newDiff);
        UI.updateDifficultyUI();
        UI.showDifficultyMessage(newDiff);
        GAME.initGame();
    }

    // ================================================================
    // 6. Initialisation
    // ================================================================

    // Afficher l'écran de sélection du mode
    UI.showModeSelection();

})();

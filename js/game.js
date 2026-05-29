/**
 * game.js
 * Logique core du jeu : état du plateau, gestion des clics, détection de victoire,
 * fin de partie, initialisation et changement de mode.
 */

window.GAME = (function (CONSTANTS, STORAGE, AUDIO, EFFECTS, AI, UI) {
    "use strict";

    // ------------------------------------------------------------------
    // État du jeu (variables internes)
    // ------------------------------------------------------------------

    var board = [];
    var currentPlayer = "X";
    var gameActive = false;
    var gameMode = "";
    var difficulty = "hard";

    // ------------------------------------------------------------------
    // Configuration
    // ------------------------------------------------------------------

    /** Configure l'instance de jeu (liens DOM nécessaires au jeu) */
    function configure(el) {
        // NOTE : ne pas appeler UI.setElements ici !
        // main.js configure déjà UI avec tous les éléments.
        // On garde juste les éléments spécifiques à GAME.
        _getCells = el.getCells;
    }

    /** Accès interne aux cellules (pour UI.getCells() dans endGame) */
    var _getCells = null;

    // ------------------------------------------------------------------
    // Démarrage / initialisation
    // ------------------------------------------------------------------

    /**
     * Initialise le jeu avec le mode sélectionné.
     * @param {string} mode - "2P" ou "AI"
     */
    function startGame(mode) {
        gameMode = mode;
        gameActive = true;
        currentPlayer = "X";

        UI.updateDifficultyVisibility();
        UI.hideModeSelection();
        initGame();
    }

    /** Initialise / réinitialise la partie en cours */
    function initGame() {
        board = Array(9).fill("");
        currentPlayer = "X";
        gameActive = true;

        UI.resetBoardDisplay();
        UI.hideRestartButton();

        UI.updatePlayerIndicator();
        UI.updateDifficultyUI();
    }

    // ------------------------------------------------------------------
    // Changement de mode
    // ------------------------------------------------------------------

    /** Change de mode avec confirmation. Les scores NE sont PAS réinitialisés. */
    function switchMode(newMode) {
        UI.hideModal();
        gameMode = newMode;

        board = Array(9).fill("");
        currentPlayer = "X";
        gameActive = true;

        UI.resetBoardDisplay();
        UI.hideRestartButton();

        UI.updateDifficultyVisibility();
        UI.updatePlayerIndicator();
        UI.updateDifficultyUI();
    }

    // ------------------------------------------------------------------
    // Gestion des clics
    // ------------------------------------------------------------------

    /**
     * Gère le clic sur une cellule.
     * @param {HTMLElement} cell - La cellule cliquée
     * @param {number} index - Index de la cellule (0-8)
     */
    function handleCellClick(cell, index) {
        if (board[index] !== "" || !gameActive) return;

        // En mode IA, l'humain ne peut pas jouer en tant que O
        if (gameMode === "AI" && currentPlayer === "O") return;

        AUDIO.playSound("click");

        board[index] = currentPlayer;
        placeSymbol(cell, currentPlayer);
        cell.classList.add("taken");

        var winResult = checkWinner();
        if (winResult) {
            endGame(winResult);
            return;
        }

        if (checkDraw()) {
            endGame(null);
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        UI.updatePlayerIndicator();

        // Si c'est au tour de l'IA, jouer automatiquement
        if (gameMode === "AI" && currentPlayer === "O") {
            setTimeout(function () {
                makeAIMove();
            }, 400);
        }
    }

    /**
     * Place le symbole visuel dans une cellule.
     * @param {HTMLElement} cell - La cellule cible
     * @param {string} symbol - "X" ou "O"
     */
    function placeSymbol(cell, symbol) {
        var span = document.createElement("span");
        span.classList.add(symbol === "X" ? "symbol-x" : "symbol-o");
        span.textContent = symbol;
        cell.appendChild(span);
    }

    // ------------------------------------------------------------------
    // IA
    // ------------------------------------------------------------------

    /** Effectue le coup de l'IA (O) */
    function makeAIMove() {
        if (!gameActive) return;

        var bestMove = AI.getBestMove(board, difficulty);

        if (bestMove !== null) {
            var cell = _getCells()[bestMove];
            board[bestMove] = "O";
            placeSymbol(cell, "O");
            cell.classList.add("taken");

            AUDIO.playSound("click");

            var winResult = checkWinner();
            if (winResult) {
                endGame(winResult);
                return;
            }

            if (checkDraw()) {
                endGame(null);
                return;
            }

            currentPlayer = "X";
            UI.updatePlayerIndicator();
        }
    }

    // ------------------------------------------------------------------
    // Détection de fin de partie
    // ------------------------------------------------------------------

    /**
     * Vérifie s'il y a un gagnant sur le plateau.
     * @returns {Object|null} { winner: "X"|"O", combo: [...] } ou null
     */
    function checkWinner() {
        var combos = CONSTANTS.WINNING_COMBOS;
        for (var i = 0; i < combos.length; i++) {
            var combo = combos[i];
            var a = combo[0], b = combo[1], c = combo[2];
            if (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                return { winner: board[a], combo: combo };
            }
        }
        return null;
    }

    /** Vérifie si le plateau est plein (match nul) */
    function checkDraw() {
        for (var i = 0; i < board.length; i++) {
            if (board[i] === "") return false;
        }
        return true;
    }

    // ------------------------------------------------------------------
    // Statistiques
    // ------------------------------------------------------------------

    /**
     * Enregistre la fin d'une partie dans les statistiques.
     * @param {string|null} result - "x", "o", ou null (match nul)
     */
    function recordGameResult(result) {
        var stats = UI.getStats();
        stats.totalGames++;

        if (gameMode === "AI") {
            // Stats IA par difficulté
            var diff = stats.aiByDiff[difficulty];
            diff.games++;

            if (result === "x") {
                diff.wins++;
                // Le joueur a gagné → augmente la win streak
                stats.winStreak++;
                if (stats.winStreak > stats.bestWinStreak) {
                    stats.bestWinStreak = stats.winStreak;
                }
            } else {
                // L'IA a gagné ou match nul → reset la win streak
                stats.winStreak = 0;
            }
        } else {
            // Mode 2 joueurs : simple win streak global
            if (result === "x" || result === "o") {
                stats.winStreak++;
                if (stats.winStreak > stats.bestWinStreak) {
                    stats.bestWinStreak = stats.winStreak;
                }
            } else {
                stats.winStreak = 0;
            }
        }

        STORAGE.saveStats(stats);
    }

    // ------------------------------------------------------------------
    // Fin de partie
    // ------------------------------------------------------------------

    /**
     * Termine la partie avec animations, sons et statistiques.
     * @param {Object|null} winResult - Objet { winner, combo } ou null pour match nul
     */
    function endGame(winResult) {
        gameActive = false;

        var resultKey = winResult
            ? (winResult.winner === "X" ? "x" : "o")
            : null;

        if (winResult) {
            var winner = winResult.winner;
            var combo = winResult.combo;

            EFFECTS.highlightWinningCells(combo);

            // Incrémenter le score (x ou o)
            UI.incrementScore(winner === "X" ? "x" : "o");

            // Jouer le son approprié
            if (winner === "X") {
                AUDIO.playSound("win");

                // Confettis si le joueur a battu l'IA (sauf niveau facile)
                if (gameMode === "AI" && difficulty !== "easy") {
                    EFFECTS.launchConfetti(80);
                    // Texte "LÉGENDAIRE" si Hard ou Medium
                    if (difficulty !== "easy") {
                        setTimeout(function () {
                            EFFECTS.showLegendaryText();
                        }, 300);
                    }
                }
            } else {
                AUDIO.playSound("lose");
            }

            // Afficher le message de résultat
            UI.showResultMessage(winner === "X" ? "x" : "o", winResult);
        } else {
            // Match nul
            UI.incrementScore("draw");
            AUDIO.playSound("draw");
            UI.showResultMessage("draw", null);
        }

        UI.showRestartButton();

        // Enregistrer la partie dans les statistiques
        recordGameResult(resultKey);

        // Enregistrer dans l'historique
        UI.recordHistory(resultKey, gameMode, difficulty);

        // Mettre à jour l'affichage du win streak
        UI.updateStreakDisplay();
    }

    // ------------------------------------------------------------------
    // Reset des scores (utilisé par main.js)
    // ------------------------------------------------------------------

    /** Réinitialise les scores et statistiques */
    function resetScoresAndStats() {
        var newScores = { x: 0, o: 0, draw: 0 };
        var newStats = STORAGE.getDefaultStats();

        STORAGE.saveScores(newScores);
        STORAGE.saveStats(newStats);

        // Mettre à jour les variables internes
        UI.setElementsForScores(newScores, newStats, gameMode, difficulty);

        UI.updateScoreDisplay();
    }

    // ------------------------------------------------------------------
    // Accesseurs (pour main.js)
    // ------------------------------------------------------------------

    function getBoard() { return board; }
    function setBoard(b) { board = b; }
    function getCurrentPlayer() { return currentPlayer; }
    function setCurrentPlayer(p) { currentPlayer = p; }
    function getGameActive() { return gameActive; }
    function setGameActive(a) { gameActive = a; }
    function getGameMode() { return gameMode; }
    function setGameMode(m) { gameMode = m; }
    function getDifficulty() { return difficulty; }
    function setDifficulty(d) { difficulty = d; }

    return {
        // Configuration
        configure: configure,
        // Démarrage
        startGame: startGame,
        initGame: initGame,
        // Changement de mode
        switchMode: switchMode,
        // Gestion des clics
        handleCellClick: handleCellClick,
        // IA
        makeAIMove: makeAIMove,
        // Reset
        resetScoresAndStats: resetScoresAndStats,
        // Accesseurs
        getBoard: getBoard,
        setBoard: setBoard,
        getCurrentPlayer: getCurrentPlayer,
        setCurrentPlayer: setCurrentPlayer,
        getGameActive: getGameActive,
        setGameActive: setGameActive,
        getGameMode: getGameMode,
        setGameMode: setGameMode,
        getDifficulty: getDifficulty,
        setDifficulty: setDifficulty,
        recordGameResult: recordGameResult,
    };
})(window.CONSTANTS, window.STORAGE, window.AUDIO, window.EFFECTS, window.AI, window.UI);

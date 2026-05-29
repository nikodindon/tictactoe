/**
 * ui.js
 * Gestion de toute l'interface utilisateur : modals, scores, stats,
 * thème, indicateur de joueur, difficulté, messages de résultat.
 */

window.UI = (function (CONSTANTS, STORAGE, AUDIO) {
    "use strict";

    // ------------------------------------------------------------------
    // Éléments DOM (doivent être définis par main.js via setElements)
    // ------------------------------------------------------------------

    var elements = {};

    /** Configure tous les éléments DOM nécessaires */
    function setElements(el) {
        elements = el;
    }

    // ------------------------------------------------------------------
    // Écran de sélection du mode
    // ------------------------------------------------------------------

    /** Affiche l'écran de sélection du mode */
    function showModeSelection() {
        elements.modeSelectScreen.style.display = "block";
        elements.gameContainer.style.display = "none";
    }

    /** Cache l'écran de sélection du mode */
    function hideModeSelection() {
        elements.modeSelectScreen.style.display = "none";
        elements.gameContainer.style.display = "block";
    }

    // ------------------------------------------------------------------
    // Modals
    // ------------------------------------------------------------------

    /** Affiche le modal de confirmation de changement de mode */
    function showModal() {
        elements.modalOverlay.style.display = "flex";
    }

    /** Cache le modal de confirmation de changement de mode */
    function hideModal() {
        elements.modalOverlay.style.display = "none";
    }

    /** Affiche le modal de confirmation de reset des scores */
    function showResetModal() {
        elements.resetModalOverlay.style.display = "flex";
    }

    /** Cache le modal de confirmation de reset des scores */
    function hideResetModal() {
        elements.resetModalOverlay.style.display = "none";
    }

    /** Affiche le modal de statistiques */
    function openStatsModal() {
        updateStatsDisplay();
        elements.statsModalOverlay.style.display = "flex";
        AUDIO.playSound("click");
    }

    /** Cache le modal de statistiques */
    function closeStatsModal() {
        elements.statsModalOverlay.style.display = "none";
    }

    // ------------------------------------------------------------------
    // Scores
    // ------------------------------------------------------------------

    /** Met à jour l'affichage des scores dans le DOM */
    function updateScoreDisplay() {
        elements.scoreX.textContent = elements.scores.x;
        elements.scoreO.textContent = elements.scores.o;
        elements.scoreDraw.textContent = elements.scores.draw;
    }

    /** Incrémente le score et sauvegarde dans localStorage */
    function incrementScore(result) {
        if (result === "x") {
            elements.scores.x++;
        } else if (result === "o") {
            elements.scores.o++;
        } else {
            elements.scores.draw++;
        }

        updateScoreDisplay();
        STORAGE.saveScores(elements.scores);
    }

    // ------------------------------------------------------------------
    // Win Streak visible en permanence
    // ------------------------------------------------------------------

    /**
     * Met à jour l'affichage du win streak visible dans la top-bar.
     */
    function updateStreakDisplay() {
        if (elements.streakDisplay) {
            var streak = elements.stats.winStreak || 0;
            if (streak > 0) {
                elements.streakDisplay.textContent = "Série : " + streak + " 🔥";
                elements.streakDisplay.classList.add("active");
            } else {
                elements.streakDisplay.textContent = "";
                elements.streakDisplay.classList.remove("active");
            }
        }
    }

    // ------------------------------------------------------------------
    // Statistiques détaillées
    // ------------------------------------------------------------------

    /**
     * Met à jour les variables internes pour scores/stats (reset).
     * @param {Object} scores - Objets scores
     * @param {Object} stats - Objets stats
     * @param {string} mode - "2P" ou "AI"
     * @param {string} diff - difficulté
     */
    function setElementsForScores(scores, stats, mode, diff) {
        elements.scores = scores;
        elements.stats = stats;
        elements.gameMode = mode;
        elements.difficulty = diff;
    }

    /**
     * Met à jour l'affichage des statistiques dans le modal.
     * @param {Object} stats - Objets stats
     */
    function updateStatsDisplay() {
        var total = elements.scores.x + elements.scores.o + elements.scores.draw;

        // Total des parties
        elements.statsTotal.textContent = elements.stats.totalGames;

        // Barres de résultats avec pourcentages
        var xPct  = total > 0 ? Math.round((elements.scores.x / total) * 100) : 0;
        var oPct  = total > 0 ? Math.round((elements.scores.o / total) * 100) : 0;
        var drawPct = total > 0 ? Math.round((elements.scores.draw / total) * 100) : 0;

        elements.barX.style.width  = xPct + "%";
        elements.barO.style.width  = oPct + "%";
        elements.barDraw.style.width = drawPct + "%";

        elements.valX.textContent  = elements.scores.x + " (" + xPct + "%)";
        elements.valO.textContent  = elements.scores.o + " (" + oPct + "%)";
        elements.valDraw.textContent = elements.scores.draw + " (" + drawPct + "%)";

        // Meille série de victoires
        elements.statsStreak.innerHTML =
            '<span class="streak-value">' + elements.stats.bestWinStreak + '</span>' +
            '<span class="streak-label">victoires d\'affilée</span>';

        // Stats IA par difficulté (visible si on joue contre l'IA ou qu'il y a des stats)
        if (elements.gameMode === "AI" ||
            elements.stats.aiByDiff.easy.games > 0 ||
            elements.stats.aiByDiff.medium.games > 0 ||
            elements.stats.aiByDiff.hard.games > 0) {
            elements.statsAISec.style.display = "block";
        } else {
            elements.statsAISec.style.display = "none";
        }

        var easy = elements.stats.aiByDiff.easy;
        var medium = elements.stats.aiByDiff.medium;
        var hard = elements.stats.aiByDiff.hard;

        elements.aiEasyWins.textContent  = easy.wins;
        elements.aiMediumWins.textContent = medium.wins;
        elements.aiHardWins.textContent   = hard.wins;

        elements.aiEasyRate.textContent  = easy.games > 0
            ? Math.round((easy.wins / easy.games) * 100) + "%" : "N/A";
        elements.aiMediumRate.textContent = medium.games > 0
            ? Math.round((medium.wins / medium.games) * 100) + "%" : "N/A";
        elements.aiHardRate.textContent   = hard.games > 0
            ? Math.round((hard.wins / hard.games) * 100) + "%" : "N/A";

        // --- Historique des parties ---
        updateHistoryDisplay();
    }

    // ------------------------------------------------------------------
    // Historique des parties
    // ------------------------------------------------------------------

    /**
     * Met à jour l'affichage de l'historique des 8-10 dernières parties
     * dans le modal de statistiques.
     */
    function updateHistoryDisplay() {
        if (!elements.historyList) return;

        var history = STORAGE.loadHistory();
        elements.historyList.innerHTML = "";

        if (history.length === 0) {
            elements.historyList.innerHTML =
                '<div class="history-empty">Aucune partie jouée</div>';
            return;
        }

        for (var i = 0; i < history.length; i++) {
            var entry = history[i];
            var text = STORAGE.formatHistoryEntry(
                entry.result, entry.mode, entry.difficulty
            );

            var li = document.createElement("li");
            li.className = "history-item";

            // Icône selon le résultat
            var icon = entry.result === "x" ? "✅" :
                       entry.result === "o" ? "❌" : "🤝";

            // Couleurs par type de partie
            var badgeClass = entry.mode === "AI" ? "badge-ai" : "badge-2p";
            var badgeText = entry.mode === "AI" ? "IA" : "2P";

            li.innerHTML =
                '<span class="history-icon">' + icon + '</span>' +
                '<span class="history-result">' + text + '</span>' +
                '<span class="history-badge ' + badgeClass + '">' + badgeText + '</span>';

            elements.historyList.appendChild(li);
        }
    }

    // ------------------------------------------------------------------
    // Indicateur de joueur
    // ------------------------------------------------------------------

    /** Met à jour l'indicateur du joueur actuel */
    function updatePlayerIndicator() {
        elements.currentSymbol.textContent = elements.currentPlayer;

        if (elements.currentPlayer === "O") {
            elements.currentSymbol.classList.add("o-player");
        } else {
            elements.currentSymbol.classList.remove("o-player");
        }
    }

    // ------------------------------------------------------------------
    // Difficulté
    // ------------------------------------------------------------------

    /** Met à jour l'apparence du sélecteur de difficulté */
    function updateDifficultyUI() {
        var btns = elements.gameContainer.querySelectorAll(".diff-btn");
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove("active");
        }
        var activeBtn = elements.gameContainer.querySelector(
            '.diff-btn[data-diff="' + elements.difficulty + '"]'
        );
        if (activeBtn) activeBtn.classList.add("active");
    }

    /**
     * Affiche un message temporaire de changement de niveau.
     * @param {string} newDiff - Nouvelle difficulté
     */
    function showDifficultyMessage(newDiff) {
        var names = CONSTANTS.DIFFICULTY_NAMES;

        if (elements.difficultyTimer) {
            clearTimeout(elements.difficultyTimer);
        }

        elements.diffLabel.textContent = "Niveau : " + names[newDiff];
        elements.diffLabel.className = "diff-label " + newDiff;
        elements.difficultyIndicator.classList.add("show");

        elements.difficultyTimer = setTimeout(function () {
            elements.difficultyIndicator.classList.remove("show");
            elements.difficultyTimer = null;
        }, 1500);
    }

    // ------------------------------------------------------------------
    // Visibilité du sélecteur de difficulté
    // ------------------------------------------------------------------

    /** Affiche ou cache le sélecteur de difficulté selon le mode */
    function updateDifficultyVisibility() {
        if (elements.gameMode === "AI") {
            elements.difficultySelector.style.display = "flex";
        } else {
            elements.difficultySelector.style.display = "none";
        }
    }

    // ------------------------------------------------------------------
    // Thème
    // ------------------------------------------------------------------

    /** Bascule entre le thème Cyber et Neon Retro */
    function toggleTheme() {
        var isNeon = document.body.classList.toggle("theme-neon");
        elements.themeToggle.classList.toggle("active-neon", isNeon);
        STORAGE.saveTheme(isNeon ? "neon" : "cyber");
        AUDIO.playSound("click");
    }

    // ------------------------------------------------------------------
    // Message de résultat
    // ------------------------------------------------------------------

    /**
     * Affiche le message de résultat de fin de partie.
     * @param {string} result - "x", "o" ou "draw"
     * @param {Object} winResult - Objet { winner, combo } ou null
     */
    function showResultMessage(result, winResult) {
        var gameMode = elements.gameMode;
        var difficulty = elements.difficulty;

        if (winResult) {
            var winner = winResult.winner;
            var messages = CONSTANTS.WIN_MESSAGES.AI;

            if (gameMode === "AI") {
                var msg;
                if (winner === "X") {
                    // Le joueur a gagné
                    if (difficulty === "easy") {
                        msg = messages.easy.win;
                    } else if (difficulty === "medium") {
                        msg = messages.medium.win;
                    } else if (difficulty === "hard") {
                        msg = messages.hard.win;
                    } else {
                        msg = messages.default.win;
                    }
                    elements.resultMessage.innerHTML =
                        '<span class="winner-text">' + msg + '</span>';
                } else {
                    // L'IA a gagné
                    if (difficulty === "easy") {
                        msg = messages.easy.lose;
                    } else if (difficulty === "medium") {
                        msg = messages.medium.lose;
                    } else if (difficulty === "hard") {
                        msg = messages.hard.lose;
                    } else {
                        msg = messages.default.lose;
                    }
                    elements.resultMessage.innerHTML =
                        '<span class="winner-text o-winner">' + msg + '</span>';
                }
            } else {
                // Mode 2 joueurs
                elements.resultMessage.innerHTML =
                    '<span class="winner-text ' +
                    (winner === "O" ? "o-winner" : "") +
                    '">🏆 Le joueur ' + winner + ' a gagné !</span>';
            }
        } else {
            // Match nul
            elements.resultMessage.innerHTML =
                '<span class="draw-text">🤝 Match nul !</span>';
        }

        elements.resultMessage.classList.add("show");
    }

    // ------------------------------------------------------------------
    // Bouton Rejouer
    // ------------------------------------------------------------------

    /** Affiche le bouton Rejouer */
    function showRestartButton() {
        elements.restartBtn.style.display = "inline-block";
    }

    /** Cache le bouton Rejouer */
    function hideRestartButton() {
        elements.restartBtn.style.display = "none";
    }

    // ------------------------------------------------------------------
    // Nettoyage de la grille
    // ------------------------------------------------------------------

    /** Réinitialise l'affichage de la grille (cellules) */
    function resetBoardDisplay() {
        var cells = elements.cells;
        for (var i = 0; i < cells.length; i++) {
            cells[i].textContent = "";
            cells[i].classList.remove("taken", "winner");
            var symbolX = cells[i].querySelector(".symbol-x");
            var symbolO = cells[i].querySelector(".symbol-o");
            if (symbolX) symbolX.remove();
            if (symbolO) symbolO.remove();
        }
    }

    return {
        // Configuration
        setElements: setElements,
        // Modals
        showModal: showModal,
        hideModal: hideModal,
        showResetModal: showResetModal,
        hideResetModal: hideResetModal,
        openStatsModal: openStatsModal,
        closeStatsModal: closeStatsModal,
        // Écran de mode
        showModeSelection: showModeSelection,
        hideModeSelection: hideModeSelection,
        // Scores
        updateScoreDisplay: updateScoreDisplay,
        incrementScore: incrementScore,
        setElementsForScores: setElementsForScores,
        // Stats
        updateStatsDisplay: updateStatsDisplay,
        updateStreakDisplay: updateStreakDisplay,
        // Joueur
        updatePlayerIndicator: updatePlayerIndicator,
        // Difficulté
        updateDifficultyUI: updateDifficultyUI,
        showDifficultyMessage: showDifficultyMessage,
        updateDifficultyVisibility: updateDifficultyVisibility,
        // Thème
        toggleTheme: toggleTheme,
        // Résultat
        showResultMessage: showResultMessage,
        // Rejouer
        showRestartButton: showRestartButton,
        hideRestartButton: hideRestartButton,
        // Grille
        resetBoardDisplay: resetBoardDisplay,
        // Accès aux stats (pour updateStatsDisplay)
        getScores: function () { return elements.scores; },
        getStats: function () { return elements.stats; },
        getGameMode: function () { return elements.gameMode; },
        getDifficulty: function () { return elements.difficulty; },
        // Enregistrer une partie dans l'historique
        recordHistory: function (result, mode, difficulty) {
            STORAGE.addHistoryEntry({
                result: result,
                mode: mode,
                difficulty: difficulty,
            });
        },
    };
})(window.CONSTANTS, window.STORAGE, window.AUDIO);

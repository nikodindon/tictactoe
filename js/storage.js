/**
 * storage.js
 * Gestion de la persistance (localStorage) : scores, stats, thème.
 */

window.STORAGE = (function (CONSTANTS) {
    "use strict";

    // ------------------------------------------------------------------
    // Scores
    // ------------------------------------------------------------------

    /** Charge les scores depuis localStorage */
    function loadScores() {
        try {
            var data = localStorage.getItem(CONSTANTS.SCORES_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn("Impossible de charger les scores", e);
        }
        return { x: 0, o: 0, draw: 0 };
    }

    /** Sauvegarde les scores dans localStorage */
    function saveScores(scores) {
        try {
            localStorage.setItem(CONSTANTS.SCORES_KEY, JSON.stringify(scores));
        } catch (e) {
            console.warn("Impossible de sauvegarder les scores", e);
        }
    }

    // ------------------------------------------------------------------
    // Statistiques détaillées
    // ------------------------------------------------------------------

    /** Crée un objet stats par défaut */
    function getDefaultStats() {
        return {
            totalGames: 0,
            winStreak: 0,
            bestWinStreak: 0,
            aiByDiff: {
                easy:   { games: 0, wins: 0 },
                medium: { games: 0, wins: 0 },
                hard:   { games: 0, wins: 0 },
            },
        };
    }

    /** Charge les statistiques détaillées depuis localStorage */
    function loadStats() {
        try {
            var data = localStorage.getItem(CONSTANTS.STATS_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn("Impossible de charger les stats", e);
        }
        return getDefaultStats();
    }

    /** Sauvegarde les statistiques détaillées dans localStorage */
    function saveStats(stats) {
        try {
            localStorage.setItem(CONSTANTS.STATS_KEY, JSON.stringify(stats));
        } catch (e) {
            console.warn("Impossible de sauvegarder les stats", e);
        }
    }

    // ------------------------------------------------------------------
    // Historique des parties
    // ------------------------------------------------------------------

    /** Crée un objet historique par défaut (tableau vide) */
    function getDefaultHistory() {
        return [];
    }

    /**
     * Charge l'historique des parties depuis localStorage.
     * @returns {Array} Tableau des dernières parties
     */
    function loadHistory() {
        try {
            var data = localStorage.getItem(CONSTANTS.HISTORY_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn("Impossible de charger l'historique", e);
        }
        return getDefaultHistory();
    }

    /**
     * Sauvegarde l'historique dans localStorage (max HISTORY_MAX entrées).
     * @param {Array} history - Tableau des parties
     */
    function saveHistory(history) {
        try {
            // Garder seulement les HISTORY_MAX dernières entrées
            var trimmed = history.slice(0, CONSTANTS.HISTORY_MAX);
            localStorage.setItem(CONSTANTS.HISTORY_KEY, JSON.stringify(trimmed));
        } catch (e) {
            console.warn("Impossible de sauvegarder l'historique", e);
        }
    }

    /**
     * Ajoute une entrée dans l'historique.
     * @param {Object} entry - { result: "x"|"o"|"draw", mode: "2P"|"AI", difficulty?: string }
     */
    function addHistoryEntry(entry) {
        var history = loadHistory();
        history.unshift(entry);
        saveHistory(history);
    }

    /**
     * Retourne le texte lisible d'un résultat.
     * @param {string} result - "x", "o", "draw"
     * @param {string} mode - "2P" ou "AI"
     * @param {string} difficulty - difficulté (si AI)
     * @returns {string} Texte formaté
     */
    function formatHistoryEntry(result, mode, difficulty) {
        var diffLabel = (mode === "AI" && difficulty)
            ? CONSTANTS.DIFFICULTY_NAMES[difficulty]
            : "";

        if (result === "x") {
            return (mode === "AI")
                ? "X gagne contre l'IA " + diffLabel
                : "X gagne";
        } else if (result === "o") {
            return (mode === "AI")
                ? "O (IA) gagne contre X" + (diffLabel ? " (" + diffLabel + ")" : "")
                : "O gagne";
        } else {
            return "Match nul";
        }
    }

    // ------------------------------------------------------------------
    // Thème
    // ------------------------------------------------------------------

    /** Charge le thème depuis localStorage et l'applique */
    function loadTheme(themeToggle) {
        try {
            var theme = localStorage.getItem(CONSTANTS.THEME_KEY);
            if (theme === "neon") {
                document.body.classList.add("theme-neon");
                if (themeToggle) themeToggle.classList.add("active-neon");
            }
        } catch (e) {
            console.warn("Impossible de charger le thème", e);
        }
    }

    /** Sauvegarde le thème dans localStorage */
    function saveTheme(theme) {
        try {
            localStorage.setItem(CONSTANTS.THEME_KEY, theme);
        } catch (e) {
            console.warn("Impossible de sauvegarder le thème", e);
        }
    }

    return {
        loadScores: loadScores,
        saveScores: saveScores,
        getDefaultStats: getDefaultStats,
        loadStats: loadStats,
        saveStats: saveStats,
        loadHistory: loadHistory,
        saveHistory: saveHistory,
        addHistoryEntry: addHistoryEntry,
        formatHistoryEntry: formatHistoryEntry,
        getDefaultHistory: getDefaultHistory,
        loadTheme: loadTheme,
        saveTheme: saveTheme,
    };
})(window.CONSTANTS);

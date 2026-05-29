/**
 * constants.js
 * Définit toutes les constantes globales du jeu.
 */

window.CONSTANTS = (function () {
    "use strict";

    /** Combinaisons gagnantes (indices de la grille 3x3) */
    var WINNING_COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    /** Scores du Minimax */
    var SCORE = {
        AI_WIN: 10,
        HUMAN_WIN: -10,
        DRAW: 0,
    };

    /** Taux d'erreur par difficulté (probabilité de jouer aléatoirement) */
    var ERROR_RATE = {
        easy: 0.80,
        medium: 0.50,
        hard: 0.00,
    };

    /** Clés localStorage pour la persistance */
    var SCORES_KEY = "morpion_ultime_scores_v5";
    var STATS_KEY = "morpion_ultime_stats_v5";
    var THEME_KEY = "morpion_ultime_theme_v5";
    var HISTORY_KEY = "morpion_ultime_history_v6";

    /** Nombre maximal de parties en historique */
    var HISTORY_MAX = 10;

    /** Textes des niveaux de difficulté */
    var DIFFICULTY_NAMES = {
        easy: "😊 Facile",
        medium: "🤔 Moyen",
        hard: "💀 Imbattable",
    };

    /** Messages de résultat (IA) */
    var WIN_MESSAGES = {
        AI: {
            easy: {
                win: "😊 Pas trop mal, mais c'était le niveau Facile !",
                lose: "😄 L'IA a gagné, mais c'était facile… Courage !",
            },
            medium: {
                win: "🏆 Bravo ! Tu as battu l'IA en niveau Moyen !",
                lose: "🤖 L'IA a gagné en niveau Moyen ! Tu peux faire mieux !",
            },
            hard: {
                win: "👑 LÉGENDAIRE ! Tu as battu l'IA en niveau Imbattable !",
                lose: "🤖 Impossible ! L'IA est imbattable sur ce niveau…",
            },
            default: {
                win: "🎉 Tu as battu l'IA ! Impressionnant !",
                lose: "🤖 L'IA a gagné !",
            },
        },
    };

    /** Texte LÉGENDAIRE pour les victoires Hard/Medium */
    var LEGENDARY_TEXT = "⚡ LÉGENDAIRE ! ⚡";

    /** Couleurs des confettis */
    var CONFETTI_COLORS = [
        "#667eea", "#f093fb", "#f5a623", "#64c864",
        "#f06464", "#66ccff", "#ffdd57", "#c084fc",
    ];

    /** Nombre de confettis par défaut */
    var CONFETTI_DEFAULT_COUNT = 60;

    return {
        WINNING_COMBOS: WINNING_COMBOS,
        SCORE: SCORE,
        ERROR_RATE: ERROR_RATE,
        SCORES_KEY: SCORES_KEY,
        STATS_KEY: STATS_KEY,
        THEME_KEY: THEME_KEY,
        HISTORY_KEY: HISTORY_KEY,
        HISTORY_MAX: HISTORY_MAX,
        LEGENDARY_TEXT: LEGENDARY_TEXT,
        DIFFICULTY_NAMES: DIFFICULTY_NAMES,
        WIN_MESSAGES: WIN_MESSAGES,
        CONFETTI_COLORS: CONFETTI_COLORS,
        CONFETTI_DEFAULT_COUNT: CONFETTI_DEFAULT_COUNT,
    };
})();

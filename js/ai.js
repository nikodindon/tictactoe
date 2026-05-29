/**
 * ai.js
 * Intelligence artificielle : Minimax, détection de menaces, gestion de la difficulté.
 */

window.AI = (function (CONSTANTS) {
    "use strict";

    // ------------------------------------------------------------------
    // Détermination du meilleur coup selon la difficulté
    // ------------------------------------------------------------------

    /**
     * Détermine le meilleur coup pour l'IA selon la difficulté.
     * En niveau Moyen, l'IA détecte parfois les menaces immédiates
     * du joueur (2 signes alignés) et les bloque.
     * @param {Array} board - État actuel du plateau
     * @param {string} difficulty - "easy", "medium", "hard"
     * @returns {number|null} Index du meilleur coup
     */
    function getBestMove(board, difficulty) {
        var available = [];
        for (var i = 0; i < 9; i++) {
            if (board[i] === "") available.push(i);
        }

        if (available.length === 0) return null;

        // Niveau difficile : toujours Minimax
        if (difficulty === "hard") {
            return getBestMoveMinimax(board);
        }

        // Niveau moyen : probabilité de bloquer les menaces du joueur
        if (difficulty === "medium") {
            var blockMove = findBlockingMove(board);
            if (blockMove !== null && Math.random() < 0.65) {
                // 65% de chance de bloquer au lieu de jouer aléatoire
                return blockMove;
            }
        }

        // Comportement aléatoire avec probabilité d'erreur
        if (Math.random() < CONSTANTS.ERROR_RATE[difficulty]) {
            return getRandomMove(available);
        }

        return getBestMoveMinimax(board);
    }

    // ------------------------------------------------------------------
    // Détection de menaces (pour bloquer le joueur)
    // ------------------------------------------------------------------

    /**
     * Trouve une cellule où bloquer le joueur pour l'empêcher de gagner.
     * Scanne toutes les combinaisons gagnantes et trouve celle où
     * le joueur a 2 signes et la 3ème case est vide.
     * @param {Array} board - État actuel du plateau
     * @returns {number|null} Index à bloquer ou null
     */
    function findBlockingMove(board) {
        var combos = CONSTANTS.WINNING_COMBOS;
        for (var i = 0; i < combos.length; i++) {
            var combo = combos[i];
            var a = combo[0], b = combo[1], c = combo[2];
            var cellsCombo = [board[a], board[b], board[c]];

            // Compter les signes du joueur (X) et les cases vides
            var xCount = 0;
            var emptyCount = 0;
            for (var j = 0; j < 3; j++) {
                if (cellsCombo[j] === "X") xCount++;
                if (cellsCombo[j] === "") emptyCount++;
            }

            if (xCount === 2 && emptyCount === 1) {
                // Trouver la case vide et la retourner
                if (board[a] === "") return a;
                if (board[b] === "") return b;
                if (board[c] === "") return c;
            }
        }
        return null;
    }

    // ------------------------------------------------------------------
    // Minimax
    // ------------------------------------------------------------------

    /**
     * Algorithme Minimax récursif.
     * L'IA (O) maximise, l'humain (X) minimise.
     * @param {Array} boardState - État du plateau à évaluer
     * @param {number} depth - Profondeur actuelle (non utilisé ici mais utile pour le tie-break)
     * @param {boolean} isMaximizing - true si c'est le tour de l'IA
     * @returns {number} Score du plateau
     */
    function minimax(boardState, depth, isMaximizing) {
        var winner = getWinner(boardState);

        if (winner === "O") return CONSTANTS.SCORE.AI_WIN;
        if (winner === "X") return CONSTANTS.SCORE.HUMAN_WIN;
        if (isBoardFull(boardState)) return CONSTANTS.SCORE.DRAW;

        if (isMaximizing) {
            var maxScore = -Infinity;
            for (var i = 0; i < 9; i++) {
                if (boardState[i] === "") {
                    boardState[i] = "O";
                    var score = minimax(boardState, depth + 1, false);
                    boardState[i] = "";
                    maxScore = Math.max(score, maxScore);
                }
            }
            return maxScore;
        } else {
            var minScore = Infinity;
            for (var i = 0; i < 9; i++) {
                if (boardState[i] === "") {
                    boardState[i] = "X";
                    var score2 = minimax(boardState, depth + 1, true);
                    boardState[i] = "";
                    minScore = Math.min(score2, minScore);
                }
            }
            return minScore;
        }
    }

    /**
     * Calcule le meilleur coup pour l'IA (O) en utilisant Minimax.
     * @param {Array} board - État actuel du plateau
     * @returns {number|null} Index du meilleur coup
     */
    function getBestMoveMinimax(board) {
        var bestScore = -Infinity;
        var bestMove = null;

        for (var i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                var score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    /** Retourne un coup aléatoire parmi les cases disponibles */
    function getRandomMove(available) {
        return available[Math.floor(Math.random() * available.length)];
    }

    // ------------------------------------------------------------------
    // Utilitaires
    // ------------------------------------------------------------------

    /** Vérifie s'il y a un gagnant sur le plateau donné */
    function getWinner(boardState) {
        var combos = CONSTANTS.WINNING_COMBOS;
        for (var i = 0; i < combos.length; i++) {
            var combo = combos[i];
            var a = combo[0], b = combo[1], c = combo[2];
            if (
                boardState[a] !== "" &&
                boardState[a] === boardState[b] &&
                boardState[a] === boardState[c]
            ) {
                return boardState[a];
            }
        }
        return null;
    }

    /** Vérifie si le plateau est plein */
    function isBoardFull(boardState) {
        for (var i = 0; i < boardState.length; i++) {
            if (boardState[i] === "") return false;
        }
        return true;
    }

    return {
        getBestMove: getBestMove,
        findBlockingMove: findBlockingMove,
        minimax: minimax,
        getBestMoveMinimax: getBestMoveMinimax,
        getRandomMove: getRandomMove,
        getWinner: getWinner,
        isBoardFull: isBoardFull,
    };
})(window.CONSTANTS);

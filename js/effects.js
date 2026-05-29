/**
 * effects.js
 * Confettis et mise en surbrillance des cellules gagnantes.
 */

window.EFFECTS = (function (CONSTANTS) {
    "use strict";

    var confettiContainer = null;
    var legendaryContainer = null;

    // ------------------------------------------------------------------
    // Configuration
    // ------------------------------------------------------------------

    /** Définit le conteneur de confettis (élément DOM) */
    function setConfettiContainer(el) {
        confettiContainer = el;
    }

    /** Définit le conteneur de texte LÉGENDAIRE */
    function setLegendaryContainer(el) {
        legendaryContainer = el;
    }

    // ------------------------------------------------------------------
    // Texte "LÉGENDAIRE" (victoire Hard/Medium)
    // ------------------------------------------------------------------

    /**
     * Affiche un texte animé "LÉGENDAIRE !" avec effet de pop + scale.
     */
    function showLegendaryText() {
        if (!legendaryContainer) return;

        var text = document.createElement("div");
        text.className = "legendary-text";
        text.textContent = CONSTANTS.LEGENDARY_TEXT;
        legendaryContainer.appendChild(text);

        // Déclencher l'animation après un court délai
        requestAnimationFrame(function () {
            text.classList.add("show");
        });

        // Retirer l'élément après l'animation
        setTimeout(function () {
            if (text.parentNode) {
                text.classList.add("fade-out");
                setTimeout(function () {
                    if (text.parentNode) text.parentNode.removeChild(text);
                }, 800);
            }
        }, 2000);
    }

    // ------------------------------------------------------------------
    // Confettis
    // ------------------------------------------------------------------

    /**
     * Lance une animation de confettis colorés.
     * @param {number} count - Nombre de confettis (défaut : 60)
     */
    function launchConfetti(count) {
        count = count || CONSTANTS.CONFETTI_DEFAULT_COUNT;
        var colors = CONSTANTS.CONFETTI_COLORS;

        for (var i = 0; i < count; i++) {
            var piece = document.createElement("div");
            piece.classList.add("confetti-piece");

            var left    = Math.random() * 100;
            var color   = colors[Math.floor(Math.random() * colors.length)];
            var size    = Math.random() * 8 + 5;
            var duration = Math.random() * 2 + 1.5;
            var rotation = (Math.random() * 720 - 360) + "deg";
            var delay    = Math.random() * 0.5;

            piece.style.left = left + "%";
            piece.style.backgroundColor = color;
            piece.style.width = size + "px";
            piece.style.height = size + "px";
            piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            piece.style.setProperty("--fall-duration", duration + "s");
            piece.style.setProperty("--rotation", rotation);
            piece.style.setProperty("--delay", delay + "s");

            confettiContainer.appendChild(piece);

            // Déclencher l'animation après le délai
            (function (el, ms) {
                setTimeout(function () {
                    el.classList.add("falling");
                }, ms);
            })(piece, delay * 1000);

            // Supprimer après l'animation
            (function (el, totalMs) {
                setTimeout(function () {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, totalMs);
            })(piece, (delay + duration) * 1000 + 200);
        }
    }

    // ------------------------------------------------------------------
    // Mise en surbrillance
    // ------------------------------------------------------------------

    /**
     * Met en surbrillance les cellules de la combinaison gagnante.
     * @param {Array} combo - Tableau d'indices à surligner
     */
    function highlightWinningCells(combo) {
        for (var i = 0; i < combo.length; i++) {
            var cells = document.querySelectorAll(".cell");
            if (cells[combo[i]]) {
                cells[combo[i]].classList.add("winner");
            }
        }
    }

    return {
        // Légendaire
        showLegendaryText: showLegendaryText,
        setLegendaryContainer: setLegendaryContainer,
        // Confettis
        launchConfetti: launchConfetti,
        // Surbrillance
        highlightWinningCells: highlightWinningCells,
        // Configuration
        setConfettiContainer: setConfettiContainer,
    };
})(window.CONSTANTS);

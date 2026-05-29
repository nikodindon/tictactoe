/**
 * audio.js
 * Gestion des sons via l'API Web Audio (oscillateurs).
 */

window.AUDIO = (function () {
    "use strict";

    var soundEnabled = true;
    var soundToggleEl = null;

    // ------------------------------------------------------------------
    // Configuration
    // ------------------------------------------------------------------

    /** Définit l'élément DOM du bouton toggle son */
    function setSoundToggleElement(el) {
        soundToggleEl = el;
    }

    /** Retourne l'état actuel du son */
    function isEnabled() {
        return soundEnabled;
    }

    // ------------------------------------------------------------------
    // Fonctions de son
    // ------------------------------------------------------------------

    /**
     * Joue un son court via l'API Web Audio.
     * @param {string} type - "click", "win", "lose", "draw"
     */
    function playSound(type) {
        if (!soundEnabled) return;

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        switch (type) {
            case "click":
                _playClick(audioCtx, oscillator, gainNode);
                break;
            case "win":
                _playWin(audioCtx, oscillator, gainNode);
                break;
            case "lose":
                _playLose(audioCtx, oscillator, gainNode);
                break;
            case "draw":
                _playDraw(audioCtx, oscillator, gainNode);
                break;
        }
    }

    /** Son de clic */
    function _playClick(audioCtx, oscillator, gainNode) {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.08);
    }

    /** Son de victoire */
    function _playWin(audioCtx, oscillator, gainNode) {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    /** Son de défaite */
    function _playLose(audioCtx, oscillator, gainNode) {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime + 0.45);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.6);
    }

    /** Son de match nul */
    function _playDraw(audioCtx, oscillator, gainNode) {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
    }

    // ------------------------------------------------------------------
    // Toggle
    // ------------------------------------------------------------------

    /** Bascule l'état du son et met à jour l'icône */
    function toggleSound() {
        soundEnabled = !soundEnabled;

        if (soundToggleEl) {
            soundToggleEl.textContent = soundEnabled ? "🔊" : "🔇";
            soundToggleEl.classList.toggle("muted", !soundEnabled);
        }
    }

    return {
        playSound: playSound,
        toggleSound: toggleSound,
        isEnabled: isEnabled,
        setSoundToggleElement: setSoundToggleElement,
    };
})();

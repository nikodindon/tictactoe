# 🎮 TicTac Ultimate

**Une version moderne du classique Tic-Tac-Toe**, développée en HTML, CSS et JavaScript vanilla.

Le projet propose plusieurs modes de jeu, une IA configurable, des statistiques persistantes, des animations soignées ainsi qu’une compatibilité PWA pour une expérience fluide sur desktop et mobile.

![Aperçu TicTac Ultimate](https://via.placeholder.com/1280x720/0f0f1a/667eea?text=TicTac+Ultimate)

> *(Remplace cette image par une capture réelle du jeu après déploiement.)*

---

# ✨ Fonctionnalités

## 🎯 Modes de jeu

* **2 Joueurs** en local
* **Mode IA** avec 3 niveaux de difficulté :

  * 😊 **Facile**
  * 🤔 **Moyen**
  * 💀 **Imbattable** (algorithme Minimax)

---

## 📊 Statistiques

* Sauvegarde persistante des scores
* Série de victoires en temps réel
* Historique des dernières parties
* Statistiques par difficulté
* Meilleure série enregistrée

---

# 🎨 Interface & Expérience

* Deux thèmes visuels : **Cyber** et **Neon Retro**
* Animations fluides et effets visuels modernes
* Effets sonores via Web Audio API
* Interface responsive
* Design inspiré du glassmorphism
* Compatible **PWA** (installable comme une application)

---

# 🚀 Jouer en ligne

**▶️ https://nikodindon.github.io/tictactoe/**

---

# 🛠 Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/nikodindon/tictactoe.git

# Entrer dans le dossier
cd tictactoe

# Lancer le serveur local
python3 server.py
```

Puis ouvrir :

```txt
http://localhost:4508
```

---

# 🧱 Technologies utilisées

* HTML5
* CSS3
* JavaScript Vanilla
* Web Audio API
* localStorage
* Service Worker & Manifest (PWA)

---

# 📁 Structure du projet

```txt
tictactoe/
├── index.html
├── style.css
├── manifest.json
├── sw.js
├── server.py
├── js/
│   ├── constants.js
│   ├── storage.js
│   ├── audio.js
│   ├── effects.js
│   ├── ai.js
│   ├── ui.js
│   ├── game.js
│   └── main.js
```

---

# 🤖 IA

Le mode “Imbattable” utilise l’algorithme **Minimax** afin de jouer de manière optimale.

Les autres niveaux adaptent volontairement le comportement de l’IA pour proposer des parties plus accessibles et variées.

---

# 📱 Progressive Web App

Le jeu peut être installé comme une application sur :

* Android
* iOS
* Windows
* macOS

Une fois installé, il reste utilisable hors ligne grâce au cache PWA.

---

# 📄 Licence

Projet distribué sous licence MIT.

Tu es libre de forker, modifier et réutiliser le projet.

---

# 🙏 Crédits

Développé avec passion en JavaScript vanilla.

Merci à toutes les personnes qui prennent le temps de tester le projet et de partager leurs retours.

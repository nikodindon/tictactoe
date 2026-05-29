# 🎯 Morpion Ultime

Une version moderne du classique Tic-Tac-Toe, développée en HTML, CSS et JavaScript vanilla.
Le projet met l’accent sur une interface agréable, une IA configurable et une expérience fluide aussi bien sur desktop que mobile.


---

# ✨ Fonctionnalités

## 🎮 Modes de jeu

* **2 Joueurs** sur le même appareil
* **Mode IA** avec plusieurs niveaux :

  * 😊 Facile
  * 🤔 Moyen
  * 💀 Imbattable (basé sur l’algorithme Minimax)

---

## 📊 Statistiques

* Sauvegarde locale des scores
* Historique des dernières parties
* Séries de victoires
* Statistiques par difficulté

---

## 🎨 Interface & Effets

* Deux thèmes visuels : **Cyber** et **Neon Retro**
* Animations légères et fluides
* Effets sonores générés via Web Audio API
* Interface responsive (mobile & desktop)
* Effets visuels modernes inspirés du glassmorphism

---

# 🎮 Comment jouer

1. Choisis un mode de jeu
2. Sélectionne éventuellement la difficulté de l’IA
3. Clique sur une case pour jouer
4. Aligne 3 symboles pour gagner la partie

---

# 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/tonusername/morpion-ultime.git

# Entrer dans le dossier
cd morpion-ultime

# Lancer le serveur local
python3 server.py
```

Puis ouvre ton navigateur à l’adresse :

```txt
http://localhost:4508
```

---

# 🛠 Technologies utilisées

* HTML5
* CSS3
* JavaScript Vanilla
* Web Audio API
* localStorage
* Serveur HTTP Python simple

---

# 📁 Structure du projet

```txt
morpion-ultime/
├── index.html
├── style.css
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

Les autres niveaux adaptent volontairement le comportement de l’IA pour proposer des parties plus accessibles ou variées.

---

# 📄 Licence

Ce projet est distribué sous licence MIT.
Tu peux le modifier, le réutiliser ou l’améliorer librement.

---

# 🙏 Remerciements

* Merci à Pi Dev pour l’assistance au développement
* Inspiré des nombreuses variantes modernes du Tic-Tac-Toe

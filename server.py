#!/usr/bin/env python3
"""
Morpion Ultime - Serveur HTTP local

Serve les fichiers statiques du jeu (HTML, CSS, JS)
via un serveur HTTP sur 0.0.0.0:4508

Usage :
    python3 server.py
"""

import http.server
import socketserver
import os
import sys

# Configuration du serveur
HOST = "0.0.0.0"
PORT = 4508
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class GameHandler(http.server.SimpleHTTPRequestHandler):
    """
    Handler HTTP personnalisé qui sert les fichiers statiques
    avec un Content-Type correct et un logging coloré.
    """

    # Override pour servir depuis le bon dossier
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        """Gère les requêtes GET."""
        # Rediriger "/" vers "index.html"
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def log_message(self, format, *args):
        """Logging coloré pour un meilleur feedback visuel."""
        message = format % args
        # Couleur verte pour les succès
        print(f"\033[32m[{self.log_date_time_string()}] {message}\033[0m")


def start_server():
    """Initialise et lance le serveur HTTP."""
    # Change dans le dossier du projet
    os.chdir(DIRECTORY)

    # Configurer le handler
    handler = GameHandler

    # Créer le serveur (permet de réutiliser le port sans délai)
    with socketserver.TCPServer((HOST, PORT), handler) as httpd:
        print(f"\n{'=' * 55}")
        print(f"  🎮  Morpion Ultime - Serveur lancé !")
        print(f"{'=' * 55}")
        print(f"  🌐  Adresse : http://{HOST}:{PORT}")
        print(f"  📁  Dossier : {DIRECTORY}")
        print(f"{'=' * 55}")
        print(f"  ⏹   Pour arrêter : Ctrl+C\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Serveur arrêté.")
            sys.exit(0)


if __name__ == "__main__":
    start_server()

# UAC Accords - Application Mobile

## 📱 Description

UAC Accords est une application mobile développée avec React Native et Expo pour la gestion et la visualisation des accords de coopération de l'Université d'Abomey-Calavi (UAC). L'application permet de consulter, filtrer et analyser les accords de partenariat avec des institutions internationales.

## 🎥 Démonstration

**Vidéo de démonstration complète** : [totonlionel.com/accord-uac-app-video-demo](https://totonlionel.com/accord-uac-app-video-demo)

Regardez cette vidéo pour voir toutes les fonctionnalités de l'application en action !

## ✨ Fonctionnalités

- **🏠 Tableau de bord** : Vue d'ensemble des statistiques et accords récents
- **📋 Gestion des accords** : Liste complète des accords de coopération
- **🗺️ Carte interactive** : Visualisation géographique des partenaires
- **📊 Statistiques avancées** : Graphiques circulaires et analyses détaillées
- **🔍 Recherche et filtres** : Recherche avancée par type, domaine, pays, statut
- **📱 Interface moderne** : Design responsive avec animations fluides

## 🛠️ Technologies Utilisées

- **React Native** 0.79.1
- **Expo** ~54.0.10
- **TypeScript** ~5.8.3
- **React** 19.0.0
- **Expo Router** ~5.0.3
- **React Native Charts Kit** ^6.12.0
- **React Native Maps** 1.20.1
- **Expo Vector Icons** ^14.1.0

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Expo CLI** (installé globalement)
- **Git**

### Installation des prérequis

#### 1. Node.js et npm
```bash
# Télécharger depuis https://nodejs.org/
# Ou via un gestionnaire de paquets (recommandé)

# Sur Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Sur macOS avec Homebrew
brew install node

# Sur Windows
# Télécharger depuis le site officiel Node.js
```

#### 2. Expo CLI
```bash
npm install -g @expo/cli
```

#### 3. Expo Go (pour tester sur mobile)
- **Android** : [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS** : [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/accord-uac-mobile-app.git
cd accord-uac-mobile-app
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier de configuration (si nécessaire)
cp .env.example .env

# Éditer les variables d'environnement si nécessaire
nano .env
```

### 4. Démarrer l'application

#### Mode développement
```bash
# Démarrer le serveur de développement
npm start
# ou
yarn start
# ou
npx expo start
```

#### Options de démarrage
```bash
# Démarrer avec tunnel (pour tester sur différents réseaux)
npx expo start --tunnel

# Démarrer en mode web
npx expo start --web

# Démarrer avec nettoyage du cache
npx expo start --clear
```

## 📱 Test sur appareil mobile

### 1. Scanner le QR code
1. Ouvrez l'application **Expo Go** sur votre téléphone
2. Scannez le QR code affiché dans le terminal
3. L'application se chargera automatiquement

### 2. Test sur simulateur/émulateur
```bash
# iOS Simulator (macOS uniquement)
npx expo start --ios

# Android Emulator
npx expo start --android
```

## 🏗️ Structure du projet

```
accord-uac-mobile-app/
├── app/                    # Pages de l'application (Expo Router)
│   ├── _layout.tsx        # Layout principal
│   ├── index.tsx          # Page d'accueil
│   ├── agreement/         # Pages des accords
│   ├── map.tsx           # Page carte
│   ├── filters.tsx       # Page filtres
│   └── statistics.tsx    # Page statistiques
├── constants/             # Constantes et types
│   ├── colors.ts         # Palette de couleurs
│   ├── types.ts          # Types TypeScript
│   └── mockData.ts       # Données de test
├── contexts/             # Contextes React
│   └── UACContext.tsx    # Contexte principal
├── assets/               # Images et ressources
├── app.json             # Configuration Expo
├── package.json         # Dépendances
└── tsconfig.json        # Configuration TypeScript
```

## 🔧 Scripts disponibles

```bash
# Démarrer l'application
npm start

# Démarrer en mode web
npm run start-web

# Démarrer en mode web avec debug
npm run start-web-dev

# Linter
npm run lint

# Build pour production
npx expo build

# Build pour Android
npx expo build:android

# Build pour iOS
npx expo build:ios
```

## 📊 Fonctionnalités détaillées

### Tableau de bord
- Statistiques en temps réel
- Accords récents
- Actions rapides
- Menu de navigation

### Gestion des accords
- Liste complète des accords
- Filtrage par type, domaine, pays, statut
- Recherche textuelle
- Détails de chaque accord

### Carte interactive
- Visualisation géographique des partenaires
- Clustering des marqueurs
- Informations détaillées au clic

### Statistiques
- Graphiques circulaires (types, statuts)
- Graphiques en barres (domaines)
- Top pays partenaires
- Évolution temporelle

## 🎨 Personnalisation

### Couleurs
Modifiez le fichier `constants/colors.ts` pour personnaliser la palette :

```typescript
export const Colors = {
  primary: '#0D0702',        // Couleur principale
  secondary: '#F5F5F5',      // Couleur secondaire
  accent: '#8B4513',         // Couleur d'accent
  // ...
};
```

### Données
Modifiez `constants/mockData.ts` pour ajouter vos propres données :

```typescript
export const mockAgreements: Agreement[] = [
  // Vos accords ici
];
```

## 🐛 Résolution de problèmes

### Erreurs courantes

#### 1. Erreur "Metro bundler"
```bash
npx expo start --clear
```

#### 2. Erreur de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Erreur de cache Expo
```bash
npx expo start --clear
```

#### 4. Erreur de permissions (Android)
```bash
npx expo start --android
```

### Logs de debug
```bash
# Activer les logs détaillés
DEBUG=expo* npx expo start
```

## 📱 Build pour production

### 1. Configuration EAS Build
```bash
# Installer EAS CLI
npm install -g @expo/eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure
```

### 2. Build Android
```bash
eas build --platform android
```

### 3. Build iOS
```bash
eas build --platform ios
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : TOTON Lionel
- **Design** : TOTON Lionel
- **Backend** : TOTON Lionel

## 📞 Support & Contact

Pour toute question, suggestion ou problème :

### 👨‍💻 Développeur Principal
**TOTON Lionel**
- 📧 **Email** : totonlionel@gmail.com
- 📱 **WhatsApp** : +229 01 96 76 97 16
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/accord-uac-mobile-app/issues)
- 📖 **Documentation** : [Wiki du projet](https://github.com/votre-username/accord-uac-mobile-app/wiki)

### 🏫 Institution
**Université d'Abomey-Calavi (UAC)**
- 🌐 **Site web** : [www.uac.bj](https://www.uac.bj)
- 📧 **Email institutionnel** : contact@uac.bj

## 🔄 Changelog

### Version 1.0.0
- ✅ Interface utilisateur complète
- ✅ Gestion des accords
- ✅ Carte interactive
- ✅ Statistiques avancées
- ✅ Recherche et filtres
- ✅ Support multi-plateforme

---

**Développé avec ❤️ par TOTON Lionel pour l'Université d'Abomey-Calavi**

*Pour toute question technique ou commerciale, n'hésitez pas à me contacter directement via email ou WhatsApp.*
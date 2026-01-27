[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fHqqMzWZ)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21965272&assignment_repo_type=AssignmentRepo)



---
## Description

Dans ce projet, vous allez finaliser l'application de gestion des
étudiants, cours et notes que vous avez commencée en TP.

## Fonctionnalités

### Module 0

-   Fonctionnalités de base du TP précédent\
-   Gestion des entités **cours**, **étudiants** et **notes**\
-   Synchronisation avec une **API Node.js**

### Module 1 -- Authentification

Mettre en place un module d'authentification en utilisant **OAuth 2**
permettant la connexion des utilisateurs avant d'accéder aux
fonctionnalités de base.

#### Gestion des rôles

-   **ADMIN** : Administration des comptes\
-   **SCOLARITÉ** : Administration des étudiants, cours et notes\
-   **STUDENT** : Visualisation de ses propres données

#### Accès après authentification

-   **Administrateur** : accès **lecture + écriture** à toutes les
    données\
-   **Scolarité** : accès aux étudiants, cours et notes. Peut :
    -   saisir des notes\
    -   éditer des profils étudiants\
    -   saisir des cours\
    -   associer des étudiants à des cours\
-   **Étudiant** : visualisation uniquement de ses notes et statistiques
    associées

### Module 2 -- Statistiques améliorées

Développer des dashboards adaptés aux rôles :

-   **Administrateur** : vision globale de toutes les entités\
-   **Scolarité** : vision sur les dossiers des étudiants, cours et
    notes\
-   **Étudiant** : vision uniquement sur son propre dossier

### Module 3 -- Containerisation et déploiement

-   Containerisation des applications **React** et **Node** via
    **Docker**\
-   Mise en place d'une **pipeline de déploiement dans le cloud** (ex.
    AWS, Hostinger, ...)

### Bonus

-   Utiliser les themings Material (mode clair / sombre)\
-   Envoi de mails\
-   Authentification **SSO** (Google, LinkedIn, GitHub, ...)\
-   ...

## Modalités de rendus
-   Utiliser les mêmes groupes que pour le TP\
-   Répartir le travail sur la base du code des TPs\
-   **Deadline ferme : Voir la date de l'assignation **\
-   Faire une **vidéo démo** de l'ensemble des fonctionnalités (publiée
    sur YouTube)

---

## 🎯 Présentation du Projet Réalisé

### Architecture et Technologies

Ce projet implémente une plateforme complète de gestion académique basée sur une architecture moderne **Client-Server** avec séparation des responsabilités :

#### **Backend - API REST Node.js** (`student_management/`)
- **Framework** : Express.js v5.2.1 avec architecture MVC
- **Base de données** : MongoDB avec Mongoose ODM
- **Authentification** : 
  - JWT (Access & Refresh tokens) avec gestion sécurisée via cookies HTTP-Only
  - OAuth 2.0 avec Google Sign-In (SSO)
  - Système de liaison de comptes (Link/Unlink Google account)
- **Sécurité** :
  - Middleware d'autorisation basé sur les rôles (RBAC)
  - Protection CORS configurée
  - Hachage des mots de passe avec bcrypt
  - Gestion de session avec expiration automatique
- **Documentation API** : Swagger/OpenAPI 3.0 intégrée
- **Gestion des emails** : Module Nodemailer pour notifications

#### **Frontend - Application React** (`session01/`)
- **Framework** : React 19.2.0 avec Vite comme bundler
- **UI/UX** :
  - Material-UI (MUI) v7 pour les composants
  - Tailwind CSS v4 pour le styling
  - Support du mode clair/sombre (Dark/Light theme)
  - Design responsive et moderne
- **Routing** : React Router v7 avec routes protégées
- **State Management** : 
  - TanStack Query (React Query) pour la gestion asynchrone
  - Context API pour l'authentification
- **Gestion des formulaires** : Formik avec validation
- **Data Grid** : MUI X-Data-Grid pour tableaux avancés

### Fonctionnalités Implémentées

#### 🔐 **Module d'Authentification (Module 1)**
- ✅ Système de connexion/déconnexion avec JWT
- ✅ Authentification SSO Google (OAuth 2.0)
- ✅ Gestion des sessions avec timeout d'inactivité (15 minutes)
- ✅ Refresh automatique des tokens
- ✅ Liaison/Déliaison de compte Google pour utilisateurs existants
- ✅ Système de rôles : **ADMIN**, **SCOLARITE**, **STUDENT**
- ✅ Routes protégées côté frontend et middleware d'autorisation côté backend
- ✅ Redirection automatique selon le rôle après connexion

#### 👥 **Gestion des Entités (Module 0 & Extensions)**
- ✅ **Utilisateurs** : CRUD complet avec gestion des rôles (réservé ADMIN)
- ✅ **Étudiants** : Création, modification, consultation avec profils détaillés
- ✅ **Cours** : Gestion complète avec crédits et descriptions
- ✅ **Années académiques** : Organisation par année scolaire
- ✅ **Semestres** : Subdivision des années académiques
- ✅ **Inscriptions** : Association étudiants-cours par semestre
- ✅ **Notes** : Saisie et consultation avec calcul automatique des moyennes

#### 📊 **Dashboards Statistiques (Module 2)**
- ✅ **Dashboard Administrateur** :
  - Vue globale : nombre total d'étudiants, cours, utilisateurs
  - Statistiques système et gestion des comptes
- ✅ **Dashboard Scolarité** :
  - Vue d'ensemble des inscriptions et notes
  - Statistiques par cours et par semestre
  - Suivi des performances académiques
- ✅ **Dashboard Étudiant** :
  - Consultation de ses propres notes
  - Visualisation de ses statistiques personnelles
  - Historique académique complet

#### 🎨 **Expérience Utilisateur**
- ✅ Interface Material Design moderne et intuitive
- ✅ Mode sombre/clair avec persistance des préférences
- ✅ Composants réutilisables (Badges, Dialogs, Cards, etc.)
- ✅ Tableaux de données interactifs avec tri, filtrage et pagination
- ✅ Formulaires avec validation en temps réel
- ✅ Feedback utilisateur (Snackbars, messages d'erreur)
- ✅ Navigation contextuelle selon les rôles

#### 🐳 **Containerisation (Module 3)**
- ✅ Dockerfile pour l'application React (build + Nginx)
- ✅ Dockerfile pour l'API Node.js
- ✅ Configuration Nginx optimisée pour SPA

#### 🎁 **Fonctionnalités Bonus**
- ✅ Système de thèmes Material-UI (clair/sombre)
- ✅ Authentification SSO Google
- ✅ Infrastructure mail avec Nodemailer
- ✅ Timeout de session avec notification utilisateur
- ✅ Documentation API Swagger complète

### Structure du Code

Le projet est organisé de manière professionnelle avec :
- Séparation claire Backend/Frontend
- Architecture MVC côté serveur
- Architecture par fonctionnalités côté client
- Configuration environnementale (.env)
- Scripts de migration et d'initialisation
- Middlewares de sécurité et gestion d'erreurs
- Validation des données entrantes

---

## 🌐 Déploiement en Production

### Frontend React Application
**URL de l'application** : [https://react-team.mbds2026.com](https://react-team.mbds2026.com/)

### API Backend & Documentation
**URL de l'API** : [https://api.react-team.mbds2026.com](https://api.react-team.mbds2026.com/health)  
**Documentation Swagger** : [swagger-docs](https://api.react-team.mbds2026.com/api/v1/swagger/api-docs)

### Accès de Test
Pour tester l'application, utilisez les comptes suivants :
- **Administrateur** : 
  - Email : `admin`
  - Mot de passe : [`Contacter un membre du staff`](https://github.com/Lautocoder)
- **Scolarité** : 
  - Email : `scolarite`
  - Mot de passe : [`Contacter un membre du staff`](https://github.com/Lautocoder) 
- **Étudiant** : 
  - Email : `student`
  - Mot de passe : [`Contacter un membre du staff`](https://github.com/Lautocoder)

---

## 🎥 Démonstration Vidéo
- **Lien YouTube** : [https://youtu.be/OP9hW3Mziqo](https://youtu.be/OP9hW3Mziqo?feature=shared)
- **Liens Google drive Backup** : [https://drive.google.com/drive/folders/1hT9QOk5ppuraldt4GMcTLHmkRtJFK8O5?usp=sharing](https://drive.google.com/drive/folders/1hT9QOk5ppuraldt4GMcTLHmkRtJFK8O5?usp=sharing)



## React-Team
Membres :
- [Stanley LAFLEUR](https://github.com/Lautocoder) 
- [Mackey CHARLES](https://github.com/Cmackeydev)
- [Dawens PIERRE](https://github.com/pdawens78-a11y)
- [Sachy Edvaëlle BARREAU](https://github.com/sebarreau)
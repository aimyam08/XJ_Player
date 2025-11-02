# React Native IPTV Player (Help Wanted!)

This is an open-source IPTV player for iOS and Android, built with React Native and Expo.

The project is in the early stages of development and is currently **unstable**. We are actively looking for contributors to help us find and fix bugs, and implement new features.

---

## 🚩 The Current Problem

We are currently blocked by a persistent bug:

* The Metro server (or the app) crashes silently (server stops) when loading an M3U profile.
* This happens after the `LOG Chargement du profil...` message appears.
* We suspect a problem with the M3U parser, a `Require cycle` cache issue, or something similar.
* **We are looking for experienced developers to help us debug and fix this core issue.**

---

## ✨ Features & To-Do List

Here is a list of features we want to build. Any help is welcome!

### Core
* [ ] **Fix the critical server crash on profile load!**
* [ ] Investigate and fix the `WARN Require cycle: components/VideoPlayer.tsx` warning.
* [ ] Fix potential issue where clicking on a channel does not work.

### Profile Management
* [X] Add M3U Profile (by URL)
* [X] Save profiles to device (`AsyncStorage`)
* [X] Delete profile
* [ ] **Implement Xtream Codes API Login**
* [ ] **Implement Stalker Portal (MAC Address) Login**
* [ ] Add "Edit" profile functionality

### Player
* [X] Basic video playback (`expo-video`)
* [X] Native controls (play, pause, fullscreen, mute)
* [X] Screen rotation (landscape/portrait)
* [ ] Add "Fast Forward" / "Rewind" buttons.

### UI / Features
* [ ] **Implement Tabbed Navigation** (Live TV, Movies, Series).
* [ ] Create `MovieList` and `SeriesList` components.
* [ ] Parse and display EPG (XMLTV) data.
* [ ] Group channels, movies, and series by their "group-title".
* [ ] Add a search bar.

---

## 🚀 How to Contribute

1.  **Fork** this repository.
2.  Create a new branch (`git checkout -b feature/my-new-feature` or `bugfix/fix-the-crash`).
3.  Make your changes.
4.  **Submit a Pull Request** with a clear description of what you've done.

## 🛠️ Getting Started (How to run the project)

1.  Clone this repository:
    ```bash
    git clone https://github.com/xjapan007/XJ_Player
    ```
2.  Navigate to the project directory:
    ```bash
    cd react-native-iptv-player
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the Expo server:
    ```bash
    npx expo start
    ```
5.  Scan the QR code with the **Expo Go** app on your phone.

---

## 📄 License

This project is licensed under the MIT License.
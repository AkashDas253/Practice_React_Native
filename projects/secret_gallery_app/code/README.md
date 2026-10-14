# Secret Gallery App 

A secure, private, and modular mobile application built with **Expo** and **React Native** that isolates your private photos and videos away from the public device gallery.

---

## 🚀 Key Features

* **Secure Authentication**:
  * Custom 4-digit PIN lock pad with biometric fallback (Face ID / Touch ID) powered by `expo-local-authentication`.
  * Encrypted PIN storage via hardware-backed secure storage (`expo-secure-store`).

* **Private Sandbox Storage**:
  * Imported photos and videos are copied directly into the app's internal document directory (`expo-file-system`), ensuring complete isolation from public photo libraries and camera rolls.

* **Nested Directory Management**:
  * Organize your media using a recursive subfolder system complete with contextual file imports and breadcrumb navigation.

* **In-App Media Viewer**:
  * Smooth full-screen image viewing and embedded high-performance video playback (`expo-video`).

* **Persistent Local State**:
  * Folder hierarchies and file metadata mapping persist safely across app reboots via `@react-native-async-storage/async-storage`.

---

## 📱 Tech Stack

* **Framework**: Expo / React Native
* **Navigation & Router**: Expo Router (`expo-router`)
* **File System**: `expo-file-system` (`File` and `Paths` classes)
* **Security**: `expo-local-authentication` & `expo-secure-store`
* **Media & Playback**: `expo-image-picker` & `expo-video`
* **Persistence**: `@react-native-async-storage/async-storage`

---

## 🛠️ Project Structure

```text
code/
├── src/
│   ├── app/
│   │   ├── _layout.tsx        # Root layout with custom status bar configuration
│   │   └── index.tsx          # Authentication gatekeeper route
│   ├── components/
│   │   ├── MediaViewer.tsx    # Full-screen image & video player modal
│   │   ├── PinLockScreen.tsx  # Numeric keypad & biometric authentication screen
│   │   ├── VaultManager.tsx   # Grid layout for folders, subfolders, and media
│   │   └── VaultSettings.tsx  # Secure PIN updating configuration modal
│   ├── hooks/
│   │   └── useVaultManager.ts # Custom hook handling folder tree, storage, and state
│   └── constants/
│       └── theme.ts           # Centralized theme configuration

```

---

## ⚙️ Getting Started

### 1. Prerequisites

Ensure you have Node.js and the Expo CLI installed on your machine.

### 2. Install Dependencies

Run the following commands in your project root directory to install all necessary packages:

```bash
npx expo install expo-router expo-status-bar expo-file-system expo-image-picker expo-video expo-local-authentication expo-secure-store @react-native-async-storage/async-storage react-native-safe-area-context

```

### 3. Run the App

Start your development server:

```bash
npx expo start

```

From there, press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code using the **Expo Go** app on your physical device. *(Default initial PIN is `1234`)*
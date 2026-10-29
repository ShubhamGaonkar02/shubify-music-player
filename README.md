# 🎵 Shubify – Ad-Free Music Player

Shubify is a modern Spotify-inspired music streaming web application that allows users to search, discover, and play music with a smooth, ad-free experience.

🌐 **Live Demo:** https://shubify-music.vercel.app/

---

# ✨ Features

- 🎵 Search songs and artists
- ❤️ Like and save favourite songs
- 📂 Create custom playlists
- 🔗 Share playlists with friends
- 👤 User Sign Up & Login
- 🎧 High-quality music playback
- ⏯️ Play, Pause, Next & Previous controls
- 🔊 Volume control
- 📱 Responsive design (Desktop & Mobile)
- 🌙 Modern Spotify-inspired UI

---

# 🛠️ Technologies Used

## Frontend

### React.js
A JavaScript library used to build fast and interactive user interfaces.

### Vite
A modern build tool that makes the application start and build much faster.

### JavaScript (ES6+)
Used to add functionality, logic, and interactivity to the website.

### Tailwind CSS
A CSS framework used to design a responsive and modern user interface.

### Zustand
A lightweight state management library used to manage the current song, playlists, and user data across the application.

### ReactPlayer
A React library used to play music from YouTube and other supported sources.

---

## Backend

### Node.js
A JavaScript runtime that allows JavaScript to run on the server.

### Express.js
A Node.js framework used to create backend APIs and handle requests from the frontend.

---

## Authentication

### Clerk
Provides modern, secure user registration, multi-factor authentication, social logins (Google, Apple, etc.), session management, and profile controls.

---

## Deployment

### Git
Used for version control and tracking code changes.

### GitHub
Used to store and manage the project's source code online.

### Vercel
Used to deploy and host the frontend and backend applications.

---

# 🌐 APIs Used

## Firebase Authentication API
**Purpose:**
- User Registration
- User Login
- User Authentication
- Session Management

**How it is used in Shubify:**
When a user signs up or logs in, Firebase securely verifies the user's credentials and keeps them logged in.

---

## iTunes Search API
**Purpose:**
- Search songs
- Search artists
- Search albums
- Fetch album artwork

**How it is used in Shubify:**
When a user searches for a song or artist, Shubify sends the search request to the iTunes API, which returns song information and album images.

---

## YouTube Data API / YouTube Search Resolver
**Purpose:**
- Search YouTube videos
- Find playable songs

**How it is used in Shubify:**
When the user clicks Play, the application searches YouTube for the selected song and plays it using ReactPlayer.

---

## DiceBear Avatar API
**Purpose:**
Generate profile avatars automatically.

**How it is used in Shubify:**
If a user doesn't upload a profile picture, DiceBear generates a unique avatar based on the user's name.

---

# 📂 Project Structure

```
shubify-music-player
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── routes
│   ├── controllers
│   ├── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/ShubhamGaonkar02/shubify-music-player.git
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd ../server
npm install
```

---

# ▶️ Run the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 🌍 Live Website

https://shubify-music.vercel.app/

---

# 🎯 Future Improvements

- 🎤 Live synchronized lyrics
- 🤝 Collaborative playlists
- 📥 Offline mode
- 🎧 Audio quality selection
- 📊 Listening history
- 🌍 Multi-language support

---

# 👨‍💻 Developer

**Shubham Gaonkar**

Computer Engineering Student

GitHub:
https://github.com/ShubhamGaonkar02

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is created for educational and portfolio purposes.

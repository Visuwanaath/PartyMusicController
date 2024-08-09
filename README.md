# Spotify Party Music Controller

### Built with Django, React + Vite, and Mantine

### What It Does:
A user can host a room and share the room code with friends, who can then join and control the music from the host's Spotify account. Guests can vote to skip songs, and the host can set the number of votes required to skip a song, as well as other settings like guest control over pause/play and more. Guests can also search for songs on Spotify and add them to the queue.

This project is a significant overhaul of [Tim's Music Controller](https://github.com/techwithtim/Music-Controller-Web-App-Tutorial). The frontend has been entirely redesigned using React + Vite and the Mantine UI library, with several new features added that required substantial backend modifications. While the database models for rooms and Spotify tokens remain from the original project, this version fully decouples the backend and frontend. They now interact through a REST API, rather than relying on Django's templating system as in the original. This change provides greater flexibility, allowing developers to create their own frontend using any framework they choose.

### New Features:
- **Search for Songs**: Easily find and add songs directly to the queue.
- **View Queue**: Manage and view the current song queue with ease.

### Upcoming Features:
- **Volume Control**: Adjust the volume of your party.
- **Caching**: Minimize redundant requests to Spotify by caching the currently playing song, song queue, search results, and more.
- **Dockerization and Hosting**: Plans to dockerize the project and host it online for easy deployment.

Stay tuned for more updates!
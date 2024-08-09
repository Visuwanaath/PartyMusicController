# Spotify Party Music Controller

### Built with Django and React

This project is a major revision of the original Spotify Party Music Controller. The frontend has been completely redesigned using **React + Vite** and the **Mantine UI library**, with several new features added that required extensive backend changes.

While some backend code is adapted from [Tim's Music Controller Web App](https://github.com/techwithtim/Music-Controller-Web-App-Tutorial), including the database models for rooms and Spotify tokens, this version separates the backend and frontend completely. They now communicate through a REST API rather than using Django's templating system, as in the original project. This approach allows for greater flexibility, enabling anyone to develop their own frontend in any framework they prefer.

### New Features:
- **Search for Songs**: Easily find and add songs directly to the queue.
- **View Queue**: Manage and view the current song queue with ease.

### Upcoming Features:
- **Volume Control**: Adjust the volume of your party.
- **Caching**: Minimize redundant requests to Spotify by caching the currently playing song, song queue, search results, and more.
- **Dockerization & Hosting**: Plans to dockerize the application and host it for broader accessibility.

Stay tuned for more updates!
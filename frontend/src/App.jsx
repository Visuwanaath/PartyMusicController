import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Room from './pages/Room';
import SpotifyRedirect from './pages/SpotifyRedirect';
import SearchSongs from './components/SearchSongs'
import MusicPlayer from './components/MusicPlayer'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/spotify-redirect" element={<SpotifyRedirect />} />
        <Route path="*" element={<><div> error 404 </div></> } />
      </Routes>
      </MantineProvider>
    </BrowserRouter>
  )
}

export default App

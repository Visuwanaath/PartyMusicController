import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Room from './pages/Room';
import SpotifyRedirect from './pages/SpotifyRedirect.jsx';
// import NotFound from './pages/NotFound.jsx'
import SearchSongs from './components/SearchSongs.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
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
        <Route
            path="/test-music-player"
            element={
              <MusicPlayer
                image_url="https://via.placeholder.com/150"
                title="Test Song"
                artist="Test Artist"
                is_playing={true}
                time={30}
                duration={300}
                votes={5}
                votes_required={10}
              />
            }
          />
          <Route path='test-search-songs' element={<SearchSongs />} />
        <Route path="*" element={<><div> error 404 </div></> } />
      </Routes>
      </MantineProvider>
    </BrowserRouter>
  )
}

export default App

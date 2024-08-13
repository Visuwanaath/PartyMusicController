import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Text } from '@mantine/core';
import RoomSetupModal from '../components/RoomSetupModal'; 
import MusicPlayer from '../components/MusicPlayer'; 
import MusicQueue from '../components/MusicQueue';
import SearchSongs from '../components/SearchSongs';
import api from '../api'; 


const Room = () => {
  const { roomCode } = useParams(); // Access roomCode from URL parameters
  const navigate = useNavigate();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const [queueOpen, setQueueOpen] = useState(false);
  const [refreshQueue, setRefreshQueue] = useState(false); 
  const [searchOpen, setSearchOpen] = useState(false);
  const getCurrentSong = async () => {
   try {
     const response = await api.get('/spotify/current-song');
     if(response.data["Leave"] == "Room"){
      navigate('/');
    }
    console.log(response.data);
     if (response.status === 200) {
       console.log(response.data);
       setSong(response.data);
     }
   } catch (error) {
     console.error('Error fetching current song:', error);
   }
 };

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const response = await api.get(`/api/get-room`, { params: { code: roomCode } });
        if (response.status === 204) {
          navigate('/');
        } else if(response.status === 200) {
          const data = response.data;
          setVotesToSkip(data.votes_to_skip);
          setGuestCanPause(data.guest_can_pause);
          setIsHost(data.is_host);
          if (data.is_host) {
            authenticateSpotify();
          }
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    const authenticateSpotify = async () => {
      try {
        const response = await api.get('/spotify/is-authenticated');
        const data = response.data;
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          const authUrlResponse = await api.get('/spotify/get-auth-url');
          window.location.replace(authUrlResponse.data.url);
        }else{
          getCurrentSong();
        }
      } catch (error) {
        console.error('Error authenticating Spotify:', error);
      }
    };
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 10000);
    getCurrentSong();
    //const interval2 = setInterval(getRoomDetails, 120*1000);
    return () => {
      clearInterval(interval);
      //clearInterval(interval2);
    }
  }, [roomCode, navigate]);

  const leaveButtonPressed = async () => {
    try {
      await api.post('/api/leave-room');
      navigate('/');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const handleShowSearch = () => {
    setSearchOpen(true);
  };
  const handleShowQueue = () => {
    setRefreshQueue(prev => !prev); 
    setQueueOpen(true); 
  };
  const renderSettings = () => (
    <Grid  spacing={1}>
      <Grid.Col span={12} align="center">
        <RoomSetupModal
          isOpen={true}
          isUpdate={true}
          existingRoom={{ votes_to_skip: votesToSkip, guest_can_pause: guestCanPause, code: roomCode }}
          onClose={() => updateShowSettings(false)}
          onSave={
            (data)=>{
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
          }}
        />
      </Grid.Col>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid.Col span={12} align="center">
      <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
        Settings
      </Button>
    </Grid.Col>
  );

  return (
    <Grid spacing={1}>
      <Grid.Col span={12} align="center">
        <Text variant="h4" component="h4">
          Code: {roomCode}
        </Text>
      </Grid.Col>
      <MusicPlayer {...song} musicPlayerAction={getCurrentSong} isHost={isHost}/>
      {isHost ? renderSettingsButton() : null}
      {showSettings && renderSettings()}
      <Grid.Col span={12} align="center">
        <Button variant="contained" color="primary" onClick={handleShowQueue}>
          Show Queue
        </Button>
      </Grid.Col>
      <Grid.Col span={12} align="center">
        <Button variant="contained" color="primary" onClick={handleShowSearch}>
          Add songs
        </Button>
      </Grid.Col>
      <Grid.Col span={12} align="center">
        <Button style={{
    background: 'var(--mantine-color-red-9)',
    color: 'var(--mantine-color-white)',
  }}
 variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid.Col>
      <MusicQueue isOpen={queueOpen} onClose={() => setQueueOpen(false)} refreshQueue={refreshQueue} />
      <SearchSongs isOpen={searchOpen} onClose={()=>setSearchOpen(false)}/>
    </Grid>
  );
};

export default Room;

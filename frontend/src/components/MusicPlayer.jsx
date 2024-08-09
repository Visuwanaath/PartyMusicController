import React from 'react';
import {
  Card,
  ActionIcon,
  Progress,
  Image,
  Text,
  Group,
  Box,
} from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward } from '@tabler/icons-react';
import api from '../api';

const MusicPlayer = ({ image_url, title, artist, is_playing, time, duration, votes, votes_required,musicPlayerAction , guest_can_pause, isHost= false}) => {
  const hasSong = title && artist;
  let songProgress = hasSong && duration > 0 ? (time / duration) * 100 : 0;
  console.log("Time: ", time);
  console.log("Duration: ", duration);
  let canPauseOrPlay = guest_can_pause || isHost;
  // const increaseSongProgress = () => {
  //   if (hasSong && is_playing) {
  //     time += 1000;
  //     songProgress = hasSong && duration > 0 ? (time / duration) * 100 : 0;
  //   }
  // }
  // setInterval(increaseSongProgress, 1000);
  const skipSong = async () => {
    try {
      await api.post("/spotify/skip");
      musicPlayerAction();
    } catch (error) {
      console.error(error.message);
    }
  };

  const pauseSong = async () => {
    try {
      if(!canPauseOrPlay) return;
      await api.put("/spotify/pause");
      musicPlayerAction();
    } catch (error) {
      console.error(error.message);
    }
  };

  const playSong = async () => {
    try {
      if(!canPauseOrPlay) return;
      await api.put("/spotify/play");
      musicPlayerAction();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" style={{maxWidth: 400, margin: 'auto' }}>
      {hasSong ? (
        <Group>
          <Image 
            src={image_url} 
            height={80} 
            width={80} 
            alt="album cover" 
            radius="md" 
            style={{ display: 'block', minWidth: 80 }}
/>
          <Box sx={{ flex: 1 }}>
            <Text size="lg" weight={500}>
              {title}
            </Text>
            <Text color="dimmed" size="sm">
              {artist}
            </Text>
            <Group mt="sm">
              <ActionIcon
                onClick={() => {
                  is_playing ? pauseSong() : playSong();
                }}
                {...(canPauseOrPlay ? { disabled: false } : { disabled: true })}
                size="lg"
              >
                {is_playing ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
              </ActionIcon>
              <ActionIcon onClick={skipSong} size="lg">
                <IconPlayerSkipForward size={24} />
              </ActionIcon>
              <Text size="sm">
                {votes} / {votes_required} voted to skip
              </Text>
            </Group>
          </Box>
        </Group>
      ) : (
        <Text align="center" size="lg" color="dimmed">
          No song is currently playing.
        </Text>
      )}
      {hasSong && (
        <Progress value={songProgress} transitionDuration={100} mt="md" />
      )}
    </Card>
  );
};

export default MusicPlayer;

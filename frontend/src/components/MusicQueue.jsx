import React, { useState, useEffect } from 'react';
import { Drawer, ScrollArea, Card, Image, Text, Group, Box, Button } from '@mantine/core';
import api from '../api';

const MusicQueue = ({ isOpen, onClose, refreshQueue }) => {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/spotify/queue');
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [refreshQueue]);

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title="Music Queue"
      size="lg"
      padding="md"
      position="right"
    >
      <ScrollArea style={{ height: '80vh' }}>
        <div style={{ padding: '1rem' }}>
          {queue.length !=0 && queue.map((song, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" style={{ marginBottom: '1rem' }}>
              <Group>
                <Image
                  src={song.image_url}
                  height={80}
                  width={80}
                  alt="album cover"
                  radius="md"
                  style={{ display: 'block', minWidth: 80 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Text size="lg" weight={500}>
                    {song.title}
                  </Text>
                  <Text color="dimmed" size="sm">
                    {song.artist}
                  </Text>
                </Box>
              </Group>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      <Button onClick={fetchQueue} style={{ marginTop: '1rem' }}>Refresh Queue</Button>
    </Drawer>
  );
};

export default MusicQueue;

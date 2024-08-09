import React, { useState } from 'react';
import { Drawer, TextInput, Button, ScrollArea, Card, Image, Text, Group, Box } from '@mantine/core';
import api from '../api';

const SearchSongs = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await api.get('/spotify/search', {
        params: { query: searchTerm },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching for songs:', error);
    }
  };

  const handleAddToQueue = async (uri) => {
    try {
      await api.post('/spotify/add-to-queue', { uri });
    } catch (error) {
      console.error('Error adding song to queue:', error);
    }
  };

  return (
    <>
      {/* <Button onClick={open} style={{ position: 'absolute', right: 0, top: 0, margin: '1rem' }}>
        Search Songs
      </Button> */}
      <Drawer
        opened={isOpen}
        onClose={onClose}
        position="left"
        size="lg"
        padding="md"
        title="Add Songs to Queue"
      >
        <TextInput
          placeholder="Search for songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} style={{ marginTop: '1rem' }}>
          Search
        </Button>
        <ScrollArea style={{ height: '70vh', marginTop: '1rem' }}>
          <div style={{ padding: '1rem' }}>
            {results.map((song, index) => (
              <Card key={index} shadow="sm" padding="lg" radius="md" style={{ marginBottom: '1rem' }}>
                <Group>
                  <Image src={song.image_url} height={80} width={80} alt="album cover" radius="md" style={{ display: 'block', minWidth: 80 }} />
                  <Box sx={{ flex: 1 }}>
                    <Text size="lg" weight={500}>
                      {song.title}
                    </Text>
                    <Text color="dimmed" size="sm">
                      {song.artist}
                    </Text>
                  </Box>
                  <Button onClick={() => handleAddToQueue(song.uri)} color="blue" style={{ marginLeft: 'auto' }}>
                    Add
                  </Button>
                </Group>
              </Card>
            ))}
          </div>
          {results.length > 0 && <Button onClick={()=>{}} style={{ marginTop: '1rem' }}>More Results</Button>}
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default SearchSongs;

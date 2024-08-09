import React, { useState, useEffect } from 'react';
import { Button, Group, Modal, Text, Title, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import RoomSetupModal from '../components/RoomSetupModal';
import RoomJoinModal from '../components/RoomJoinModal'; // Import the RoomJoinModal
import api from '../api'; // Import your API setup

const Home = () => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [roomSetupModalOpen, setRoomSetupModalOpen] = useState(false);
  const [roomJoinModalOpen, setRoomJoinModalOpen] = useState(false); // State for RoomJoinModal
  const [existingRoom, setExistingRoom] = useState(null); // State to hold existing room details if any
  const navigate = useNavigate();

  const openInfoModal = () => setInfoModalOpen(true);
  const closeInfoModal = () => setInfoModalOpen(false);
  const openRoomSetupModal = () => setRoomSetupModalOpen(true);
  const closeRoomSetupModal = () => setRoomSetupModalOpen(false);
  const openRoomJoinModal = () => setRoomJoinModalOpen(true); 
  const closeRoomJoinModal = () => setRoomJoinModalOpen(false); 

  const checkRoomStatus = async () => {
    try {
      const response = await api.get('/api/user-in-room');
      if (response.data && response.data.code) {
        setRoomCode(response.data.code);
        setExistingRoom(response.data); // Set existing room details
        navigate(`/room/${response.data.code}`);
      }
    } catch (error) {
      console.error('Error checking room status:', error);
    }
  };
  
  useEffect(() => {
    checkRoomStatus();
  }, []); 
  
  const handleRoomSave = (data) => {
    console.log('Room saved:', data);
    navigate(`/room/${data.code}`);
  };


  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Title order={1} mb="xl">
        Party Music Control!!
      </Title>
      <Center>
        <Group spacing="md" direction="column">
          <Button onClick={openRoomJoinModal} size="lg">
            Join a Room
          </Button>
          <Button onClick={openRoomSetupModal} size="lg">
            {'Create a Room'}
          </Button>
        </Group>
      </Center>
      <Center mt="md">
        <Button variant="subtle" onClick={openInfoModal} size="sm">
          Info
        </Button>
      </Center>

      <Modal opened={infoModalOpen} onClose={closeInfoModal} title="App Information">
        <Text>Here is some information about the app...</Text>
      </Modal>

      <RoomSetupModal
        isOpen={roomSetupModalOpen}
        onClose={closeRoomSetupModal}
        isUpdate={false}
        existingRoom={null}
        onSave={handleRoomSave}
      />
      
      <RoomJoinModal
        isOpen={roomJoinModalOpen}
        onClose={closeRoomJoinModal}
      />
    </div>
  );
};

export default Home;

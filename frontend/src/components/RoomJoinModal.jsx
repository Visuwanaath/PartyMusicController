import React, { useState } from 'react';
import { Modal, TextInput, Button, Notification, Space } from '@mantine/core';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const RoomJoinModal = ({ isOpen, onClose}) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    try {
      const response = await api.post('/api/join-room', { code: roomCode });
      if (response.status === 200) {
        navigate(`/room/${roomCode}`);
        onClose();
      } else {
        setError('Room not found.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('An error occurred.');
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Join a Room">
      <TextInput
        label="Room Code"
        placeholder="Enter a 6-digit Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        required
        maxLength={6}
        mb="md"
      />
      {error && (
        <>
          <Notification color="red">{error}</Notification>
          <Space h="md" />
        </>
      )}
      <Button onClick={handleJoinRoom} fullWidth>
        Join Room
      </Button>
    </Modal>
  );
};

export default RoomJoinModal;

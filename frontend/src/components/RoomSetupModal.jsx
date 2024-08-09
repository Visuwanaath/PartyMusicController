import React, { useState } from 'react';
import { Modal, Button, NumberInput, Checkbox, Notification, Space } from '@mantine/core';
import api from '../api';

const RoomSetupModal = ({ isOpen, onClose, isUpdate = false, existingRoom = null, onSave }) => {
  const [votesToSkip, setVotesToSkip] = useState(existingRoom ? existingRoom.votes_to_skip : 2);
  const [guestCanPause, setGuestCanPause] = useState(existingRoom ? existingRoom.guest_can_pause : true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    const requestData = {
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
    };

    try {
      let response;
      if (isUpdate && existingRoom) {
        requestData.code = existingRoom.code;
        response = await api.patch('/api/update-room', requestData);
      } else {
        response = await api.post('/api/create-room', requestData);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg(isUpdate ? 'Room updated successfully!' : 'Room created successfully!');
        onSave(response.data); // Pass data to the parent component
        onClose(); // Close the modal
      } else {
        setErrorMsg('Error creating/updating room...');
      }
    } catch (error) {
      setErrorMsg('Error creating/updating room...');
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={isUpdate ? 'Update Room' : 'Create a Room'}>
      <NumberInput
        label="Votes Required To Skip Song"
        value={votesToSkip}
        onChange={setVotesToSkip}
        min={0}
        max={99}
        required
        mt="md"
      />
      <Space h="md" />
      <Checkbox
        label="Can Guests Pause/Play?"
        checked={guestCanPause}
        onChange={(event) => setGuestCanPause(event.currentTarget.checked)}
        mt="md"
      />
      <Space h="md" />
      {errorMsg && (
        <>
          <Notification color="red">{errorMsg}</Notification>
          <Space h="md" />
        </>
      )}
      {successMsg && (
        <>
          <Notification color="green">{successMsg}</Notification>
          <Space h="md" />
        </>
      )}
      <Button onClick={handleSubmit} fullWidth mt="md">
        {isUpdate ? 'Update Room' : 'Create Room'}
      </Button>
    </Modal>
  );
};

export default RoomSetupModal;

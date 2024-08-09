import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the path as necessary
import { Loader } from '@mantine/core';

const SpotifyRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    const fetchData = async () => {
      try {
        // Send a POST request to your Django backend
        const response = await api.post('/spotify/redirect', { code, error });
        
        if (response.status === 200) {
          // Handle successful response
          console.log(response.data);
          //navigate('/'); // Redirect to home or another page
        } else {
          // Handle non-200 responses
          console.error(response.data);
         // navigate('/error'); // Redirect to an error page or handle the error
        }
      } catch (err) {
        console.error(err);
        //navigate('/error'); // Redirect to an error page or handle the error
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Loader size="xl" />
      <p>Loading, please wait...</p>
    </div>
  );
};

export default SpotifyRedirect;

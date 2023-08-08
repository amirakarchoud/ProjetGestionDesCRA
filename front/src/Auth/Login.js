import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardMedia, TextField, Typography } from '@mui/material';

const LoginApp = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const token = data;
      console.log(token.access_token);
      localStorage.setItem('token', token.access_token);
      
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Card sx={{ width: 345 }}>
        <CardMedia
          component="img"
          alt="logo"
          height="140"
          image="/logo.jpeg"
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Gestion des Cra
          </Typography>
          <div>
            <br />
            <strong>username/email:</strong>
            <br />
            <TextField
              variant="standard"
              type="text"
              placeholder="votre email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <strong>Mot de passe:</strong>
            <br />
            <TextField
            variant="standard"
              type="password"
              placeholder="votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginApp;

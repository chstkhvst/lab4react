import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Stack,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/auth.models";

const UsersList: React.FC = () => {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Не удалось загрузить пользователей");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        minHeight="60vh"
        sx={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        p: 3
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontWeight: 600,
          color: 'primary.main',
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Список пользователей
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
        {users.map((user) => (
          <Paper
            key={user.id}
            elevation={3}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6
              },
              background: 'rgba(255, 255, 255, 0.85)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  mr: 3, 
                  width: 64, 
                  height: 64,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 500
                }}
              >
                {user.userName?.charAt(0).toUpperCase()}
              </Avatar>

              <Box>
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  {user.userName}
                </Typography>
                {user.roles && (
                  <Box sx={{ mt: 1 }}>
                    {user.roles.map(role => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        color="secondary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Полное имя
                </Typography>
                <Typography variant="body1">
                  {user.fullName || "Не указано"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Телефон
                </Typography>
                <Typography variant="body1">
                  {user.phoneNumber || "Не указан"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default UsersList;
import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Stack,
  Box,
  Avatar,
  CircularProgress,
  Alert
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {users.map((user) => (
        <Paper
          key={user.id}
          elevation={3}
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          <Avatar sx={{ 
            mr: 2, 
            width: 56, 
            height: 56,
            bgcolor: 'primary.main',
            fontSize: '1.5rem'
          }}>
            {user.userName?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {user.userName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>ФИО:</strong> {user.fullName || "Не указано"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Телефон:</strong> {user.phoneNumber || "Не указан"}
            </Typography>
            {user.roles && (
              <Typography variant="body1" color="text.secondary">
                <strong>Роли:</strong> {user.roles.join(", ")}
              </Typography>
            )}
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default UsersList;
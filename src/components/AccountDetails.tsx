import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import APIService from "../services/APIService";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Avatar,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { authService } from "../services/AuthService";

const AccountDetails: React.FC = () => {
  const { currentUser, fetchCurrentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({
    userName: "",
    fullName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormState({
        userName: currentUser.userName || "",
        fullName: currentUser.fullName || "",
        phoneNumber: currentUser.phoneNumber || "",
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.updateUserProfile({
        fullName: formState.fullName,
        phoneNumber: formState.phoneNumber
      });
      
      await fetchCurrentUser(); // Обновляем данные пользователя
      setEditMode(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  if (!currentUser) {
    return <Typography variant="h6">Пользователь не найден!</Typography>;
  }

  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      p: 3
    }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
        Профиль пользователя
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
          {currentUser.userName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5">{currentUser.userName}</Typography>
      </Box>

      {!editMode ? (
        <Box>
          <Typography><strong>ФИО:</strong> {currentUser.fullName || "Не указано"}</Typography>
          <Typography><strong>Телефон:</strong> {currentUser.phoneNumber || "Не указан"}</Typography>

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Редактировать
            </Button>
            <Button variant="outlined" onClick={() => navigate("/")}>
              На главную
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} divider={<Divider />}>
            <TextField
              label="Имя пользователя"
              value={formState.userName}
              onChange={(e) => setFormState({...formState, userName: e.target.value})}
              disabled // Имя пользователя обычно нельзя менять
            />
            
            <TextField
              label="Полное имя"
              value={formState.fullName}
              onChange={(e) => setFormState({...formState, fullName: e.target.value})}
            />
            
            <TextField
              label="Телефон"
              value={formState.phoneNumber}
              onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})}
            />
            
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={() => setEditMode(false)}
              >
                Назад
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AccountDetails;
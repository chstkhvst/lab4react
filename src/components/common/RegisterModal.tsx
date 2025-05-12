// RegisterModal.tsx

import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/AuthService";
import { RegisterRequest, RegisterResponse } from "../../models/auth.models";
import { gunzip } from "zlib";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const registerData: RegisterRequest = {
      userName,
      password,
      fullName,
      phoneNumber,
    };

    try {
      // Регистрация через authService.register
      const response: RegisterResponse = await authService.register(registerData);
      await authService.login({userName, password})
      navigate("/login");
    } catch (err) {
      setError("Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={3}>
          Регистрация
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Имя пользователя"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="ФИО"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Номер телефона"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
            />

            {error && <Typography color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || userName.length === 0 || !password.length || phoneNumber.length != 11 || !fullName.length}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;

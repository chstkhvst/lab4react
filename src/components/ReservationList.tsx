import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  IconButton,
  Divider
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from '@mui/icons-material/Description';

import { ReservationContext } from "../context/ReservationContext";
import { ContractContext } from "../context/ContractContext";
import { AuthContext } from "../context/AuthContext";

import { Reservation, ResStatus } from "../models/reservation";

const ReservationList: React.FC = () => {
  const { reservations, resStatuses, updateReservation, refreshReservations } =
    useContext(ReservationContext)!;
  const { addContract } = useContext(ContractContext)!;
  const { currentUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleReject = async (reservation: Reservation) => {
    const rejectedStatus = resStatuses.find((s) => s.id === 3);
    if (!rejectedStatus) return;

    const isConfirmed = window.confirm("Вы уверены, что хотите отменить бронь?");
    if (!isConfirmed) return;

    try {
      await updateReservation(reservation.id, {
        ...reservation,
        resStatusId: rejectedStatus.id,
      });
    } catch (error) {
      console.error("Ошибка при отмене брони:", error);
    }
  };

  const handleCreateContract = async (reservation: Reservation) => {
    try {
      const contract = {
        reservationId: reservation.id,
        userId: currentUser?.id!,
        signDate: new Date().toISOString(),
        total: reservation.object?.price || 0,
      };

      await addContract(contract);
      await refreshReservations();
    } catch (error) {
      console.error("Ошибка при создании договора:", error);
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const getCurrentStatus = (reservation: Reservation) => {
    return resStatuses.find((s) => s.id === reservation.resStatusId);
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        p: 3
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mt: 3, 
          mb: 4,
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        Список бронирований
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
        {reservations.map((reservation) => {
          const currentStatus = getCurrentStatus(reservation);
          const statusId = currentStatus?.id;
          const statusName = currentStatus?.statusType || "Неизвестный статус";

          return (
            <Paper
              key={reservation.id}
              elevation={3}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.85)'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {reservation.object?.street}, д. {reservation.object?.building}
                {reservation.object?.roomnum && `, кв. ${reservation.object.roomnum}`}
              </Typography>

              <Chip
                label={statusName}
                color={
                  statusId === 1 ? "primary" :
                  statusId === 2 ? "success" :
                  statusId === 3 ? "error" : "default"
                }
                size="medium"
                sx={{ mb: 2 }}
              />

              <Box mb={2}>
                <Typography variant="body1">
                  <strong>Указанные даты бронирования: </strong> 
                  {formatDate( reservation.startDate)}
                  {reservation.endDate && ` — ${formatDate(reservation.endDate)}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {reservation.user && (
                <Box mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Информация о клиенте:
                  </Typography>
                  <Typography>
                    <strong>ФИО:</strong> {reservation.user.fullName || "Не указано"}
                  </Typography>
                  <Typography>
                    <strong>Логин:</strong> {reservation.user.userName}
                  </Typography>
                  <Typography>
                    <strong>Телефон:</strong> {reservation.user.phoneNumber || "Не указан"}
                  </Typography>
                </Box>
              )}

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                {statusId === 1 && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<DescriptionIcon />}
                      onClick={() => handleCreateContract(reservation)}
                    >
                      Договор
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleReject(reservation)}
                    >
                      Отменить
                    </Button>
                  </>
                )}

                {statusId === 2 && (
                  <Typography variant="body1" color="success.main">
                    Договор заключен
                  </Typography>
                )}

                {statusId === 3 && (
                  <Typography variant="body1" color="error.main">
                    Бронь отменена
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ReservationList;
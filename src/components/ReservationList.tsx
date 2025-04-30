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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

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
    const rejectedStatus = resStatuses.find((s) => s.id === 3); // ID=3 для "Отменена"
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
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
        Список бронирований
      </Typography>

      <Stack spacing={2}>
        {reservations.map((reservation) => {
          const currentStatus = getCurrentStatus(reservation);
          const statusId = currentStatus?.id;
          const statusName = currentStatus?.statusType || "Неизвестный статус";

          return (
            <Paper
              key={reservation.id}
              elevation={3}
              sx={{ p: 2, borderRadius: 2, position: "relative" }}
            >
              <Typography variant="h6" gutterBottom>
                {reservation.object?.street}, д. {reservation.object?.building}
                {reservation.object?.roomnum &&
                  `, кв. ${reservation.object.roomnum}`}
              </Typography>

              <Box mb={2}>
                <Chip
                  label={statusName}
                  color={
                    statusId === 1
                      ? "primary" // "Оставлена"
                      : statusId === 2
                      ? "success" // "Одобрена"
                      : statusId === 3
                      ? "error" // "Отменена"
                      : "default"
                  }
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>

              <Typography>
                <strong>Период брони:</strong> {formatDate(reservation.startDate)}{" "}
                - {formatDate(reservation.endDate)}
              </Typography>

              {reservation.user && (
                <Box mt={1}>
                  <Typography variant="subtitle1">
                    Информация о клиенте:
                  </Typography>
                  <Typography>
                    ФИО: {reservation.user.fullName || "Не указано"}
                  </Typography>
                  <Typography>Логин: {reservation.user.userName}</Typography>
                  <Typography>
                    Телефон: {reservation.user.phoneNumber || "Не указан"}
                  </Typography>
                </Box>
              )}

              <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                {statusId === 1 && ( // Только для статуса "Оставлена"
                  <>
                    <Button
                      variant="contained"
                      onClick={() => handleCreateContract(reservation)}
                    >
                      Составить договор
                    </Button>
                    <IconButton
                      color="error"
                      title="Отменить бронь"
                      onClick={() => handleReject(reservation)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                )}

                {statusId === 3 && (
                  <Typography variant="body2" color="text.secondary">
                    Бронь отменена
                  </Typography>
                )}

                {statusId === 2 && (
                  <Typography variant="body2" color="text.secondary">
                    Бронь одобрена, договор заключен
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
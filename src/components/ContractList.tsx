import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Divider,
  Button,
  Link,
  TextField,
  IconButton
} from "@mui/material";
import { ContractContext } from "../context/ContractContext";
import { Link as RouterLink } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const ContractList: React.FC = () => {
  const context = useContext(ContractContext);
  const [dateFilter, setDateFilter] = useState<string>("");

  if (!context) return <Typography>Ошибка загрузки контекста</Typography>;

  const { contracts } = context;

  const handleSearch = async () => {
    const dateObj = dateFilter ? new Date(dateFilter) : undefined;
    await context.fetchContracts(dateObj);
  };

  const handleReset = async () => {
    setDateFilter("");
    await context.fetchContracts();
  };

  if (!contracts.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={60} />
      </Box>
    );
  }

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
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: "primary.main", mb: 4 }}>
        Договоры
      </Typography>

      {/* Фильтр по дате */}
      <Paper sx={{ p: 2, mb: 4, maxWidth: 600, mx: "auto" }} elevation={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="date"
            label="Дата подписания"
            variant="outlined"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flexGrow: 1 }}
          />
          <IconButton color="primary" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <IconButton onClick={handleReset}>
            <RestartAltIcon />
          </IconButton>
        </Stack>
      </Paper>

      <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto" }}>
        {contracts.map((contract) => {
          const address = contract.reservation?.object
            ? `${contract.reservation.object.street}, д. ${contract.reservation.object.building}${
                contract.reservation.object.roomnum ? `, кв. ${contract.reservation.object.roomnum}` : ""
              }`
            : "Адрес не указан";

          const buyerName =
            contract.reservation?.user?.fullName || contract.reservation?.user?.userName || "Покупатель не указан";
          const adminName = contract.user?.fullName || contract.user?.userName || "Сотрудник не указан";

          const signDate = contract.signDate
            ? new Date(contract.signDate).toLocaleDateString("ru-RU")
            : "Дата не указана";

          return (
            <Paper
              key={contract.id}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 6
                },
                backgroundColor: "rgba(255, 255, 255, 0.9)"
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Договор №{contract.id}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Объект:</strong> {address}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main">
                  {contract.total.toLocaleString()} руб.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexWrap="wrap" gap={4}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Дата подписания
                  </Typography>
                  <Typography variant="body1">{signDate}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Покупатель
                  </Typography>
                  <Typography variant="body1">{buyerName}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Сотрудник
                  </Typography>
                  <Typography variant="body1">{adminName}</Typography>
                </Box>
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Link component={RouterLink} to={`/contracts/${contract.id}`} underline="none">
                  <Button variant="outlined" startIcon={<InfoIcon />}>
                    Подробнее
                  </Button>
                </Link>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ContractList;

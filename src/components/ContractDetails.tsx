import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContractContext } from "../context/ContractContext";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Button
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getContractById } = useContext(ContractContext)!;
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;

      try {
        const data = await getContractById(Number(id));
        setContract(data);
      } catch (error) {
        console.error("Ошибка при получении договора:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, getContractById]);

  const handlePrint = () => {
    const printContents = document.getElementById("print-area")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Печать договора</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              padding: 40px;
            }
            h4 {
              text-align: center;
              font-weight: 600;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 16px;
              line-height: 1.6;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
            }
            .signature {
              text-align: center;
            }
            .signature-line {
              margin-bottom: 8px;
            }
            .location-date {
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!contract) {
    return <Typography variant="h6">Договор не найден</Typography>;
  }

  const {
    id: contractId,
    signDate,
    total,
    reservation,
    user
  } = contract;

  const object = reservation?.object;
  const buyer = reservation?.user;
  const admin = user;

  const address = object
    ? `${object.street}, д. ${object.building}${object.roomnum ? `, кв. ${object.roomnum}` : ""}`
    : "Адрес не указан";

  const buyerName = buyer?.fullName || buyer?.userName || "Покупатель не указан";
  const adminName = admin?.fullName || admin?.userName || "Сотрудник не указан";
  const formattedDate = signDate ? new Date(signDate).toLocaleDateString("ru-RU") : "Дата не указана";

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(/nedviga.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        p: 4
      }}
    >
      <Box maxWidth={800} mx="auto">
        <Box display="flex" gap={2} mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            onClick={handlePrint}
          >
            Печать
          </Button>
        </Box>

        <Paper id="print-area" elevation={4} sx={{ p: 5, backgroundColor: "#fff" }}>
          <Typography variant="h4" gutterBottom>
            Договор купли-продажи недвижимости №{contractId}
          </Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph>
            <strong>Покупатель:</strong> {buyerName}
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Сотрудник:</strong> {adminName}
          </Typography>

          <Typography variant="body1" paragraph>
            Заключили настоящий договор:
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>1. Предмет договора</strong><br />
            Продавец обязуется передать в собственность, а Покупатель принять и оплатить следующий объект недвижимости:
          </Typography>

          <Typography variant="body1" paragraph sx={{ pl: 2 }}>
            Адрес: {address}<br />
            Площадь: {object?.square} м²<br />
            Цена: {total.toLocaleString()} рублей
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>2. Порядок расчетов</strong><br />
            Покупатель обязуется оплатить указанную сумму в полном объеме до подписания акта приёма-передачи.
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>3. Прочие условия</strong><br />
            Все изменения и дополнения к настоящему договору должны быть оформлены в письменной форме и подписаны обеими сторонами.
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>4. Подписи сторон</strong>
            </Typography>

            <Box display="flex" justifyContent="space-between" mt={5}>
            <Box textAlign="center" width="45%">
                <Typography variant="body1" sx={{ borderBottom: "1px solid #000", pb: 1 }}>
                {buyerName}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                Покупатель
                </Typography>
            </Box>

            <Box textAlign="center" width="45%">
                <Typography variant="body1" sx={{ borderBottom: "1px solid #000", pb: 1 }}>
                {adminName}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                Сотрудник
                </Typography>
            </Box>
            </Box>
          <Typography variant="body1" paragraph className="location-date">
            г. Москва, {formattedDate}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ContractDetails;

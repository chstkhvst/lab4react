import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Link,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import { REObject } from "../models/reobject"; 

interface Props {
  objects: REObject[];
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

const REObjectList: React.FC<Props> = ({ objects, onDelete, isLoading = false }) => {
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить объект?");
    if (isConfirmed && onDelete) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress size={60} />
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
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Объекты недвижимости
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/objects/add")}
        >
          Добавить объект
        </Button>
      </Box>

      <Stack spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {objects.map((reobject) => (
          <Paper
            key={reobject.id}
            elevation={3}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6
              },
              backgroundColor: 'rgba(255, 255, 255, 0.85)'
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {`${reobject.street}, д. ${reobject.building}${
                    reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""
                  }`}
                </Typography>

                {reobject.objectType && (
                  <Chip
                    label={reobject.objectType.typeName}
                    color="primary"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}

                {reobject.dealType && (
                  <Chip
                    label={reobject.dealType.dealName}
                    color="secondary"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}
              </Box>

              <Typography variant="h6" color="primary.main">
                {reobject.price.toLocaleString()} руб.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Площадь
                </Typography>
                <Typography variant="body1">
                  {reobject.square} м²
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Комнат
                </Typography>
                <Typography variant="body1">
                  {reobject.rooms}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Этажей
                </Typography>
                <Typography variant="body1">
                  {reobject.floors}
                </Typography>
              </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Link
                component={RouterLink}
                to={`/objects/${reobject.id}`}
                underline="none"
              >
                <Button
                  variant="outlined"
                  startIcon={<InfoIcon />}
                >
                  Подробнее
                </Button>
              </Link>

              {onDelete && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(reobject.id)}
                >
                  Удалить
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default REObjectList;
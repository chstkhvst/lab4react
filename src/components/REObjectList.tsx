import React, { useState, useEffect } from "react";
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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { REObject } from "../models/reobject"; 
import { useAuth } from "../context/AuthContext";

interface Props {
  objects: REObject[];
  onDelete?: (id: number) => void;
  objectTypes: Array<{ id: number; typeName: string }>;
  dealTypes: Array<{ id: number; dealName: string }>;
  statuses?: Array<{ id: number; statusName: string }>;
  onFilterChange?: (filters: { objectTypeId?: number; dealTypeId?: number; statusId?: number }) => void;
}

// const REObjectList: React.FC<Props> = ({ objects, onDelete }) => {
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     objectTypeId: undefined as number | undefined,
//     dealTypeId: undefined as number | undefined,
//     statusId: undefined as number | undefined,
//   });
const REObjectList: React.FC<Props> = ({ 
  objects, 
  onDelete,
  objectTypes = [],
  dealTypes = [],
  statuses = [],
  onFilterChange = () => {}
}) => {
  const navigate = useNavigate();
  const {isAdmin} = useAuth();
  const [filters, setFilters] = useState({
    objectTypeId: undefined as number | undefined,
    dealTypeId: undefined as number | undefined,
    statusId: undefined as number | undefined,
  });
  useEffect(() => {
    setFilters({
      objectTypeId: undefined,
      dealTypeId: undefined,
      statusId: undefined
    });
    onFilterChange({});
  }, [isAdmin]);
  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить объект?");
    if (isConfirmed && onDelete) {
      onDelete(id);
    }
  };
  const handleFilterChange = (name: keyof typeof filters, value: number | undefined) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange({
        objectTypeId: newFilters.objectTypeId,
        dealTypeId: newFilters.dealTypeId,
        statusId: newFilters.statusId
      });
    }
  };
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
    <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FilterAltIcon sx={{ mr: 1 }} /> Фильтры
      </Typography>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Тип объекта</InputLabel>
          <Select
            value={filters.objectTypeId || ''}
            label="Тип объекта"
            onChange={(e) => handleFilterChange('objectTypeId', e.target.value ? Number(e.target.value) : undefined)}
          >
            <MenuItem value="">Любой</MenuItem>
            {objectTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.typeName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Тип сделки</InputLabel>
          <Select
            value={filters.dealTypeId || ''}
            label="Тип сделки"
            onChange={(e) => handleFilterChange('dealTypeId', e.target.value ? Number(e.target.value) : undefined)}
          >
            <MenuItem value="">Любой</MenuItem>
            {dealTypes.map((deal) => (
              <MenuItem key={deal.id} value={deal.id}>{deal.dealName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isAdmin && (
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={filters.statusId || ''}
                label="Статус"
                onChange={(e) => handleFilterChange('statusId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <MenuItem value="">Любой</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>{status.statusName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
      </Stack>
    </Paper>

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
                {onDelete && reobject.status && (
                  <Chip
                    label={reobject.status.statusName}
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
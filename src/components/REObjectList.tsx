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
  MenuItem,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  styled
} from "@mui/material";
import { Pagination, PaginationItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HomeIcon from '@mui/icons-material/Home';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StairsIcon from '@mui/icons-material/Stairs';
import { REObject } from "../models/reobject"; 
import { useAuth } from "../context/AuthContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    borderLeft: `4px solid ${theme.palette.primary.main}`
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: theme.palette.primary.main
  }
}));

const PriceBadge = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

interface Props {
  objects: REObject[];
  onDelete?: (id: number) => void;
  objectTypes: Array<{ id: number; typeName: string }>;
  dealTypes: Array<{ id: number; dealName: string }>;
  statuses?: Array<{ id: number; statusName: string }>;
  onFilterChange?: (filters: { objectTypeId?: number; dealTypeId?: number; statusId?: number }) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

const REObjectList: React.FC<Props> = ({ 
  objects, 
  onDelete,
  objectTypes = [],
  dealTypes = [],
  statuses = [],
  onFilterChange = () => {},
  currentPage,
  totalPages,
  onPageChange,
  pageSize
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
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
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(/nedviga.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        p: 3
      }}
    >
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        borderRadius: 3,
        borderLeft: `4px solid ${theme.palette.primary.main}`
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 600,
          color: 'primary.main'
        }}>
          <FilterAltIcon sx={{ mr: 1, fontSize: 28 }} /> Фильтры объектов
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontWeight: 500 }}>Тип объекта</InputLabel>
            <Select
              value={filters.objectTypeId || ''}
              label="Тип объекта"
              onChange={(e) => handleFilterChange('objectTypeId', e.target.value ? Number(e.target.value) : undefined)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.3)
                }
              }}
            >
              <MenuItem value="">Любой</MenuItem>
              {objectTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.typeName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ fontWeight: 500 }}>Тип сделки</InputLabel>
            <Select
              value={filters.dealTypeId || ''}
              label="Тип сделки"
              onChange={(e) => handleFilterChange('dealTypeId', e.target.value ? Number(e.target.value) : undefined)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.3)
                }
              }}
            >
              <MenuItem value="">Любой</MenuItem>
              {dealTypes.map((deal) => (
                <MenuItem key={deal.id} value={deal.id}>{deal.dealName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {isAdmin && (
            <FormControl fullWidth>
              <InputLabel sx={{ fontWeight: 500 }}>Статус</InputLabel>
              <Select
                value={filters.statusId || ''}
                label="Статус"
                onChange={(e) => handleFilterChange('statusId', e.target.value ? Number(e.target.value) : undefined)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
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
          <StyledPaper
            key={reobject.id}
            elevation={3}
            sx={{ 
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <HomeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography 
                    variant="h5" 
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    {`${reobject.street}, д. ${reobject.building}${
                      reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""
                    }`}
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {reobject.objectType && (
                    <Chip
                      label={reobject.objectType.typeName}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}

                  {reobject.dealType && (
                    <Chip
                      label={reobject.dealType.dealName}
                      color="secondary"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {onDelete && reobject.status && (
                    <Chip
                      label={reobject.status.statusName}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
              </Box>

              <PriceBadge>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {reobject.price.toLocaleString()} ₽
                </Typography>
              </PriceBadge>
            </Box>

            <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.2) }} />

            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <SquareFootIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Площадь
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {reobject.square} м²
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MeetingRoomIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Комнат
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {reobject.rooms}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <StairsIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Этажей
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {reobject.floors}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Link
                component={RouterLink}
                to={`/objects/${reobject.id}`}
                underline="none"
              >
                <Button
                  variant="contained"
                  startIcon={<InfoIcon />}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Подробнее
                </Button>
              </Link>

              {onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(reobject.id)}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Удалить
                </Button>
              )}
            </Box>
          </StyledPaper>
        ))}
      </Stack>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          siblingCount={0} // Показывать только текущую страницу по бокам
          boundaryCount={1} // Всегда показывать первую и последнюю страницы
          renderItem={(item) => {
            // Показываем многоточие если страниц > 5
            const showEllipsis = totalPages > 5 && 
                                (item.type === 'start-ellipsis' || item.type === 'end-ellipsis');
            
            return (
              <PaginationItem
                {...item}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: '50%',
                  fontWeight: item.page === currentPage ? 700 : 500,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
                }}
                // Скрываем многоточие если страниц <= 5
                style={{ display: !showEllipsis && item.type?.includes('ellipsis') ? 'none' : 'flex' }}
              />
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default REObjectList;
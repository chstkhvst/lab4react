import React, { useContext } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import REObjectList from '../REObjectList';
import { REObjectContext } from '../../context/REObjectContext';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const ObjectPage: React.FC = () => {
  const context = useContext(REObjectContext);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate()

  if (!context) {
    return <Typography>Контекст не найден</Typography>;
  }

  const { reobjects, deleteREObject, fetchFilteredObjects } = context;
  const handleFilterChange = async (filters: {
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }) => {
    await fetchFilteredObjects(filters);
  };

  const handleResetFilters = async () => {
    await fetchFilteredObjects({}); // Пустые фильтры = сброс
  };

  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      py: 6
    }}>
      <Container>
        <Box sx={{
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Typography variant="h4" gutterBottom>
            Список объектов недвижимости
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/objects/add")}
            sx={{ mb: 4 }}
            startIcon={<AddIcon />}
          >
            Добавить новый объект
          </Button>
          <REObjectList 
            objects={reobjects} 
            onDelete={deleteREObject} 
            objectTypes={context.objectTypes}
            dealTypes={context.dealTypes}
            statuses={context.statuses}
            onFilterChange={handleFilterChange}
          />
          
        </Box>
      </Container>
    </Box>
  );

};

export default ObjectPage;

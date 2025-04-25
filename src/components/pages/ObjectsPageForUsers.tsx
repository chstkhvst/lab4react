import React, { useContext } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import REObjectList from '../REObjectList';
import { REObjectContext } from '../../context/REObjectContext';
import { Link } from 'react-router-dom';

const ObjectsPageForUsers: React.FC = () => {
  const context = useContext(REObjectContext);

  if (!context) {
    return <Typography>Контекст не найден</Typography>;
  }

  const { reobjects } = context; // Берем только reobjects

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
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 4
            }}
          >
            Объекты недвижимости
          </Typography>
          <REObjectList objects={reobjects} />
        </Box>
      </Container>
      </Box>
  );
};

export default ObjectsPageForUsers;

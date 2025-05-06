import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Email, Apartment, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openContact, setOpenContact] = useState(false);
  const {user, isAdmin} = useAuth();

  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      py: 8
    }}>
      <Container maxWidth="sm">
        <Box sx={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          p: 6,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              color: 'primary.main'
            }}
          >
            Добро пожаловать в REA!
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Apartment />}
              onClick={() => {
                if(user && !isAdmin)
                  navigate('/objects-for-users')
                if (user && isAdmin)
                  navigate('/objects')
                else
                  alert("Войдите в систему или зарегистрируйтесь!")
              }}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: 1
              }}
            >
              Перейти к объектам
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Email />}
              onClick={() => setOpenContact(true)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: 1
              }}
            >
              Связаться
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Contact Dialog */}
      <Dialog open={openContact} onClose={() => setOpenContact(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Контакты
          <IconButton onClick={() => setOpenContact(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Электронная почта:
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.100',
              borderRadius: 1,
              display: 'inline-block'
            }}
          >
            22474@gapps.ispu.ru
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText('22474@gapps.ispu.ru');
              setOpenContact(false);
            }}
            color="primary"
          >
            Скопировать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
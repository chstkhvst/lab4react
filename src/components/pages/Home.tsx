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
  IconButton,
  Paper,
  useTheme,
  Divider,
  Slide,
  Grow,
  Avatar
} from '@mui/material';
import { Email, Apartment, Close, Home as HomeIcon, ContactMail, CopyAll } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openContact, setOpenContact] = useState(false);
  const {user, isAdmin} = useAuth();
  const theme = useTheme();
  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      py: 8,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.65)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Grow in={true} timeout={800}>
          <Paper elevation={10} sx={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            p: 4,
            borderRadius: 4,
            boxShadow: theme.shadows[10],
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: theme.palette.primary.main
            }
          }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 80, 
              height: 80,
              mb: 3,
              mx: 'auto',
              boxShadow: theme.shadows[4]
            }}>
              <HomeIcon sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                mb: 4,
                color: 'primary.main',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: 1
              }}
            >
              Добро пожаловать в REA!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
              Надежные решения в мире недвижимости
            </Typography>
            
            <Divider sx={{ my: 3, mx: 'auto', width: '60%' }} />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              mt: 4
            }}>
              <Slide in={true} direction="right" timeout={500}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<Apartment sx={{ fontSize: 28 }} />}
                  onClick={() => {
                    if(user && !isAdmin)
                      navigate('/objects-for-users')
                    if (user && isAdmin)
                      navigate('/objects')
                    if (!user)
                      alert("Войдите в систему или зарегистрируйтесь!")
                  }}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    minWidth: 250,
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Перейти к объектам
                </Button>
              </Slide>
              
              <Slide in={true} direction="left" timeout={500}>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<ContactMail sx={{ fontSize: 28 }} />}
                  onClick={() => setOpenContact(true)}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    minWidth: 250,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Связаться
                </Button>
              </Slide>
            </Box>
          </Paper>
        </Grow>
      </Container>

      {/* Contact Dialog */}
      <Dialog 
        open={openContact} 
        onClose={() => setOpenContact(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 2,
          pl: 3,
          pr: 2,
        }}>
          <Box display="flex" alignItems="center">
            <Email sx={{ mr: 1 }} />
            <Typography variant="h6">Контакты</Typography>
          </Box>
          <IconButton onClick={() => setOpenContact(false)} sx={{ color: 'secondary.contrastText' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={1}sx={{ mt: 4 }}>
            <Avatar sx={{ 
              bgcolor: 'secondary.main', 
              width: 60, 
              height: 60,
              mb: 4,
              mx: 'auto'
            }}>
              <ContactMail fontSize="large" />
            </Avatar>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Свяжитесь с нами по электронной почте:
            </Typography>
            <Paper elevation={3} sx={{ 
              p: 2, 
              backgroundColor: 'grey.50',
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Email color="primary" />
              <Typography variant="h6" component="span">
                22474@gapps.ispu.ru
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText('22474@gapps.ispu.ru');
              setOpenContact(false);
            }}
            variant="contained"
            startIcon={<CopyAll />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2
            }}
          >
            Скопировать email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
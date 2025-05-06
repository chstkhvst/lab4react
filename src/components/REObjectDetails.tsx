import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { REObjectContext } from "../context/REObjectContext";
import { useAuth } from "../context/AuthContext";
import { REObject } from "../models/reobject";
import APIService from "../services/APIService";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select,
  Chip,
  Paper,
  FormLabel,
  Icon
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const REObjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const context = useContext(REObjectContext)!;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [reobject, setREObject] = useState<REObject | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState<REObject | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const fetchREObject = async () => {
    if (id) {
      try {
        const fetchedObject = await APIService.getREObjectById(parseInt(id, 10));
        setREObject(fetchedObject);
        setFormState(fetchedObject);
      } catch (error) {
        console.error("Failed to fetch object:", error);
        alert("Failed to load object details.");
      }
    }
  };

  useEffect(() => {
    if (context) {
      const foundObject = context.reobjects.find(obj => obj.id === parseInt(id || "", 10));
      if (foundObject) {
        setREObject(foundObject);
        setFormState(foundObject);
      } else {
        fetchREObject();
      }
    }
  }, [context, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (formState && context) {
      try {
        const updatedData: Omit<REObject, "id"> = {
          street: formState.street,
          building: formState.building,
          roomnum: formState.roomnum,
          rooms: formState.rooms,
          floors: formState.floors,
          square: formState.square,
          price: formState.price,
          dealtypeid: formState.dealType.id,
          typeid: formState.objectType.id,
          statusid: formState.status.id,
          dealType: formState.dealType,
          objectType: formState.objectType,
          status: formState.status,
          objectImages: formState.objectImages?.filter(img => !imagesToDelete.includes(img.id))
        };
  
        const updatedObject = await context.updateREObject(
          formState.id, 
          updatedData,
          files,
          imagesToDelete
        );
        
        setREObject(updatedObject);
        setEditMode(false);
        setFiles([]);
        setImagesToDelete([]);
      } catch (error) {
        console.error("Failed to update object:", error);
        alert(error instanceof Error ? error.message : "Failed to update object");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!reobject) {
    return <Typography variant="h6">Объект не найден!</Typography>;
  }

  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      p: 3,
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mt: 3,
          mb: 4,
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        {editMode ? "Редактирование объекта" : "Детали объекта недвижимости"}
      </Typography>

      {!editMode ? (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
          <Stack spacing={2}>
            {reobject.objectImages && reobject.objectImages.length > 0 && (
              <Box sx={{ 
                height: 500,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  slidesPerView={1}
                  style={{ 
                    height: '100%'
                  }}
                >
                  {reobject.objectImages!.map((image) => (
                    <SwiperSlide key={image.id}>
                      <img 
                        src={"https://localhost:7020/"+image.imagePath} 
                        alt={`Объект ${reobject.id}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}

            <Typography variant="h6">
              <strong>Адрес:</strong>{" "}
              {`${reobject.street}, д. ${reobject.building}${reobject.roomnum != null ? `, кв. ${reobject.roomnum}` : ""}`}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2}>
              {reobject.objectType?.typeName && (
                <Chip 
                  label={`Тип: ${reobject.objectType.typeName}`} 
                  color="primary" 
                  variant="outlined"
                />
              )}
              {reobject.dealType?.dealName && (
                <Chip 
                  label={`Сделка: ${reobject.dealType.dealName}`} 
                  color="secondary" 
                  variant="outlined"
                />
              )}
              {reobject.status?.statusName && (
                <Chip 
                  label={`Статус: ${reobject.status.statusName}`} 
                  variant="outlined"
                />
              )}
            </Box>

            <Divider />

            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Площадь</Typography>
                <Typography>{reobject.square} м²</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Этажей</Typography>
                <Typography>{reobject.floors}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Комнат</Typography>
                <Typography>{reobject.rooms}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Цена</Typography>
                <Typography>{reobject.price.toLocaleString()} руб.</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} mt={4}>
              {isAdmin && (
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Редактировать
                </Button>
              )}
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(isAdmin ? "/objects" : "/objects-for-users")}
              >
                Назад к списку
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Улица"
                  required
                  fullWidth
                  value={formState?.street || ""}
                  onChange={(e) => setFormState({ ...formState!, street: e.target.value })}
                />
                <TextField
                  label="Дом"
                  required
                  type="number"
                  fullWidth
                  value={formState?.building || ""}
                  onChange={(e) => setFormState({ ...formState!, building: Number(e.target.value) })}
                />
                <TextField
                  label="Квартира"
                  type="number"
                  fullWidth
                  value={formState?.roomnum || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState!,
                      roomnum: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Комнат"
                  required
                  type="number"
                  fullWidth
                  value={formState?.rooms || ""}
                  onChange={(e) => setFormState({ ...formState!, rooms: Number(e.target.value) })}
                />
                <TextField
                  label="Этажей"
                  required
                  type="number"
                  fullWidth
                  value={formState?.floors || ""}
                  onChange={(e) => setFormState({ ...formState!, floors: Number(e.target.value) })}
                />
                <TextField
                  label="Площадь"
                  required
                  type="number"
                  fullWidth
                  value={formState?.square || ""}
                  onChange={(e) => setFormState({ ...formState!, square: Number(e.target.value) })}
                />
                <TextField
                  label="Цена"
                  required
                  type="number"
                  fullWidth
                  value={formState?.price || ""}
                  onChange={(e) => setFormState({ ...formState!, price: Number(e.target.value) })}
                />
              </Stack>
              <FormControl fullWidth>
              <FormLabel>Изображения объекта</FormLabel>

              {/* Секция существующих изображений */}
              {formState?.objectImages && formState.objectImages.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Текущие изображения
                  </Typography>
                  <Box 
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      mt: 2,
                      p: 2,
                      border: '1px dashed #ccc',
                      borderRadius: 1
                    }}
                  >
                    {formState.objectImages.map(image => (
                      <Box 
                        key={image.id}
                        sx={{
                          position: 'relative',
                          border: imagesToDelete.includes(image.id) 
                            ? '2px solid red' 
                            : '1px solid #ddd',
                          borderRadius: 1,
                          p: 1,
                          opacity: imagesToDelete.includes(image.id) ? 0.6 : 1
                        }}
                      >
                        <img
                          src={`https://localhost:7020/${image.imagePath}`}
                          alt={`Объект ${image.id}`}
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover'
                          }}
                        />
                        <Box 
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              if (imagesToDelete.includes(image.id)) {
                                setImagesToDelete(imagesToDelete.filter(id => id !== image.id));
                              } else {
                                setImagesToDelete([...imagesToDelete, image.id]);
                              }
                            }}
                            color={imagesToDelete.includes(image.id) ? "error" : "primary"}
                            sx={{
                              backgroundColor: 'rgba(213, 29, 29, 0.7)'
                            }}
                          >
                            {imagesToDelete.includes(image.id) ? "Отменить" : "Удалить"}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  {imagesToDelete.length > 0 && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      Выбранные изображения будут удалены
                    </Typography>
                  )}
                </Box>
              )}
            </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Тип сделки</InputLabel>
                <Select
                  value={formState?.dealType?.id || ""}
                  label="Тип сделки"
                  onChange={(e) => {
                    const selected = context.dealTypes.find(dt => dt.id === Number(e.target.value));
                    if (selected) {
                      setFormState({ ...formState!, dealtypeid: selected.id, dealType: selected });
                    }
                  }}
                >
                  {context.dealTypes.map((dt) => (
                    <MenuItem key={dt.id} value={dt.id}>{dt.dealName}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Тип объекта</InputLabel>
                <Select
                  value={formState?.objectType?.id || ""}
                  label="Тип объекта"
                  onChange={(e) => {
                    const selected = context.objectTypes.find(ot => ot.id === Number(e.target.value));
                    if (selected) {
                      setFormState({ ...formState!, typeid: selected.id, objectType: selected });
                    }
                  }}
                >
                  {context.objectTypes.map((ot) => (
                    <MenuItem key={ot.id} value={ot.id}>{ot.typeName}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formState?.status?.id || ""}
                  label="Статус"
                  onChange={(e) => {
                    const selected = context.statuses.find(s => s.id === Number(e.target.value));
                    if (selected) {
                      setFormState({ ...formState!, statusid: selected.id, status: selected });
                    }
                  }}
                >
                  {context.statuses.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.statusName}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Добавить изображения</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ marginTop: 8 }}
                />
                {files.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Выбрано новых файлов: {files.length}
                  </Typography>
                )}
              </FormControl>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="success"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<CancelIcon />}
                  onClick={() => setEditMode(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default REObjectDetails;
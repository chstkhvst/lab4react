import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormLabel,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { REObjectContext } from "../context/REObjectContext";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const REObjectForm: React.FC = () => {
  const context = useContext(REObjectContext)!;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: "",
    building: "",
    roomnum: "",
    rooms: "",
    floors: "",
    square: "",
    price: "",
    dealtypeid: "",
    typeid: "",
    statusid: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleTextChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: { [key: string]: string } = {};
  
    const requiredFields = [
      "street", "building", "rooms", "floors", 
      "square", "price", "dealtypeid", "typeid", "statusid"
    ];
  
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "Поле обязательно";
      }
    }
  
    const num = (val: string) => Number(val);
  
    if (formData.street && !/^[А-Яа-яA-Za-z\s\-]+$/.test(formData.street)) {
      newErrors["street"] = "Введите корректное название улицы";
    }
  
    if (formData.building && (num(formData.building) < 1 || num(formData.building) > 200)) {
      newErrors["building"] = "Введите корректный номер дома";
    }
  
    if (formData.roomnum && (num(formData.roomnum) < 1 || num(formData.roomnum) > 999)) {
      newErrors["roomnum"] = "Введите корректный номер квартиры";
    }
  
    if (formData.rooms && (num(formData.rooms) < 1 || num(formData.rooms) > 50)) {
      newErrors["rooms"] = "Введите реальное количество комнат";
    }
  
    if (formData.floors && (num(formData.floors) < 1 || num(formData.floors) > 3)) {
      newErrors["floors"] = "Введите реальное количество этажей, занимаемых объектом";
    }
  
    if (formData.square && (num(formData.square) < 10 || num(formData.square) > 3000)) {
      newErrors["square"] = "Введите реальную площадь";
    }
  
    if (formData.price && (num(formData.price) < 5000 || num(formData.price) > 30000000)) {
      newErrors["price"] = "Введите реальную стоимость";
    }
    if (formData.price && num(formData.dealtypeid) == 2 && (num(formData.price) < 300000 || num(formData.price) > 30000000)) {
      newErrors["price"] = "Стоимость слишком мала для продажи";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const selectedDealType = context.dealTypes.find(dt => dt.id === Number(formData.dealtypeid));
      const selectedObjectType = context.objectTypes.find(ot => ot.id === Number(formData.typeid));
      const selectedStatus = context.statuses.find(s => s.id === Number(formData.statusid));
  
      const newObject = {
        street: formData.street,
        building: Number(formData.building),
        roomnum: formData.roomnum ? Number(formData.roomnum) : undefined,
        rooms: Number(formData.rooms),
        floors: Number(formData.floors),
        square: Number(formData.square),
        price: Number(formData.price),
        dealtypeid: Number(formData.dealtypeid),
        typeid: Number(formData.typeid),
        statusid: Number(formData.statusid),
        dealType: selectedDealType || {
          id: Number(formData.dealtypeid),
          dealName: ""
        },
        objectType: selectedObjectType || {
          id: Number(formData.typeid),
          typeName: ""
        },
        status: selectedStatus || {
          id: Number(formData.statusid),
          statusName: ""
        }
      };
  
      await context.addREObject(newObject, files);
      navigate("/objects");
    } catch (error) {
      console.error("Ошибка при создании объекта:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

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
        sx={{ mt: 3, mb: 4, fontWeight: 600, color: 'primary.main' }}
      >
        Добавление нового объекта недвижимости
      </Typography>

      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Улица"
                required
                fullWidth
                value={formData.street}
                onChange={handleTextChange("street")}
                error={!!errors.street}
                helperText={errors.street}
              />
              <TextField
                label="Дом"
                required
                type="number"
                fullWidth
                value={formData.building}
                onChange={handleTextChange("building")}
                error={!!errors.building}
                helperText={errors.building}
              />
              <TextField
                label="Квартира"
                type="number"
                fullWidth
                value={formData.roomnum}
                onChange={handleTextChange("roomnum")}
                error={!!errors.roomnum}
                helperText={errors.roomnum}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Комнат"
                required
                type="number"
                fullWidth
                value={formData.rooms}
                onChange={handleTextChange("rooms")}
                error={!!errors.rooms}
                helperText={errors.rooms}
              />
              <TextField
                label="Этажей"
                required
                type="number"
                fullWidth
                value={formData.floors}
                onChange={handleTextChange("floors")}
                error={!!errors.floors}
                helperText={errors.floors}
              />
              <TextField
                label="Площадь"
                required
                type="number"
                fullWidth
                value={formData.square}
                onChange={handleTextChange("square")}
                error={!!errors.square}
                helperText={errors.square}
              />
              <TextField
                label="Цена"
                required
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleTextChange("price")}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Stack>

            <FormControl fullWidth required>
              <InputLabel htmlFor="deal-type-select">Тип сделки</InputLabel>
              <Select
              role="listbox"
                labelId="deal-type-label"
                id="deal-type-select"
                value={formData.dealtypeid}
                label="Тип сделки"
                onChange={handleSelectChange("dealtypeid")}
                inputProps={{
                'aria-labelledby': 'deal-type-label',
                'data-testid': 'deal-type-select'
                }}
                MenuProps={{ disablePortal: true }}
              >
                {context.dealTypes.map((dt) => (
                  <MenuItem key={dt.id} value={dt.id}>
                    {dt.dealName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel htmlFor="object-type-select">Тип объекта</InputLabel>
              <Select
                role="listbox"
                labelId="object-type-label"
                id="object-type-select"
                value={formData.typeid}
                label="Тип объекта"
                onChange={handleSelectChange("typeid")}
                    inputProps={{
                  'aria-labelledby': 'object-type-label',
                  'data-testid': 'object-type-select'
                }}
                MenuProps={{ disablePortal: true }}
              >
                {context.objectTypes.map((ot) => (
                  <MenuItem key={ot.id} value={ot.id}>
                    {ot.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel htmlFor="status-select">Статус</InputLabel>
              <Select
              role="listbox"
                labelId="status-label"
                id="status-select"
                value={formData.statusid}
                label="Статус"
                onChange={handleSelectChange("statusid")}
                inputProps={{
                  'aria-labelledby': 'status-label',
                  'data-testid': 'status-select'
                }}
                MenuProps={{ disablePortal: true }}
              >
                {context.statuses.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.statusName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Добавить изображения</FormLabel>
              <input
              data-testid="file-input"
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
                onClick={() => navigate("/objects")}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default REObjectForm;

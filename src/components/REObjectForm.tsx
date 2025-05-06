// import React, { useState, useContext } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Stack,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { REObjectContext } from "../context/REObjectContext";
// import { REObject } from "../models/reobject";

// const REObjectForm: React.FC = () => {
//   const context = useContext(REObjectContext)!;
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     street: "",
//     building: "",
//     roomnum: "",
//     rooms: "",
//     floors: "",
//     square: "",
//     price: "",
//     dealtypeid: "",
//     typeid: "",
//     statusid: "",
//   });

//   const handleChange = (field: keyof typeof formData) => 
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData({ ...formData, [field]: e.target.value });
//     };

//   const handleSelectChange = (field: string) => (e: any) => {
//     setFormData({ ...formData, [field]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Проверка заполненности обязательных полей
//     const requiredFields = [
//       "street", "building", "rooms", "floors", 
//       "square", "price", "dealtypeid", "typeid", "statusid"
//     ];

//     for (const field of requiredFields) {
//       const value = formData[field as keyof typeof formData];
//       if (typeof value === "string" && value.trim() === "") {
//         alert(`Пожалуйста, заполните поле: ${field}`);
//         return;
//       }
//       if (value === "") {
//         alert(`Пожалуйста, заполните поле: ${field}`);
//         return;
//       }
//     }

//     if (context) {
//       // Находим выбранные справочные значения
//       const selectedDealType = context.dealTypes.find(dt => dt.id === Number(formData.dealtypeid));
//       const selectedObjectType = context.objectTypes.find(ot => ot.id === Number(formData.typeid));
//       const selectedStatus = context.statuses.find(s => s.id === Number(formData.statusid));

//       // Создаем объект в формате, соответствующем REObject
//       const newObject: Omit<REObject, "id"> = {
//         street: formData.street,
//         building: Number(formData.building),
//         roomnum: formData.roomnum ? Number(formData.roomnum) : undefined,
//         rooms: Number(formData.rooms),
//         floors: Number(formData.floors),
//         square: Number(formData.square),
//         price: Number(formData.price),
//         dealtypeid: Number(formData.dealtypeid),
//         typeid: Number(formData.typeid),
//         statusid: Number(formData.statusid),
//         dealType: selectedDealType || {
//           id: Number(formData.dealtypeid),
//           dealName: ""
//         },
//         objectType: selectedObjectType || {
//           id: Number(formData.typeid),
//           typeName: ""
//         },
//         status: selectedStatus || {
//           id: Number(formData.statusid),
//           statusName: ""
//         }
//       };

//       context.addREObject(newObject);
//       navigate("/objects");
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Добавить объект недвижимости
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField
//             label="Улица"
//             required
//             fullWidth
//             value={formData.street}
//             onChange={handleChange("street")}
//           />
//           <TextField
//             label="Дом"
//             required
//             fullWidth
//             value={formData.building}
//             onChange={handleChange("building")}
//           />
//           <TextField
//             label="Квартира (необязательно)"
//             fullWidth
//             value={formData.roomnum}
//             onChange={handleChange("roomnum")}
//           />
//           <TextField
//             label="Комнат"
//             required
//             fullWidth
//             type="number"
//             value={formData.rooms}
//             onChange={handleChange("rooms")}
//           />
//           <TextField
//             label="Этажей"
//             required
//             fullWidth
//             type="number"
//             value={formData.floors}
//             onChange={handleChange("floors")}
//           />
//           <TextField
//             label="Площадь (м²)"
//             required
//             fullWidth
//             type="number"
//             value={formData.square}
//             onChange={handleChange("square")}
//           />
//           <TextField
//             label="Цена"
//             required
//             fullWidth
//             type="number"
//             value={formData.price}
//             onChange={handleChange("price")}
//           />

//           {/* Выпадающий список для типа сделки */}
//           <FormControl fullWidth required>
//             <InputLabel>Тип сделки</InputLabel>
//             <Select
//               value={formData.dealtypeid}
//               label="Тип сделки"
//               onChange={handleSelectChange("dealtypeid")}
//             >
//               {context.dealTypes.map((dt) => (
//                 <MenuItem key={dt.id} value={dt.id}>
//                   {dt.dealName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Выпадающий список для типа объекта */}
//           <FormControl fullWidth required>
//             <InputLabel>Тип объекта</InputLabel>
//             <Select
//               value={formData.typeid}
//               label="Тип объекта"
//               onChange={handleSelectChange("typeid")}
//             >
//               {context.objectTypes.map((ot) => (
//                 <MenuItem key={ot.id} value={ot.id}>
//                   {ot.typeName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Выпадающий список для статуса */}
//           <FormControl fullWidth required>
//             <InputLabel>Статус</InputLabel>
//             <Select
//               value={formData.statusid}
//               label="Статус"
//               onChange={handleSelectChange("statusid")}
//             >
//               {context.statuses.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.statusName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
//             <Button type="submit" variant="contained" color="primary">
//               Добавить
//             </Button>
//             <Button variant="outlined" onClick={() => navigate("/objects")}>
//               Назад
//             </Button>
//           </Box>
//         </Stack>
//       </form>
//     </Container>
//   );
// };

// export default REObjectForm;

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
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { REObjectContext } from "../context/REObjectContext";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const REObjectForm: React.FC = () => {
  const context = useContext(REObjectContext)!;
  const navigate = useNavigate();

  // Состояние формы
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

  // Обработчики изменений
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

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Валидация
      const requiredFields = [
        "street", "building", "rooms", "floors", 
        "square", "price", "dealtypeid", "typeid", "statusid"
      ];
  
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`Пожалуйста, заполните поле: ${field}`);
        }
      }

      const selectedDealType = context.dealTypes.find(dt => dt.id === Number(formData.dealtypeid));
      const selectedObjectType = context.objectTypes.find(ot => ot.id === Number(formData.typeid));
      const selectedStatus = context.statuses.find(s => s.id === Number(formData.statusid));
      
      // Подготовка объекта
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
      alert(error instanceof Error ? error.message : "Произошла ошибка при создании объекта");
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
        sx={{ 
          mt: 3,
          mb: 4,
          fontWeight: 600,
          color: 'primary.main'
        }}
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
              />
              <TextField
                label="Дом"
                required
                type="number"
                fullWidth
                value={formData.building}
                onChange={handleTextChange("building")}
              />
              <TextField
                label="Квартира"
                type="number"
                fullWidth
                value={formData.roomnum}
                onChange={handleTextChange("roomnum")}
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
              />
              <TextField
                label="Этажей"
                required
                type="number"
                fullWidth
                value={formData.floors}
                onChange={handleTextChange("floors")}
              />
              <TextField
                label="Площадь"
                required
                type="number"
                fullWidth
                value={formData.square}
                onChange={handleTextChange("square")}
              />
              <TextField
                label="Цена"
                required
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleTextChange("price")}
              />
            </Stack>

            <FormControl fullWidth required>
              <InputLabel>Тип сделки</InputLabel>
              <Select
                value={formData.dealtypeid}
                label="Тип сделки"
                onChange={handleSelectChange("dealtypeid")}
              >
                {context.dealTypes.map((dt) => (
                  <MenuItem key={dt.id} value={dt.id}>
                    {dt.dealName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Тип объекта</InputLabel>
              <Select
                value={formData.typeid}
                label="Тип объекта"
                onChange={handleSelectChange("typeid")}
              >
                {context.objectTypes.map((ot) => (
                  <MenuItem key={ot.id} value={ot.id}>
                    {ot.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Статус</InputLabel>
              <Select
                value={formData.statusid}
                label="Статус"
                onChange={handleSelectChange("statusid")}
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
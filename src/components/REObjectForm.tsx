import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { REObjectContext } from "../context/REObjectContext";
import { REObject } from "../models/reobject";

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

  const handleChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка заполненности обязательных полей
    const requiredFields = [
      "street", "building", "rooms", "floors", 
      "square", "price", "dealtypeid", "typeid", "statusid"
    ];

    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (typeof value === "string" && value.trim() === "") {
        alert(`Пожалуйста, заполните поле: ${field}`);
        return;
      }
      if (value === "") {
        alert(`Пожалуйста, заполните поле: ${field}`);
        return;
      }
    }

    if (context) {
      // Находим выбранные справочные значения
      const selectedDealType = context.dealTypes.find(dt => dt.id === Number(formData.dealtypeid));
      const selectedObjectType = context.objectTypes.find(ot => ot.id === Number(formData.typeid));
      const selectedStatus = context.statuses.find(s => s.id === Number(formData.statusid));

      // Создаем объект в формате, соответствующем REObject
      const newObject: Omit<REObject, "id"> = {
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

      context.addREObject(newObject);
      navigate("/objects");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Добавить объект недвижимости
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Улица"
            required
            fullWidth
            value={formData.street}
            onChange={handleChange("street")}
          />
          <TextField
            label="Дом"
            required
            fullWidth
            value={formData.building}
            onChange={handleChange("building")}
          />
          <TextField
            label="Квартира (необязательно)"
            fullWidth
            value={formData.roomnum}
            onChange={handleChange("roomnum")}
          />
          <TextField
            label="Комнат"
            required
            fullWidth
            type="number"
            value={formData.rooms}
            onChange={handleChange("rooms")}
          />
          <TextField
            label="Этажей"
            required
            fullWidth
            type="number"
            value={formData.floors}
            onChange={handleChange("floors")}
          />
          <TextField
            label="Площадь (м²)"
            required
            fullWidth
            type="number"
            value={formData.square}
            onChange={handleChange("square")}
          />
          <TextField
            label="Цена"
            required
            fullWidth
            type="number"
            value={formData.price}
            onChange={handleChange("price")}
          />

          {/* Выпадающий список для типа сделки */}
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

          {/* Выпадающий список для типа объекта */}
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

          {/* Выпадающий список для статуса */}
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

          <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Добавить
            </Button>
            <Button variant="outlined" onClick={() => navigate("/objects")}>
              Назад
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export default REObjectForm;
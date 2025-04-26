// export default REObjectDetails 
import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { REObjectContext } from "../context/REObjectContext"
import { useAuth } from "../context/AuthContext"
import { REObject } from "../models/reobject"
import APIService from "../services/APIService"
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider, FormControl, InputLabel, MenuItem, Select
} from "@mui/material"

const REObjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const context = useContext(REObjectContext)!
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [reobject, setREObject] = useState<REObject | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formState, setFormState] = useState<REObject | null>(null)

  const fetchREObject = async () => {
    if (id) {
      try {
        const fetchedObject = await APIService.getREObjectById(parseInt(id, 10))
        setREObject(fetchedObject)
        setFormState(fetchedObject)
      } catch (error) {
        console.error("Failed to fetch object:", error)
        alert("Failed to load object details.")
      }
    }
  }

  useEffect(() => {
    if (context) {
      const foundObject = context.reobjects.find(obj => obj.id === parseInt(id || "", 10))
      if (foundObject) {
        setREObject(foundObject)
        setFormState(foundObject)
      } else {
        fetchREObject()
      }
    }
  }, [context, id])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        }

        const updatedObject = await APIService.updateREObject(formState.id, updatedData)
        setREObject(updatedObject)
        context.updateREObject(formState.id, updatedData)
        setEditMode(false)
      } catch (error) {
        console.error("Failed to update object:", error)
        alert("Failed to update object.")
      }
    }
  }

  if (!reobject) {
    return <Typography variant="h6">Объект не найден!</Typography>
  }

  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/nedviga.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      p: 3
    }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
        Детали объекта недвижимости
      </Typography>

      {!editMode ? (
        <Box>
          <Typography>
          <strong>Адрес:</strong>{" "}
          {`${reobject.street}, д. ${reobject.building}${reobject.roomnum != null ? `, кв. ${reobject.roomnum}` : ""}`}
        </Typography>

          {reobject.objectType?.typeName && (
          <Typography><strong>Тип объекта:</strong> {reobject.objectType.typeName}</Typography>
          )}
          {reobject.dealType?.dealName && (
          <Typography><strong>Тип сделки:</strong> {reobject.dealType.dealName}</Typography>
          )}
          {reobject.status?.statusName && (
              <Typography><strong>Статус:</strong> {reobject.status.statusName}</Typography>
          )}
          <Typography><strong>Площадь:</strong> {reobject.square} м²</Typography>
          <Typography><strong>Этажей:</strong> {reobject.floors}</Typography>
          <Typography><strong>Количество комнат:</strong> {reobject.rooms}</Typography>
          <Typography><strong>Цена:</strong> {reobject.price} руб.</Typography>

          <Stack direction="row" spacing={2} mt={3}>
            {isAdmin && (
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Редактировать
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate(isAdmin ? "/objects" : "/objects-for-users")}>
              Назад к списку
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} divider={<Divider />}>
          <TextField
              label="Улица"
              required
              value={formState?.street || ""}
              onChange={(e) => setFormState({ ...formState!, street: e.target.value })}
            />
            <TextField
              label="Дом"
              required
              type="number"
              value={formState?.building || ""}
              onChange={(e) => setFormState({ ...formState!, building: Number(e.target.value) })}
            />
            <TextField
              label="Квартира"
              type="number"
              value={formState?.roomnum || ""}
              onChange={(e) =>
                setFormState({
                  ...formState!,
                  roomnum: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <TextField
              label="Комнат"
              required
              type="number"
              value={formState?.rooms || ""}
              onChange={(e) => setFormState({ ...formState!, rooms: Number(e.target.value) })}
            />
            <TextField
              label="Этажей"
              required
              type="number"
              value={formState?.floors || ""}
              onChange={(e) => setFormState({ ...formState!, floors: Number(e.target.value) })}
            />
            <TextField
              label="Площадь"
              required
              type="number"
              value={formState?.square || ""}
              onChange={(e) => setFormState({ ...formState!, square: Number(e.target.value) })}
            />
            <TextField
              label="Цена"
              required
              type="number"
              value={formState?.price || ""}
              onChange={(e) => setFormState({ ...formState!, price: Number(e.target.value) })}
            />
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

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="success">
                Сохранить
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                Отмена
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default REObjectDetails;

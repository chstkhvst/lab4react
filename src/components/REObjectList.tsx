// import React, { useContext } from "react"
// import { REObjectContext } from "../context/REObjectContext"
// import { Link, useNavigate } from "react-router-dom"


// // Компонент для отображения списка объектов
// const REObjectList: React.FC = () => {
//   const context = useContext(REObjectContext) // Получаем доступ к глобальному состоянию из контекста
//   const navigate = useNavigate() // Хук для программной навигации между страницами


//   if (!context) return <div>No context available!</div>


//   const { reobjects, deleteREObject } = context

//   const handleDelete = (id: number) => {
//     const isConfirmed = window.confirm("Are you sure you want to delete this project?")
//     if (isConfirmed) {
//       deleteREObject(id) // Удаляем проект, если пользователь подтвердил действие
//     }
//   }

//   return (
//     <div>
//       <h2>REObjects</h2>
//       {/* Кнопка для добавления нового объекта */}  
//       <button onClick={() => navigate("reobjects/add")}>Add New Object</button>


//       {/* Отображение списка объекта */}
//       {reobjects.map((reobject) => (
//           <p key={reobject.id}>
//             <h2>
//               {`${reobject.street}, д. ${reobject.building}${
//                 reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""
//               }`}
//             </h2>
//             <p>
//               Площадь: {reobject.square} м² | Этажей: {reobject.floors} | Комнат:{" "}
//               {reobject.rooms}
//             </p>
//             <p>Цена: {reobject.price} руб.</p>
//             <Link to={`/reobjects/${reobject.id}`}>Подробнее</Link>
//             <button onClick={() => handleDelete(reobject.id)}>Delete</button> {/* Удаление  */}
//           </p>
//         ))}
//     </div>
//   )
// }


// export default REObjectList
import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Link
} from "@mui/material";
import { REObject } from "../models/reobject"; 

interface Props {
  objects: REObject[];
  onDelete?: (id: number) => void;
}

const REObjectList: React.FC<Props> = ({ objects, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить объект?");
    if (isConfirmed && onDelete) {
      onDelete(id);
    }
  };

  return (
    <Stack spacing={2}>
      {objects.map((reobject) => (
        <Paper
          key={reobject.id}
          elevation={3}
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            {`${reobject.street}, д. ${reobject.building}${
              reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""
            }`}
          </Typography>
          <Typography>Площадь: {reobject.square} м²</Typography>
          <Typography>Этаж: {reobject.floors} | Комнат: {reobject.rooms}</Typography>
          <Typography>Цена: {reobject.price.toLocaleString()} руб.</Typography>

          <Box mt={2} display="flex" gap={1}>
            <Link
              component={RouterLink}
              to={`/objects/${reobject.id}`}
              underline="none"
            >
              <Button variant="outlined">Подробнее</Button>
            </Link>

            {onDelete && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(reobject.id)}
              >
                Удалить
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default REObjectList;

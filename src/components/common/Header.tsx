// import { AppBar, Toolbar, Typography, Button, IconButton, Avatar } from "@mui/material"
// // Импорт компонентов из Material UI. Они используются для создания структуры заголовка.
// import { useNavigate } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"

// const Header = () => {
//   const { user, logout } = useAuth()
//   // Получаем информацию о текущем пользователе (user) и функцию выхода (logout) из контекста.

//   const navigate = useNavigate()

//   return (
//     <AppBar position="fixed">
//       <Toolbar>
//         <Typography variant="h5" sx={{ flexGrow: 1 }}>
//           Агентство недвижимости
//         </Typography>

//         {user ? (
//           // Если пользователь авторизован, отображаем его имя и кнопку выхода.
//           <>
//             <Typography sx={{ mr: 2 }}>
//             {user?.userName
//             ? user.userName.charAt(0).toUpperCase() + user.userName.slice(1)
//             : ""}

//             </Typography>
//             <IconButton
//               onClick={() => {
//                 logout()
//                 // При клике вызываем функцию выхода из системы.
//                 navigate("/")
//                 // Перенаправляем пользователя на главную страницу.
//               }}
//               color="inherit"
//             >
//               <Avatar sx={{ width: 32, height: 32 }}>
//               { user?.userName ? user.userName.charAt(0).toUpperCase() : "?"}
//               </Avatar>

//             </IconButton>
//           </>
//         ) : (
//           // Если пользователь не авторизован, отображаем кнопку входа.
//           <Button color="inherit" onClick={() => navigate("/login")}>
//             Войти
//           </Button>
//         )}
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default Header
import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Business } from "@mui/icons-material";

const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={2}
      sx={{
        height: 64,
        paddingLeft: 20,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business />
          <Typography variant="h6" noWrap>
            Агентство недвижимости
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

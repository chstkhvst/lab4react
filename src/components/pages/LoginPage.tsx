import React, { useState } from "react"
import { Box, Button } from "@mui/material"
import LoginModal from "../common/LoginModal";
import { useNavigate } from "react-router-dom"
// Импорт компонента `LoginModal`, который представляет модальное окно для входа в систему.

const LoginPage: React.FC = () => {
  const [open, setOpen] = useState(true)
    const navigate = useNavigate()
  // Локальное состояние `open` управляет отображением модального окна.
  // Изначально окно отображается (`true`).

  return (
    <Box>
      {/* Контейнер для модального окна. */}
      <LoginModal
        open={open}
        // Передаём состояние `open` в модальное окно для управления его видимостью.
        onClose={() => setOpen(false)}
        // Передаём функцию `onClose`, которая закрывает модальное окно, изменяя состояние `open` на `false`.
      />
    </Box>
  )
}

export default LoginPage

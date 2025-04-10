/* // Импортируем компонент REObjectList из файла REObjectList.tsx, который находится в папке components
import REObjectList from './components/REObjectList';

// Создаем функциональный компонент App
const App = () => {
  return (
    <>
      <REObjectList />
    </>
  );
}; */

// Экспортируем компонент App по умолчанию, чтобы его можно было использовать в других частях приложения
/* export default App; */
import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { REObjectProvider } from "./context/REObjectContext"
import REObjectList from "./components/REObjectList"
import REObjectForm from "./components/REObjectForm"
import REObjectDetails from "./components/REObjectDetails"

const App: React.FC = () => {
  return (
    <REObjectProvider>
      <Router>
        <h1>REA</h1>
        <Routes>
          <Route path="/" element={<REObjectList />} /> {/* Главная страница */}
          <Route path="reobjects/add" element={<REObjectForm />} /> {/* Добавление проекта */}
          <Route path="/reobjects/:id" element={<REObjectDetails />} /> {/* Детали проекта */}
        </Routes>
      </Router>
    </REObjectProvider>
  )
}

export default App

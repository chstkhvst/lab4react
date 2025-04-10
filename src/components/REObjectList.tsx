import React, { useContext } from "react"
import { REObjectContext } from "../context/REObjectContext"
import { Link, useNavigate } from "react-router-dom"


// Компонент для отображения списка объектов
const REObjectList: React.FC = () => {
  const context = useContext(REObjectContext) // Получаем доступ к глобальному состоянию из контекста
  const navigate = useNavigate() // Хук для программной навигации между страницами


  if (!context) return <div>No context available!</div>


  const { reobjects, deleteREObject } = context

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this project?")
    if (isConfirmed) {
      deleteREObject(id) // Удаляем проект, если пользователь подтвердил действие
    }
  }

  return (
    <div>
      <h2>REObjects</h2>
      {/* Кнопка для добавления нового объекта */}  
      <button onClick={() => navigate("reobjects/add")}>Add New Object</button>


      {/* Отображение списка объекта */}
      {reobjects.map((reobject) => (
          <p key={reobject.id}>
            <h2>
              {`${reobject.street}, д. ${reobject.building}${
                reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""
              }`}
            </h2>
            <p>
              Площадь: {reobject.square} м² | Этажей: {reobject.floors} | Комнат:{" "}
              {reobject.rooms}
            </p>
            <p>Цена: {reobject.price} руб.</p>
            <Link to={`/reobjects/${reobject.id}`}>Подробнее</Link>
            <button onClick={() => handleDelete(reobject.id)}>Delete</button> {/* Удаление  */}
          </p>
        ))}
    </div>
  )
}


export default REObjectList

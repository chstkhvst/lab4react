import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { REObjectContext } from "../context/REObjectContext"
import { REObject } from "../models/reobject" 
import APIService from "../services/APIService"

// Компонент для отображения деталей объекта недвижимости
const REObjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>() // Получаем ID объекта из URL
  const context = useContext(REObjectContext) // Доступ к контексту объектов
  const navigate = useNavigate() // Для навигации

  const [reobject, setREObject] = useState<REObject | null>(null) // Храним текущий объект
  const [editMode, setEditMode] = useState(false) // Режим редактирования
  const [formState, setFormState] = useState<REObject | null>(null) // Состояние для редактирования
  // Функция загрузки данных объекта с сервера
  const fetchREObject = async () => {
    if (id) {
      try {
        const fetchedObject = await APIService.getREObjectById(parseInt(id, 10)) // Запрос к API
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
      // Находим объект по ID (локально)
      const foundObject = context.reobjects.find(obj => obj.id === parseInt(id || "", 10))
      if (foundObject) {
        setREObject(foundObject)
        setFormState(foundObject)
      } else {
        // Если не нашли локально, пробуем загрузить с сервера
        fetchREObject()
      }
    }
  }, [context, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (formState && context) {
      try {
        // Создаем объект без id для обновления
        const updatedData: Omit<REObject, "id"> = {
          street: formState.street,
          building: formState.building,
          roomnum: formState.roomnum,
          rooms: formState.rooms,
          floors: formState.floors,
          square: formState.square,
          price: formState.price,
          dealtypeid: formState.dealtypeid,
          typeid: formState.typeid,
          statusid: formState.statusid,
        }
  
        // Обновляем объект через API и контекст
        const updatedObject = await APIService.updateREObject(formState.id, updatedData)
        
        // Обновляем данные объекта
        setREObject(updatedObject)
        context.updateREObject(formState.id, updatedData) 
        setEditMode(false) // Выходим из режима редактирования
      } catch (error) {
        console.error("Failed to update object:", error)
        alert("Failed to update object.")
      }
    }
  }

  if (!reobject) {
    return <div>Объект не найден!</div> // Сообщение если объект не найден
  }

  return (
    <div>
      <h2>Детали объекта недвижимости</h2>
      {!editMode ? (
        <>
          {/* Режим просмотра */}
          <p>
            <strong>Адрес:</strong> {`${reobject.street}, д. ${reobject.building}${reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""}`}
          </p>
          {/*  <p>
            <strong>Тип объекта:</strong> {reobject.objectType.typeName}
          </p>
          <p>
            <strong>Тип сделки:</strong> {reobject.dealType.dealName}
          </p>
          <p>
            <strong>Статус:</strong> {reobject.status.statusName}
          </p> */}
          <p>
            <strong>Площадь:</strong> {reobject.square} м²
          </p>
          <p>
            <strong>Этажей:</strong> {reobject.floors}
          </p>
          <p>
            <strong>Количество комнат:</strong> {reobject.rooms}
          </p>
          <p>
            <strong>Цена:</strong> {reobject.price} руб.
          </p>
          
          <button onClick={() => setEditMode(true)}>Редактировать</button>
          <button onClick={() => navigate("/")}>Назад к списку</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Режим редактирования */}
          <div>
            <label>Улица:</label>
            <input
              type="text"
              value={formState?.street || ""}
              required
              onChange={(e) => setFormState({ ...formState!, street: e.target.value })}
            />
          </div>
          
          <div>
            <label>Дом:</label>
            <input
              type="text"
              value={formState?.building || ""}
              required
              onChange={(e) => setFormState({ ...formState!, building: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>Квартира (если есть):</label>
            <input
              type="text"
              value={formState?.roomnum || ""}
              onChange={(e) => setFormState({ 
                ...formState!, 
                roomnum: e.target.value ? Number(e.target.value) : undefined 
              })}
            />
          </div>
          
          <div>
            <label>Комнат:</label>
            <input
              type="number"
              value={formState?.rooms || ""}
              required
              onChange={(e) => setFormState({ ...formState!, rooms: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>Этажей:</label>
            <input
              type="number"
              value={formState?.floors || ""}
              required
              onChange={(e) => setFormState({ ...formState!, floors: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>Площадь:</label>
            <input
              type="number"
              value={formState?.square || ""}
              required
              onChange={(e) => setFormState({ ...formState!, square: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>Цена:</label>
            <input
              type="number"
              value={formState?.price || ""}
              required
              onChange={(e) => setFormState({ ...formState!, price: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>ID типа сделки:</label>
            <input
              type="number"
              value={formState?.dealtypeid || ""}
              required
              onChange={(e) => setFormState({ ...formState!, dealtypeid: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>ID типа объекта:</label>
            <input
              type="number"
              value={formState?.typeid || ""}
              required
              onChange={(e) => setFormState({ ...formState!, typeid: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label>ID статуса:</label>
            <input
              type="number"
              value={formState?.statusid || ""}
              required
              onChange={(e) => setFormState({ ...formState!, statusid: Number(e.target.value) })}
            />
          </div>
          
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Отмена
          </button>
        </form>
      )}
    </div>
  )
}

export default REObjectDetails 
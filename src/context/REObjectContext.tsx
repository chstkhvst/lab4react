import React, { createContext, useState, useEffect, ReactNode } from "react"
import APIService from "../services/APIService"
import { REObject } from "../models/reobject"

// Интерфейс для контекста 
interface REObjectContextProps {
  reobjects: REObject[] // Массив всех объектов
  addREObject: (reobject: Omit<REObject, "id">) => void // Добавление нового 
  deleteREObject: (id: number) => void
  updateREObject: (id: number, reobject: Omit<REObject, "id">) => void
}

// Создание контекста
export const REObjectContext = createContext<REObjectContextProps | undefined>(undefined)

// Провайдер контекста для предоставления данных всему приложению
export const REObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reobjects, setREObjects] = useState<REObject[]>([]) // Локальное состояние для всех объектов

  useEffect(() => {
    fetchREObjects() // Загружаем объекты при монтировании компонента
  }, [])

  // Получение проектов от API
  const fetchREObjects = async () => {
    const data = await APIService.getREObjects()
    setREObjects(data || [])
  }

  // Добавление нового объекта
  const addREObject = async (reobject: Omit<REObject, "id">) => {
    const newObj = await APIService.createREObject(reobject)
    setREObjects([...reobjects, newObj]) // Обновляем состояние
  }
  // Удаление 
  const deleteREObject = async (id: number) => {
    await APIService.deleteREObject(id)
    setREObjects(reobjects.filter((obj) => obj.id !== id)) // Убираем из списка
  }
  // Обновление
  const updateREObject = async (id: number, updatedREObject: Omit<REObject, "id">) => {
    const updatedObj = await APIService.updateREObject(id, updatedREObject)
    setREObjects(reobjects.map((obj) => (obj.id === id ? updatedObj : obj))) // Обновляем объект в списке
  }
  return (
    <REObjectContext.Provider value={{ reobjects, addREObject, deleteREObject, updateREObject }}>{children}</REObjectContext.Provider>
  )
}

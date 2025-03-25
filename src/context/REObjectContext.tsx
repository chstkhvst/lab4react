import React, { createContext, useState, useEffect, ReactNode } from "react"
import APIService from "../services/APIService"
import { REObject } from "../models/reobject"

// Интерфейс для контекста проекта
interface REObjectContextProps {
  reobjects: REObject[] // Массив всех проектов
  addREObject: (reobject: Omit<REObject, "id">) => void // Добавление нового проекта
}

// Создание контекста
export const REObjectContext = createContext<REObjectContextProps | undefined>(undefined)

// Провайдер контекста для предоставления данных всему приложению
export const REObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reobjects, setREObjects] = useState<REObject[]>([]) // Локальное состояние для всех проектов

  useEffect(() => {
    fetchREObjects() // Загружаем проекты при монтировании компонента
  }, [])

  // Получение проектов от API
  const fetchREObjects = async () => {
    const data = await APIService.getREObjects()
    setREObjects(data || [])
  }

  // Добавление нового проекта
  const addREObject = async (reobject: Omit<REObject, "id">) => {
    const newObj = await APIService.createREObject(reobject)
    setREObjects([...reobjects, newObj]) // Обновляем состояние
  }

  return (
    <REObjectContext.Provider value={{ reobjects, addREObject }}>{children}</REObjectContext.Provider>
  )
}

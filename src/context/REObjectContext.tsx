import React, { createContext, useState, useEffect, ReactNode } from "react"
import APIService from "../services/APIService"
import { REObject, DealType, ObjectType, Status, ResStatus } from "../models/reobject"

// Интерфейс для контекста 
interface REObjectContextProps {
  reobjects: REObject[] // Массив всех объектов
  dealTypes: DealType[] // Справочник типов сделок
  objectTypes: ObjectType[] // Справочник типов объектов
  statuses: Status[] // Справочник статусов
  resStatuses: ResStatus[] // Справочник ResStatus

  addREObject: (reobject: Omit<REObject, "id">) => void // Добавление нового 
  deleteREObject: (id: number) => void
  updateREObject: (id: number, reobject: Omit<REObject, "id">) => Promise<REObject>
}

// Создание контекста
export const REObjectContext = createContext<REObjectContextProps | undefined>(undefined)

// Провайдер контекста для предоставления данных всему приложению
export const REObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reobjects, setREObjects] = useState<REObject[]>([]) // Локальное состояние для всех объектов
  const [dealTypes, setDealTypes] = useState<DealType[]>([])
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [resStatuses, setResStatuses] = useState<ResStatus[]>([])

  useEffect(() => {
    fetchREObjects()
    fetchCatalogs()
  }, [])

  // Получение объектов недвижимости
  const fetchREObjects = async () => {
    try {
      const data = await APIService.getREObjects()
      setREObjects(data || [])
    } catch (error) {
      console.error("Ошибка загрузки объектов:", error)
    }
  }

  // Получение справочников
  const fetchCatalogs = async () => {
    try {
      const [dt, ot, st, rst] = await Promise.all([
        APIService.getDealTypes(),
        APIService.getObjectTypes(),
        APIService.getStatuses(),
        APIService.getResStatuses(),
      ])
      setDealTypes(dt || [])
      setObjectTypes(ot || [])
      setStatuses(st || [])
      setResStatuses(rst || [])
    } catch (error) {
      console.error("Ошибка загрузки справочников:", error)
    }
  }

  // Добавление нового объекта
  const addREObject = async (reobject: Omit<REObject, "id">) => {
    await APIService.createREObject(reobject)
    const updatedList = await APIService.getREObjects()
    setREObjects(updatedList)
  }

  // Удаление объекта
  const deleteREObject = async (id: number) => {
    await APIService.deleteREObject(id)
    setREObjects(reobjects.filter((obj) => obj.id !== id))
  }

  // // Обновление объекта
  // const updateREObject = async (id: number, updatedREObject: Omit<REObject, "id">): Promise<REObject> => {
  //   const response = await APIService.updateREObject(id, updatedREObject)
  //   setREObjects(prevREObjects => prevREObjects.map(obj => obj.id === id ? { ...obj, ...response } : obj))
  //   return response
  // }

  const updateREObject = async (id: number, updatedREObject: Omit<REObject, "id">): Promise<REObject> => {
    // Отправляем обновлённые данные на сервер
    const response = await APIService.updateREObject(id, updatedREObject);
    
    // Загружаем обновлённый список объектов с сервера
    const updatedList = await APIService.getREObjects();
    
    // Обновляем состояние списком из сервера
    setREObjects(updatedList);
    
    return response;
  }
  
  return (
    <REObjectContext.Provider
      value={{
        reobjects,
        dealTypes,
        objectTypes,
        statuses,
        resStatuses,
        addREObject,
        deleteREObject,
        updateREObject,
      }}
    >
      {children}
    </REObjectContext.Provider>
  )
}

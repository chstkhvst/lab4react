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

  addREObject: (reobject: Omit<REObject, "id">, files?: File[]) => Promise<void>;
  deleteREObject: (id: number) => void
  updateREObject: (id: number, reobject: Omit<REObject, "id">, files?: File[], imagesToDelete?: number[]) => Promise<REObject>
  fetchFilteredObjects: (filters: {
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }) => Promise<void>;
  getREObjectById: (id: number) => Promise<REObject>;
}

// Создание контекста
export const REObjectContext = createContext<REObjectContextProps | undefined>(undefined)

// Провайдер контекста
export const REObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reobjects, setREObjects] = useState<REObject[]>([])
  const [dealTypes, setDealTypes] = useState<DealType[]>([])
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [resStatuses, setResStatuses] = useState<ResStatus[]>([])

  useEffect(() => {
    fetchREObjects()
    fetchCatalogs()
  }, [])

  const fetchREObjects = async () => {
    try {
      const data = await APIService.getREObjects()
      setREObjects(data || [])
    } catch (error) {
      console.error("Ошибка загрузки объектов:", error)
    }
  }

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

  const addREObject = async (reobject: Omit<REObject, "id">, files: File[] = []) => {
    await APIService.createREObject(reobject, files);
    const updatedList = await APIService.getREObjects();
    setREObjects(updatedList);
  };

  const deleteREObject = async (id: number) => {
    await APIService.deleteREObject(id)
    setREObjects(reobjects.filter((obj) => obj.id !== id))
  }

  const updateREObject = async (
    id: number, 
    updatedREObject: Omit<REObject, "id">, 
    files: File[] = [], 
    imagesToDelete: number[] = []
  ): Promise<REObject> => {
    const response = await APIService.updateREObject(
      id, 
      updatedREObject, 
      files, 
      imagesToDelete
    );
    const updatedList = await APIService.getREObjects();
    setREObjects(updatedList);
    return response;
  }

  const fetchFilteredObjects = async (filters: {
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }): Promise<void> => {
    try {
      const filteredObjects = await APIService.getFilteredREObjects({
        typeId: filters.objectTypeId,
        dealTypeId: filters.dealTypeId,
        statusId: filters.statusId
      });
      setREObjects(filteredObjects || []);
    } catch (error) {
      console.error("Ошибка фильтрации объектов:", error);
      throw error;
    }
  }
  const getREObjectById = async (id: number): Promise<REObject> => {
    try {
      // запрашиваем с сервера
      const object = await APIService.getREObjectById(id);
      
      // Обновляем локальное состояние
      if (!reobjects.some(obj => obj.id === object.id)) {
        setREObjects(prev => [...prev, object]);
      }
      
      return object;
    } catch (error) {
      console.error("Ошибка загрузки объекта:", error);
      throw error;
    }
  };
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
        fetchFilteredObjects,
        getREObjectById
      }}
    >
      {children}
    </REObjectContext.Provider>
  );
}
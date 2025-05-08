import React, { createContext, useState, useEffect, ReactNode } from "react"
import APIService from "../services/APIService"
import { REObject, DealType, ObjectType, Status, ResStatus } from "../models/reobject"

/**
 * Интерфейс контекста объектов недвижимости
 * @interface
 */
interface REObjectContextProps {
  /** Массив всех объектов недвижимости */
  reobjects: REObject[]
  /** Справочник типов сделок */
  dealTypes: DealType[]
  /** Справочник типов объектов */
  objectTypes: ObjectType[]
  /** Справочник статусов */
  statuses: Status[]
  /** Справочник статусов резервирования */
  resStatuses: ResStatus[]

  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;

  /**
   * Добавляет новый объект недвижимости
   * @param {Omit<REObject, "id">} reobject - Данные объекта (без ID)
   * @param {File[]} [files] - Массив файлов для загрузки
   * @returns {Promise<void>}
   */
  addREObject: (reobject: Omit<REObject, "id">, files?: File[]) => Promise<void>;
  
  /**
   * Удаляет объект недвижимости
   * @param {number} id - ID объекта для удаления
   * @returns {void}
   */
  deleteREObject: (id: number) => void
  
  /**
   * Обновляет объект недвижимости
   * @param {number} id - ID объекта
   * @param {Omit<REObject, "id">} reobject - Новые данные объекта
   * @param {File[]} [files] - Массив новых файлов
   * @param {number[]} [imagesToDelete] - Массив ID изображений для удаления
   * @returns {Promise<REObject>} Обновленный объект
   */
  updateREObject: (id: number, reobject: Omit<REObject, "id">, files?: File[], imagesToDelete?: number[]) => Promise<REObject>
  
  /**
   * Загружает отфильтрованные объекты
   * @param {object} filters - Параметры фильтрации
   * @param {number} [filters.objectTypeId] - ID типа объекта
   * @param {number} [filters.dealTypeId] - ID типа сделки
   * @param {number} [filters.statusId] - ID статуса
   * @returns {Promise<void>}
   */
  fetchFilteredObjects: (filters: {
    objectTypeId?: number;
    dealTypeId?: number;
    statusId?: number;
  }, page: number) => Promise<void>;
  
  /**
   * Получает объект по ID
   * @param {number} id - ID объекта
   * @returns {Promise<REObject>} Найденный объект
   */
  getREObjectById: (id: number) => Promise<REObject>;

  fetchPaginatedObjects: (page: number, pageSize?: number) => Promise<void>;
}

/**
 * Контекст для работы с объектами недвижимости
 */
export const REObjectContext = createContext<REObjectContextProps | undefined>(undefined)

/**
 * Провайдер контекста объектов недвижимости
 * @component
 * @param {object} props - Свойства компонента
 * @param {ReactNode} props.children - Дочерние компоненты
 */
export const REObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reobjects, setREObjects] = useState<REObject[]>([])
  const [dealTypes, setDealTypes] = useState<DealType[]>([])
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [resStatuses, setResStatuses] = useState<ResStatus[]>([])

    // Состояние пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

  // Загрузка данных при монтировании
  useEffect(() => {
    //fetchREObjects()
    fetchPaginatedObjects(1);
    fetchCatalogs()
  }, [])

  const fetchPaginatedObjects = async (page: number, size: number = 5) => {
    try {
      const result = await APIService.getREObjectsPaginated(page, size);
      setREObjects(result.items || []);
      setCurrentPage(page);
      setPageSize(size);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Ошибка загрузки объектов:", error);
    }
  };

  /**
   * Загружает список объектов недвижимости
   * @returns {Promise<void>}
   */
  const fetchREObjects = async () => {
    try {
      const data = await APIService.getREObjects()
      setREObjects(data || [])
    } catch (error) {
      console.error("Ошибка загрузки объектов:", error)
    }
  }

  /**
   * Загружает справочники (типы сделок, типы объектов и т.д.)
   * @returns {Promise<void>}
   */
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

  /**
   * Добавляет новый объект недвижимости
   * @param {Omit<REObject, "id">} reobject - Данные объекта
   * @param {File[]} [files=[]] - Массив файлов
   * @returns {Promise<void>}
   */
  const addREObject = async (reobject: Omit<REObject, "id">, files: File[] = []) => {
    // await APIService.createREObject(reobject, files);
    // const updatedList = await APIService.getREObjects();
    // setREObjects(updatedList);
    await APIService.createREObject(reobject, files);
    const updatedList = await APIService.getREObjectsPaginated(1);
    setREObjects(updatedList.items || []);
    setCurrentPage(updatedList.currentPage);
    setTotalPages(updatedList.totalPages);
    setTotalCount(updatedList.totalCount);
  };

  /**
   * Удаляет объект недвижимости
   * @param {number} id - ID объекта
   * @returns {Promise<void>}
   */
  const deleteREObject = async (id: number) => {
    await APIService.deleteREObject(id)
    setREObjects(reobjects.filter((obj) => obj.id !== id))
  }

  /**
   * Обновляет объект недвижимости
   * @param {number} id - ID объекта
   * @param {Omit<REObject, "id">} updatedREObject - Новые данные
   * @param {File[]} [files=[]] - Массив новых файлов
   * @param {number[]} [imagesToDelete=[]] - Массив ID изображений для удаления
   * @returns {Promise<REObject>} Обновленный объект
   */
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
    // const updatedList = await APIService.getREObjects();
    // setREObjects(updatedList);
    // return response;
    const updatedList = await APIService.getREObjectsPaginated(1);
    // Убеждаемся, что устанавливаем именно массив items
    console.log(updatedList.items);
    setREObjects(updatedList.items);
    setCurrentPage(updatedList.currentPage);
    setTotalPages(updatedList.totalPages);
    setTotalCount(updatedList.totalCount);
    return response;
  }

  /**
   * Загружает отфильтрованные объекты
   * @param {object} filters - Параметры фильтрации
   * @param {number} [filters.objectTypeId] - ID типа объекта
   * @param {number} [filters.dealTypeId] - ID типа сделки
   * @param {number} [filters.statusId] - ID статуса
   * @returns {Promise<void>}
   * @throws {Error} При ошибке фильтрации
   */
  // const fetchFilteredObjects = async (filters: {
  //   objectTypeId?: number;
  //   dealTypeId?: number;
  //   statusId?: number;
  // }): Promise<void> => {
  //   try {
  //     const filteredObjects = await APIService.getFilteredREObjects({
  //       typeId: filters.objectTypeId,
  //       dealTypeId: filters.dealTypeId,
  //       statusId: filters.statusId
  //     });
  //     setREObjects(filteredObjects || []);
  //   } catch (error) {
  //     console.error("Ошибка фильтрации объектов:", error);
  //     throw error;
  //   }
  // }
  const fetchFilteredObjects = async (
    filters: {
      objectTypeId?: number;
      dealTypeId?: number;
      statusId?: number;
    },
    page: number = 1 // <--- добавлен параметр страницы
  ): Promise<void> => {
    try {
      const result = await APIService.getFilteredREObjects(
        {
          typeId: filters.objectTypeId,
          dealTypeId: filters.dealTypeId,
          statusId: filters.statusId
        },
        page,
        pageSize
      );
  
      setREObjects(result.items || []);
      setCurrentPage(page);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Ошибка фильтрации объектов:", error);
      throw error;
    }
  };
  
  /**
   * Получает объект по ID
   * @param {number} id - ID объекта
   * @returns {Promise<REObject>} Найденный объект
   * @throws {Error} При ошибке загрузки
   */
  const getREObjectById = async (id: number): Promise<REObject> => {
    try {
      const object = await APIService.getREObjectById(id);
      
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

        currentPage,
        totalPages,
        pageSize,
        totalCount,

        addREObject,
        deleteREObject,
        updateREObject,
        fetchFilteredObjects,
        getREObjectById,
        fetchPaginatedObjects
      }}
    >
      {children}
    </REObjectContext.Provider>
  );
}
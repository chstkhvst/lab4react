import { REObject, DealType, ObjectType, Status, ResStatus, PaginatedResponse} from "../models/reobject"

/**
 * Параметры фильтрации объектов недвижимости
 * @typedef {Object} FilterParams
 * @property {number} [typeId] - ID типа объекта
 * @property {number} [dealTypeId] - ID типа сделки
 * @property {number} [statusId] - ID статуса
 */
interface FilterParams {
  typeId?: number;
  dealTypeId?: number;
  statusId?: number;
}

/**
 * Класс для работы с API недвижимости
 */
class APIService {
  /** Базовый URL API */
  private baseUrl: string

  /**
   * Создает экземпляр APIService
   * @param {string} baseUrl - Базовый URL API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех объектов недвижимости
   * @returns {Promise<REObject[]>} Промис с массивом объектов недвижимости
   * @throws {Error} Если не удалось загрузить объекты
   */
  async getREObjects(): Promise<REObject[]> {
    const response = await fetch(`${this.baseUrl}/REObject`)
    if (!response.ok) throw new Error("Failed to fetch objects")
    return await response.json()
  }

  /**
   * Создает новый объект недвижимости
   * @param {Omit<REObject, "id">} reobject - Данные объекта (без ID)
   * @param {File[]} [files=[]] - Массив файлов для загрузки
   * @returns {Promise<REObject>} Промис с созданным объектом
   * @throws {Error} Если не удалось создать объект
   */
  async createREObject(reobject: Omit<REObject, "id">, files: File[] = []): Promise<REObject> {
    const formData = new FormData();
    
    Object.entries(reobject).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      const response = await fetch(`${this.baseUrl}/REObject`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || await response.text() || 'Failed to create object');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error details:', {
        error,
        request: { url: `${this.baseUrl}/REObject`, method: 'POST' }
      });
      throw error;
    }
  }
  
  /**
   * Удаляет объект недвижимости
   * @param {number} id - ID объекта для удаления
   * @returns {Promise<void>}
   * @throws {Error} Если не удалось удалить объект
   */
  async deleteREObject(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/REObject/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete")
  }

  /**
   * Обновляет существующий объект недвижимости
   * @param {number} id - ID объекта для обновления
   * @param {Omit<REObject, "id">} reobject - Новые данные объекта
   * @param {File[]} [files=[]] - Массив новых файлов
   * @param {number[]} [imagesToDelete=[]] - Массив ID изображений для удаления
   * @returns {Promise<REObject>} Промис с обновленным объектом
   * @throws {Error} Если не удалось обновить объект
   */
  async updateREObject(
    id: number, 
    reobject: Omit<REObject, "id">, 
    files: File[] = [], 
    imagesToDelete: number[] = []
  ): Promise<REObject> {
    const formData = new FormData();

    Object.entries(reobject).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    files.forEach(file => {
      formData.append('files', file);
    });

    imagesToDelete.forEach(id => {
      formData.append('imagesToDelete', id.toString());
    });

    const response = await fetch(`${this.baseUrl}/REObject/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  }

  /**
   * Получает объект недвижимости по ID
   * @param {number} id - ID объекта
   * @returns {Promise<REObject>} Промис с запрошенным объектом
   * @throws {Error} Если не удалось загрузить объект
   */
  async getREObjectById(id: number): Promise<REObject> {
    const response = await fetch(`${this.baseUrl}/REObject/${id}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  }

  /**
   * Получает список типов сделок
   * @returns {Promise<DealType[]>} Промис с массивом типов сделок
   * @throws {Error} Если не удалось загрузить типы сделок
   */
  async getDealTypes(): Promise<DealType[]> {
    const response = await fetch(`${this.baseUrl}/catalog/dealtypes`)
    if (!response.ok) throw new Error("Failed to fetch deal types")
    return await response.json()
  }

  /**
   * Получает список типов объектов
   * @returns {Promise<ObjectType[]>} Промис с массивом типов объектов
   * @throws {Error} Если не удалось загрузить типы объектов
   */
  async getObjectTypes(): Promise<ObjectType[]> {
    const response = await fetch(`${this.baseUrl}/catalog/objecttypes`)
    if (!response.ok) throw new Error("Failed to fetch object types")
    return await response.json()
  }

  /**
   * Получает список статусов
   * @returns {Promise<Status[]>} Промис с массивом статусов
   * @throws {Error} Если не удалось загрузить статусы
   */
  async getStatuses(): Promise<Status[]> {
    const response = await fetch(`${this.baseUrl}/catalog/statuses`)
    if (!response.ok) throw new Error("Failed to fetch statuses")
    return await response.json()
  }

  /**
   * Получает список статусов брони
   * @returns {Promise<ResStatus[]>} Промис с массивом статусов брони
   * @throws {Error} Если не удалось загрузить 
   */
  async getResStatuses(): Promise<ResStatus[]> {
    const response = await fetch(`${this.baseUrl}/catalog/resstatuses`)
    if (!response.ok) throw new Error("Failed to fetch res statuses")
    return await response.json()
  }

  /**
   * Получает отфильтрованные объекты недвижимости
   * @param {FilterParams} filters - Параметры фильтрации
   * @returns {Promise<REObject[]>} Промис с массивом отфильтрованных объектов
   * @throws {Error} Если не удалось загрузить объекты
   */
  async getFilteredREObjects(
    filters: FilterParams,
    page: number = 1,
    pageSize: number = 5
  ): Promise<PaginatedResponse<REObject>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    
    if (filters.typeId) params.append('typeId', filters.typeId.toString());
    if (filters.dealTypeId) params.append('dealTypeId', filters.dealTypeId.toString());
    if (filters.statusId) params.append('statusId', filters.statusId.toString());
  
    const response = await fetch(`${this.baseUrl}/REObject/filter?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch filtered objects");
    return await response.json();
  }
  /**
   * Пагинация для объектов
   */
  async getREObjectsPaginated(
    page: number = 1,
    pageSize: number = 5
  ): Promise<PaginatedResponse<REObject>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
  
    const response = await fetch(`${this.baseUrl}/REObject?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch objects");
    }
    
    return await response.json();
  }
}

// Экспорт предварительно созданного экземпляра с базовым URL '/api'
export default new APIService("/api")
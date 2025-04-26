import { REObject, DealType, ObjectType, Status, ResStatus } from "../models/reobject"
// Класс для работы с API
class APIService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех объектов недвижимости
  async getREObjects(): Promise<REObject[]> {
    const response = await fetch(`${this.baseUrl}/REObject`)
    if (!response.ok) throw new Error("Failed to fetch objects")
    return await response.json()
  }

  // Создание нового объекта недвижимости
  async createREObject(reobject: Omit<REObject, "id">): Promise<REObject> {
    const response = await fetch(`${this.baseUrl}/REObject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reobject),
    })
    if (!response.ok) throw new Error("Failed to create object")
    return await response.json()
  }
  
  // Удаление проекта
  async deleteREObject(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/REObject/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete")
  }

    // Обновление существующего объекта
    async updateREObject(id: number, reobject: Omit<REObject, "id">): Promise<REObject> {
      // Включаем id обратно в объект 
      const reobjectWithId = { ...reobject, id };
    
      const response = await fetch(`${this.baseUrl}/REObject/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reobjectWithId),
      });
    
      if (!response.ok) throw new Error("Failed to update");
      return await response.json();
    }
    async getREObjectById(id: number): Promise<REObject> {
      const response = await fetch(`${this.baseUrl}/REObject/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return await response.json();
    }

async getDealTypes(): Promise<DealType[]> {
  const response = await fetch(`${this.baseUrl}/catalog/dealtypes`)
  if (!response.ok) throw new Error("Failed to fetch deal types")
  return await response.json()
}

async getObjectTypes(): Promise<ObjectType[]> {
  const response = await fetch(`${this.baseUrl}/catalog/objecttypes`)
  if (!response.ok) throw new Error("Failed to fetch object types")
  return await response.json()
}

async getStatuses(): Promise<Status[]> {
  const response = await fetch(`${this.baseUrl}/catalog/statuses`)
  if (!response.ok) throw new Error("Failed to fetch statuses")
  return await response.json()
}

async getResStatuses(): Promise<ResStatus[]> {
  const response = await fetch(`${this.baseUrl}/catalog/resstatuses`)
  if (!response.ok) throw new Error("Failed to fetch res statuses")
  return await response.json()
}

}

export default new APIService("/api") // Экспортируем инстанс с базовым URL

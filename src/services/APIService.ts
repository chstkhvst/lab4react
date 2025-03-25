import { REObject } from "../models/reobject"

// Класс для работы с API
class APIService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех объектов
  async getREObjects(): Promise<REObject[]> {
    const response = await fetch(`${this.baseUrl}/REObject`)
    if (!response.ok) throw new Error("Failed to fetch objects")
    return await response.json()
  }

  // Создание нового проекта
  async createProject(project: Omit<REObject, "id">): Promise<REObject> {
    const response = await fetch(`${this.baseUrl}/REObject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
    if (!response.ok) throw new Error("Failed to create object")
    return await response.json()
  }
}

export default new APIService("/api") // Экспортируем инстанс с базовым URL
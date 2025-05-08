import { Contract } from "../models/contract"

/**
 * Сервис для работы с договорами
 */
class ContractService {
  /** Базовый URL API */
  private baseUrl: string

  /**
   * Создает экземпляр ContractService
   * @param {string} baseUrl - Базовый URL API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех договоров
   * @returns {Promise<Contract[]>} Промис с массивом договоров
   * @throws {Error} Если не удалось загрузить договоры
   */
  async getContracts(): Promise<Contract[]> {
    const response = await fetch(`${this.baseUrl}/Contract`)
    if (!response.ok) throw new Error("Failed to fetch contracts")
    return await response.json()
  }

  /**
   * Создает новый договор
   * @param {Omit<Contract, "id" | "object" | "user" | "reservation">} contract - Данные договора (без id, объекта, пользователя и резервации)
   * @returns {Promise<Contract>} Промис с созданным договором
   * @throws {Error} Если не удалось создать договор
   */
  async createContract(contract: Omit<Contract, "id" | "object" | "user" | "reservation">): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/Contract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contract),
    })
    if (!response.ok) throw new Error("Failed to create contract")
    return await response.json()
  }

  /**
   * Получает договор по его ID
   * @param {number} id - ID договора
   * @returns {Promise<Contract>} Промис с запрошенным договором
   * @throws {Error} Если не удалось загрузить договор
   */
  async getContractById(id: number): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/Contract/${id}`)
    if (!response.ok) throw new Error("Failed to fetch contract")
    return await response.json()
  }
}

/** Экспортированный экземпляр ContractService с базовым URL '/api' */
export default new ContractService("/api")
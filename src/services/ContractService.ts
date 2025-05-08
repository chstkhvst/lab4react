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
  async getContracts(signDate?: Date): Promise<Contract[]> {
    try {
      let url = `${this.baseUrl}/Contract`;
      
      if (signDate) {
        // Форматируем дату в ISO строку (без времени)
        const dateStr = signDate.toISOString().split('T')[0];
        url += `?signDate=${encodeURIComponent(dateStr)}`;
        console.log('Fetching contracts with sign date:', dateStr);
      } else {
        console.log('Fetching all contracts (no date filter)');
      }

      console.log('Request URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Fetch failed. Status: ${response.status}`);
        throw new Error(`Failed to fetch contracts. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched contracts:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
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
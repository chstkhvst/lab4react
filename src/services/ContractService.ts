import { Contract } from "../models/contract"

class ContractService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех договоров
  async getContracts(): Promise<Contract[]> {
    const response = await fetch(`${this.baseUrl}/Contract`)
    if (!response.ok) throw new Error("Failed to fetch contracts")
    return await response.json()
  }

  // Создание нового договора
  async createContract(contract: Omit<Contract, "id" | "object" | "user" | "reservation">): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/Contract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contract),
    })
    if (!response.ok) throw new Error("Failed to create contract")
    return await response.json()
  }

  // Получение договора по ID
  async getContractById(id: number): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/Contract/${id}`)
    if (!response.ok) throw new Error("Failed to fetch contract")
    return await response.json()
  }
}

export default new ContractService("/api")

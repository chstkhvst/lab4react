import React, { createContext, useState, useEffect, ReactNode } from "react"
import ContractService from "../services/ContractService"
import { Contract } from "../models/contract"

/**
 * Интерфейс контекста договоров
 */
interface ContractContextProps {
  /** Массив всех договоров */
  contracts: Contract[]
  /** 
   * Добавление нового договора 
   * @param contract - данные договора без id и связанных объектов
   */
  addContract: (contract: Omit<Contract, "id" | "object" | "user" | "reservation">) => void
  /**
   * Получение договора по ID
   * @param id - идентификатор договора
   * @returns Промис с данными договора
   */
  getContractById: (id: number) => Promise<Contract>
  /**
   * Загрузка списка договоров
   * @param signDate - необязательная дата подписания для фильтрации
   */
  fetchContracts: (signDate?: Date) => void
}

/**
 * Контекст для работы с договорами
 */
export const ContractContext = createContext<ContractContextProps | undefined>(undefined)

/**
 * Провайдер контекста договоров
 * @param children - дочерние компоненты
 */
export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Состояние для хранения списка договоров
  const [contracts, setContracts] = useState<Contract[]>([])

  // Загрузка договоров при монтировании компонента
  useEffect(() => {
    fetchContracts()
  }, [])

  /**
   * Загрузка договоров с возможностью фильтрации по дате подписания
   * @param signDate - дата подписания для фильтрации
   */
  const fetchContracts = async (signDate?: Date) => {
    try {
      const data = await ContractService.getContracts(signDate)
      setContracts(data || [])
    } catch (error) {
      console.error("Ошибка загрузки договоров:", error)
    }
  }

  /**
   * Создание нового договора
   * @param contract - данные нового договора
   */
  const addContract = async (contract: Omit<Contract, "id" | "object" | "user" | "reservation">) => {
    await ContractService.createContract(contract)
    const updatedList = await ContractService.getContracts()
    setContracts(updatedList)
  }

  /**
   * Получение договора по идентификатору
   * @param id - идентификатор договора
   * @returns Данные договора
   */
  const getContractById = async (id: number): Promise<Contract> => {
    return await ContractService.getContractById(id)
  }

  return (
    <ContractContext.Provider
      value={{
        contracts,
        addContract,
        getContractById,
        fetchContracts
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
import React, { createContext, useState, useEffect, ReactNode } from "react"
import ContractService from "../services/ContractService"
import { Contract } from "../models/contract"

interface ContractContextProps {
  contracts: Contract[] // Массив всех договоров
  addContract: (contract: Omit<Contract, "id" | "object" | "user" | "reservation">) => void // Добавление нового договора
  getContractById: (id: number) => Promise<Contract> // Получение договора по ID
  fetchContracts: (signDate?: Date) => void
}

// Создание контекста
export const ContractContext = createContext<ContractContextProps | undefined>(undefined)

// Провайдер контекста для предоставления данных всему приложению
export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]) // Локальное состояние для всех договоров

  useEffect(() => {
    fetchContracts()
  }, [])

  // Получение всех договоров
  // const fetchContracts = async () => {
  //   try {
  //     const data = await ContractService.getContracts()

  //     setContracts(data || [])
  //   } catch (error) {
  //     console.error("Ошибка загрузки договоров:", error)
  //   }
  // }
  const fetchContracts = async (signDate?: Date) => {
    try {
      const data = await ContractService.getContracts(signDate)
      setContracts(data || [])
    } catch (error) {
      console.error("Ошибка загрузки договоров:", error)
    }
  }
  // Добавление нового договора
  const addContract = async (contract: Omit<Contract, "id" | "object" | "user" | "reservation">) => {
    await ContractService.createContract(contract)
    const updatedList = await ContractService.getContracts()
    setContracts(updatedList)
  }

  // Получение договора по ID
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

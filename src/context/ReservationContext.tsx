import React, { createContext, useState, useEffect, ReactNode } from "react"
import ReservationService from "../services/ReservationService"
import { Reservation, ResStatus } from "../models/reservation"

/**
 * Интерфейс для контекста бронирований
 * @property {Reservation[]} reservations - Массив бронирований
 * @property {ResStatus[]} resStatuses - Массив статусов бронирований
 * @property {Function} addReservation - Функция добавления бронирования
 * @property {Function} updateReservation - Функция обновления бронирования
 * @property {Function} refreshReservations - Функция обновления списка бронирований
 */
interface ReservationContextProps {
  reservations: Reservation[]
  resStatuses: ResStatus[]
  addReservation: (reservation: Omit<Reservation, "id">) => void
  updateReservation: (id: number, reservation: Omit<Reservation, "id">) => Promise<Reservation>
  refreshReservations: (phoneNumber?: string) => void
}

/**
 * Контекст для работы с бронированиями
 */
export const ReservationContext = createContext<ReservationContextProps | undefined>(undefined)

/**
 * Провайдер контекста бронирований
 * @param {Object} props - Свойства компонента
 * @param {ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} Компонент провайдера контекста
 */
export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [resStatuses, setResStatuses] = useState<ResStatus[]>([])

  /**
   * Эффект для первоначальной загрузки данных
   */
  useEffect(() => {
    fetchReservations()
    fetchResStatuses()
  }, [])

  /**
   * Загрузка списка бронирований
   * @param {string} [phoneNumber] - Номер телефона для фильтрации
   */
  const fetchReservations = async (phoneNumber?: string) => {
    try {
      const data = await ReservationService.getReservations(phoneNumber);
      setReservations(data || []);
    } catch (error) {
      console.error("Ошибка загрузки бронирований:", error);
    }
  };

  /**
   * Загрузка списка статусов бронирований
   */
  const fetchResStatuses = async () => {
    try {
      const data = await ReservationService.getResStatuses()
      setResStatuses(data || [])
    } catch (error) {
      console.error("Ошибка загрузки статусов бронирования:", error)
    }
  }

  /**
   * Добавление нового бронирования
   * @param {Omit<Reservation, "id">} reservation - Данные бронирования
   */
  const addReservation = async (reservation: Omit<Reservation, "id">) => {
    await ReservationService.createReservation(reservation)
    const updatedList = await ReservationService.getReservations()
    setReservations(updatedList)
  }

  /**
   * Обновление существующего бронирования
   * @param {number} id - ID бронирования
   * @param {Omit<Reservation, "id">} updatedReservation - Обновленные данные
   * @returns {Promise<Reservation>} Обновленное бронирование
   */
  const updateReservation = async (id: number, updatedReservation: Omit<Reservation, "id">): Promise<Reservation> => {
    const response = await ReservationService.updateReservation(id, updatedReservation)
    const updatedList = await ReservationService.getReservations()
    setReservations(updatedList)
    return response
  }

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        resStatuses,
        addReservation,
        updateReservation,
        refreshReservations: fetchReservations
      }}
    >
      {children}
    </ReservationContext.Provider>
  )
}
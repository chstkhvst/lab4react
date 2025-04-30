import React, { createContext, useState, useEffect, ReactNode } from "react"
import ReservationService from "../services/ReservationService"
import { Reservation, ResStatus } from "../models/reservation"

interface ReservationContextProps {
  reservations: Reservation[]
  resStatuses: ResStatus[]
  
  addReservation: (reservation: Omit<Reservation, "id">) => void
  deleteReservation: (id: number) => void
  updateReservation: (id: number, reservation: Omit<Reservation, "id">) => Promise<Reservation>
  refreshReservations: () => void
}

export const ReservationContext = createContext<ReservationContextProps | undefined>(undefined)

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [resStatuses, setResStatuses] = useState<ResStatus[]>([])

  useEffect(() => {
    fetchReservations()
    fetchResStatuses()
  }, [])

  const fetchReservations = async () => {
    try {
      const data = await ReservationService.getReservations()
      setReservations(data || [])
    } catch (error) {
      console.error("Ошибка загрузки бронирований:", error)
    }
  }

  const fetchResStatuses = async () => {
    try {
      const data = await ReservationService.getResStatuses()
      setResStatuses(data || [])
    } catch (error) {
      console.error("Ошибка загрузки статусов бронирования:", error)
    }
  }

  const addReservation = async (reservation: Omit<Reservation, "id">) => {
    await ReservationService.createReservation(reservation)
    const updatedList = await ReservationService.getReservations()
    setReservations(updatedList)
  }

  const deleteReservation = async (id: number) => {
    await ReservationService.deleteReservation(id)
    setReservations(reservations.filter(r => r.id !== id))
  }

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
        deleteReservation,
        updateReservation,
        refreshReservations: fetchReservations
      }}
    >
      {children}
    </ReservationContext.Provider>
  )
}
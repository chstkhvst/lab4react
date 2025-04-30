import { Reservation, ResStatus } from "../models/reservation";

class ReservationService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Получение списка всех бронирований
  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation`);
    if (!response.ok) throw new Error("Failed to fetch reservations");
    return await response.json();
  }

  // Получение бронирования по ID
  async getReservationById(id: number): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`);
    if (!response.ok) throw new Error("Failed to fetch reservation");
    return await response.json();
  }

  // Создание нового бронирования
  async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) throw new Error("Failed to create reservation");
    return await response.json();
  }

  // Обновление бронирования
  async updateReservation(id: number, reservation: Omit<Reservation, "id">): Promise<Reservation> {
    const reservationWithId = { ...reservation, id };
    console.log(reservationWithId)
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationWithId),
    });
    if (!response.ok) throw new Error("Failed to update reservation");
    return await response.json();
  }

  // Удаление бронирования
  async deleteReservation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete reservation");
  }

  // Получение списка статусов бронирования
  async getResStatuses(): Promise<ResStatus[]> {
    const response = await fetch(`${this.baseUrl}/catalog/resstatuses`);
    if (!response.ok) throw new Error("Failed to fetch reservation statuses");
    return await response.json();
  }

}

export default new ReservationService("/api"); // Экспортируем инстанс с базовым URL
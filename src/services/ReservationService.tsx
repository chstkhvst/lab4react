import { Reservation, ResStatus } from "../models/reservation";

/**
 * Сервис для работы с бронированиями
 */
class ReservationService {
  /** Базовый URL API */
  private baseUrl: string;

  /**
   * Создает экземпляр ReservationService
   * @param {string} baseUrl - Базовый URL API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получает список всех бронирований
   * @returns {Promise<Reservation[]>} Промис с массивом бронирований
   * @throws {Error} Если не удалось загрузить бронирования
   */
  // async getReservations(): Promise<Reservation[]> {
  //   const response = await fetch(`${this.baseUrl}/Reservation`);
  //   if (!response.ok) throw new Error("Failed to fetch reservations");
  //   return await response.json();
  // }
  async getReservations(phoneNumber?: string): Promise<Reservation[]> {
    try {
      let url = `${this.baseUrl}/Reservation`;
  
      if (phoneNumber) {
        url += `?phoneNumber=${encodeURIComponent(phoneNumber)}`;
        console.log('Fetching reservations with phone number:', phoneNumber);
      } else {
        console.log('Fetching all reservations (no phone number specified)');
      }
  
      console.log('Request URL:', url);
  
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error(`Fetch failed. Status: ${response.status}`);
        throw new Error(`Failed to fetch reservations. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched reservations:', data);
  
      return data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }
  

  /**
   * Получает бронирование по его ID
   * @param {number} id - ID бронирования
   * @returns {Promise<Reservation>} Промис с запрошенным бронированием
   * @throws {Error} Если не удалось загрузить бронирование
   */
  async getReservationById(id: number): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`);
    if (!response.ok) throw new Error("Failed to fetch reservation");
    return await response.json();
  }

  /**
   * Создает новое бронирование
   * @param {Omit<Reservation, "id">} reservation - Данные бронирования (без ID)
   * @returns {Promise<Reservation>} Промис с созданным бронированием
   * @throws {Error} Если не удалось создать бронирование
   */
  async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) throw new Error("Failed to create reservation");
    return await response.json();
  }

  /**
   * Обновляет существующее бронирование
   * @param {number} id - ID бронирования для обновления
   * @param {Omit<Reservation, "id">} reservation - Новые данные бронирования
   * @returns {Promise<Reservation>} Промис с обновленным бронированием
   * @throws {Error} Если не удалось обновить бронирование
   */
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

  /**
   * Удаляет бронирование
   * @param {number} id - ID бронирования для удаления
   * @returns {Promise<void>}
   * @throws {Error} Если не удалось удалить бронирование
   */
  async deleteReservation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete reservation");
  }

  /**
   * Получает список возможных статусов бронирования
   * @returns {Promise<ResStatus[]>} Промис с массивом статусов бронирования
   * @throws {Error} Если не удалось загрузить статусы бронирования
   */
  async getResStatuses(): Promise<ResStatus[]> {
    const response = await fetch(`${this.baseUrl}/catalog/resstatuses`);
    if (!response.ok) throw new Error("Failed to fetch reservation statuses");
    return await response.json();
  }
}

/** Экспортированный экземпляр ReservationService с базовым URL '/api' */
export default new ReservationService("/api");
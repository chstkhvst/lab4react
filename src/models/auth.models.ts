// Модель для запроса на вход
export interface LoginRequest {
    userName: string
    password: string
  }
  
  // Модель для успешного ответа на вход
  export interface LoginResponse {
    token: string
    userName: string
    userRole: string
  }
  
  // Модель для ошибки API
  export interface ApiError {
    message?: string
    errors?: Record<string, string[]>
  }
  // Модель запроса для регистрации
export interface RegisterRequest {
  userName: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

// Модель ответа для регистрации
export interface RegisterResponse {
  token: string;
  userName: string;
  userRole: string;
  fullName: string;
  phoneNumber: string;
}
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import ReservationList from "./ReservationList";
import { ReservationContext } from "../context/ReservationContext";
import { AuthContext } from "../context/AuthContext";
import { ContractContext } from "../context/ContractContext";
import { Reservation, ResStatus } from "../models/reservation";
import { CurrentUser } from "../models/auth.models";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("ReservationList", () => {
  const mockReservation: Reservation = {
    id: 1,
    objectId: 1,
    userId: "1",
    startDate: "2023-01-01",
    endDate: "2023-01-10",
    resStatusId: 1,
    object: {
      id: 1,
      street: "Main St",
      building: 10,
      roomnum: 5,
      rooms: 2,
      floors: 1,
      square: 50,
      price: 1000,
      dealtypeid: 1,
      typeid: 1,
      statusid: 1,
      dealType: { id: 1, dealName: "Аренда" },
      status: { id: 1, statusName: "Свободен" },
      objectType: { id: 1, typeName: "Квартира" }
    },
    resStatus: {
      id: 1,
      statusType: "Оставлена"
    },
    user: {
      id: "1",
      userName: "testuser",
      fullName: "Test User",
      phoneNumber: "89000000000",
      roles: ["user"]
    }
  };

  const mockReservationContext = {
    reservations: [mockReservation],
    resStatuses: [
      { id: 1, statusType: "Оставлена" },
      { id: 2, statusType: "Одобрена" },
      { id: 3, statusType: "Отменена" }
    ] as ResStatus[],
    addReservation: jest.fn(),
    updateReservation: jest.fn(),
    refreshReservations: jest.fn()
  };

  const mockCurrentUser: CurrentUser = {
    id: "1",
    userName: "admin",
    fullName: "Admin",
    phoneNumber: "8900000000",
    reservations: []
  };

  const mockAuthContext = {
    currentUser: mockCurrentUser,
    fetchCurrentUser: jest.fn(),
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isAdmin: true,
    isLoading: false,
    getAllUsers: jest.fn()
  };

  const mockContractContext = {
    addContract: jest.fn(),
    contracts: [],
    fetchContracts: jest.fn(),
    getContractById: jest.fn(), 
    updateContract: jest.fn(), 
    deleteContract: jest.fn()
  };

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ReservationContext.Provider value={mockReservationContext}>
            <ContractContext.Provider value={mockContractContext}>
              <ReservationList />
            </ContractContext.Provider>
          </ReservationContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("отображает заголовок и поиск", () => {
    renderComponent();
    
    expect(screen.getByText(/Список бронирований/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Поиск по номеру телефона/i)).toBeInTheDocument();
  });

  it("отображает список бронирований", () => {
    renderComponent();
    
    expect(screen.getByText(/Main St, д. 10, кв. 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Оставлена/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/8900000000/i)).toBeInTheDocument();
  });

  it("отображает сообщение при отсутствии бронирований", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ReservationContext.Provider value={{...mockReservationContext, reservations: []}}>
            <ContractContext.Provider value={mockContractContext}>
              <ReservationList />
            </ContractContext.Provider>
          </ReservationContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Нет доступных бронирований/i)).toBeInTheDocument();
  });

  it("вызывает поиск при вводе телефона", async () => {
    renderComponent();
    
    fireEvent.change(screen.getByPlaceholderText(/Поиск по номеру телефона/i), {
      target: { value: "89000000000" }
    });
    
    await waitFor(() => {
      expect(mockReservationContext.refreshReservations).toHaveBeenCalledWith("89000000000");
    });
  });

  it("отменяет бронирование при подтверждении", async () => {
    renderComponent();
    
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText(/Отменить/i));
    
    await waitFor(() => {
      expect(mockReservationContext.updateReservation).toHaveBeenCalledWith(1, {
        ...mockReservation,
        resStatusId: 3
      });
    });
  });

  it("не отменяет бронирование без подтверждения", async () => {
    renderComponent();
    
    window.confirm = jest.fn(() => false);
    fireEvent.click(screen.getByText(/Отменить/i));
    
    await waitFor(() => {
      expect(mockReservationContext.updateReservation).not.toHaveBeenCalled();
    });
  });

  it("создает договор при нажатии кнопки", async () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/Договор/i));
    
    await waitFor(() => {
      expect(mockContractContext.addContract).toHaveBeenCalledWith({
        reservationId: 1,
        userId: "1",
        signDate: expect.any(String),
        total: 1000
      });
    });
  });
});
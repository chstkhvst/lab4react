import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import AccountDetails from "./AccountDetails";
import { AuthContext } from "../context/AuthContext";
import { ReservationContext } from "../context/ReservationContext";
import { Reservation, ResStatus } from "../models/reservation";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("AccountDetails", () => {
  const mockReservation: Reservation = {
    id: 1,
    objectId: 1,
    userId: "1",
    startDate: "2023-01-01",
    endDate: "2023-01-10",
    resStatusId: 1,
    object: {
      id: 1,
      street: "Street",
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
    }
  };

  const mockCurrentUser = {
    userName: "testuser",
    fullName: "Test User",
    phoneNumber: "8900000000",
    id: "1",
    reservations: [mockReservation]
  };

  const mockAuthContext = {
    currentUser: mockCurrentUser,
    fetchCurrentUser: jest.fn(),
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isAdmin: false,
    isLoading: false,
    getAllUsers: jest.fn()
  };

  const mockReservationContext = {
    reservations: [mockReservation],
    updateReservation: jest.fn(),
    resStatuses: [
      { id: 1, statusType: "Оставлена" },
      { id: 3, statusType: "Отменена" }
    ] as ResStatus[],
    addReservation: jest.fn(),
    refreshReservations: jest.fn(),
  };

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ReservationContext.Provider value={mockReservationContext}>
            <AccountDetails />
          </ReservationContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("отображает информацию о пользователе", () => {
    renderComponent();
    
    expect(screen.getByText(/Профиль пользователя/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/8900000000/i)).toBeInTheDocument();
  });

  it("переключается в режим редактирования при нажатии кнопки", () => {
    renderComponent();
    
    fireEvent.click(screen.getByTestId("edit-button"));
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
  });

  it("отображает бронирования пользователя", () => {
    renderComponent();
    
    expect(screen.getByText(/Мои бронирования/i)).toBeInTheDocument();
    expect(screen.getByText(/Street, д. 10, кв.5/i)).toBeInTheDocument();
    expect(screen.getByText(/Оставлена/i)).toBeInTheDocument();
  });

  it("вызывает updateReservation при отмене бронирования", async () => {
    renderComponent();
    
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText(/Отменить бронь/i));
    
    await waitFor(() => {
      expect(mockReservationContext.updateReservation).toHaveBeenCalledWith(1, {
        objectId: 1,
        userId: "1",
        startDate: "2023-01-01",
        endDate: "2023-01-10",
        resStatusId: 3
      });
    });
  });

  it("не вызывает updateReservation если отмена не подтверждена", async () => {
    renderComponent();
    
    window.confirm = jest.fn(() => false);
    fireEvent.click(screen.getByText(/Отменить бронь/i));
    
    await waitFor(() => {
      expect(mockReservationContext.updateReservation).not.toHaveBeenCalled();
    });
  });

  it("навигирует на главную при нажатии кнопки", () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/На главную/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });
});
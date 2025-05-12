import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import LoginModal from "./LoginModal"
import { BrowserRouter } from "react-router-dom"

// Мокаем useNavigate
const mockedUsedNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}))

// Мокаем useAuth и задаем реализацию
const mockLogin = jest.fn()
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe("LoginModal", () => {
  const onClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("отображается при open=true", () => {
    renderWithRouter(<LoginModal open={true} onClose={onClose} />)
    expect(screen.getByText(/Вход в систему/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Имя пользователя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument()
  })

  it("кнопка 'Войти' неактивна при пустых полях", () => {
    renderWithRouter(<LoginModal open={true} onClose={onClose} />)
    const button = screen.getByRole("button", { name: /Войти/i })
    expect(button).toBeDisabled()
  })

  it("вызывает login и закрывает модалку при успешном входе", async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    renderWithRouter(<LoginModal open={true} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Имя пользователя/i), {
      target: { value: "testuser" },
    })
    fireEvent.change(screen.getByLabelText(/Пароль/i), {
      target: { value: "password" },
    })

    const button = screen.getByRole("button", { name: /Войти/i })
    fireEvent.click(button)

    expect(mockLogin).toHaveBeenCalledWith("testuser", "password")
    await waitFor(() => expect(onClose).toHaveBeenCalled())
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith("/"))
  })

  it("показывает ошибку при неуспешном входе", async () => {
    mockLogin.mockRejectedValueOnce(new Error("fail"))
    renderWithRouter(<LoginModal open={true} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Имя пользователя/i), {
      target: { value: "wronguser" },
    })
    fireEvent.change(screen.getByLabelText(/Пароль/i), {
      target: { value: "wrongpass" },
    })

    const button = screen.getByRole("button", { name: /Войти/i })
    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByText(/Вход не выполнен/i)).toBeInTheDocument()
    )
    expect(onClose).not.toHaveBeenCalled()
    expect(mockedUsedNavigate).not.toHaveBeenCalled()
  })

  it("переходит на страницу регистрации по кнопке", () => {
    renderWithRouter(<LoginModal open={true} onClose={onClose} />)
    const regButton = screen.getByRole("button", {
      name: /Нет аккаунта\? Зарегистрироваться/i,
    })
    fireEvent.click(regButton)
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/register")
  })
})

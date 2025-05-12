import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import REObjectForm from "./REObjectForm";
import { REObjectContext } from "../context/REObjectContext";
jest.setTimeout(15000);
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("REObjectForm", () => {
  const mockAddREObject = jest.fn();

  const contextValue = {
    reobjects: [],
    dealTypes: [
      { id: 1, dealName: "Аренда" },
      { id: 2, dealName: "Продажа" },
    ],
    objectTypes: [
      { id: 1, typeName: "Квартира" },
      { id: 2, typeName: "Дом" },
    ],
    statuses: [
      { id: 1, statusName: "Свободен" },
      { id: 2, statusName: "Занят" },
    ],
    resStatuses: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
    addREObject: mockAddREObject,
    deleteREObject: jest.fn(),
    updateREObject: jest.fn(),
    fetchFilteredObjects: jest.fn(),
    getREObjectById: jest.fn(),
    fetchPaginatedObjects: jest.fn(),
  };

  const renderForm = () =>
    render(
      <BrowserRouter>
        <REObjectContext.Provider value={contextValue}>
          <REObjectForm />
        </REObjectContext.Provider>
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("показывает ошибку при недопустимом значении улицы", async () => {
      renderForm();

      fireEvent.change(screen.getByLabelText(/Улица/i), {
        target: { value: "123!!!" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Сохранить/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Введите корректное название улицы/i)
        ).toBeInTheDocument();
      });
      expect(mockAddREObject).not.toHaveBeenCalled();
    });

    it("показывает ошибки при попытке отправки пустой формы", async () => {
      renderForm();
      fireEvent.click(screen.getByRole("button", { name: /Сохранить/i }));

      await waitFor(() => {
        expect(screen.getAllByText(/Поле обязательно/i).length).toBeGreaterThan(0);
      });
      expect(mockAddREObject).not.toHaveBeenCalled();
    });

    it("кнопка «Отмена» навигирует на /objects", () => {
      renderForm();
      const cancel = screen.getByRole("button", { name: /Отмена/i });
      fireEvent.click(cancel);
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/objects");
    });

    it("при выборе файлов отображается их количество", () => {
    renderForm();
    const fileInput = screen.getByTestId('file-input');
    const file1 = new File(["a"], "a.png", { type: "image/jpg" });
    const file2 = new File(["b"], "b.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });
    expect(
      screen.getByText(/Выбрано новых файлов: 2/i)
    ).toBeInTheDocument();
  }); 

});
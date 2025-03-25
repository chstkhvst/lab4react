// Импортируем необходимые хуки из React
import { useState, useEffect } from "react";

interface DealType {
    id: number;
    dealName: string;
}

interface ObjectType {
    id: number;
    typeName: string;
}

interface Status {
    id: number;
    statusName: string;
}

// Объект недвижимости
interface REObject {
    id: number;
    rooms: number;
    floors: number;
    square: number;
    street: string;
    building: number;
    roomnum?: number;
    price: number;
    dealType: DealType;
    objectType: ObjectType;
    status: Status;
}

// Функциональный компонент списка объектов недвижимости
const REObjectList = () => {
    // Хранение списка объектов недвижимости
    const [reobjects, setReObjects] = useState<REObject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Запрос данных с сервера при загрузке компонента
    useEffect(() => {
        fetchData();
    }, []);

    // Функция загрузки данных
    const fetchData = () => {
        fetch('/api/REObject')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.text(); // Читаем как текст
            })
            .then((text) => {
                if (!text) {
                    throw new Error("Пустой ответ от сервера");
                }
                return JSON.parse(text); // Преобразуем в JSON
            })
            .then((data: REObject[]) => {
                console.log("Данные получены:", data);
                setReObjects(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке данных:", error);
                setError(error.message);
                setLoading(false);
            });
    };
    

    // Отображение загрузки
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Отображение ошибки
    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    // Отображение списка объектов недвижимости
    return (
        <div>
            <h1>Список объектов недвижимости</h1>
            <ul>
                {reobjects.map((reobject) => (
                    <li key={reobject.id}>
                        <h2>{`${reobject.street}, д. ${reobject.building}${reobject.roomnum ? `, кв. ${reobject.roomnum}` : ""}`}</h2>
                        <p>
                            Тип: {reobject.objectType.typeName} | Сделка: {reobject.dealType.dealName} | Статус: {reobject.status.statusName}
                        </p>
                        <p>
                            Площадь: {reobject.square} м² | Этажей: {reobject.floors} | Комнат: {reobject.rooms}
                        </p>
                        <p>Цена: {reobject.price} руб.</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Экспортируем компонент
export default REObjectList;

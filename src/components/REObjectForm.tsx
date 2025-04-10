import React, { useState, useContext, useEffect } from "react"
import { REObjectContext } from "../context/REObjectContext"
import { useNavigate } from "react-router-dom"
import { DealType, ObjectType, Status, REObject } from "../models/reobject"
import APIService from "../services/APIService"

interface NewREObject {
  street: string
  building: string
  roomnum?: string
  rooms: string
  floors: string
  square: string
  price: string
  dealtypeid: string
  typeid: string
  statusid: string
}

const REObjectForm: React.FC = () => {
  const context = useContext(REObjectContext)
  const navigate = useNavigate()

  const [newObject, setNewObject] = useState<NewREObject>({
    street: "",
    building: "",
    roomnum: "",
    rooms: "",
    floors: "",
    square: "",
    price: "",
    dealtypeid: "",
    typeid: "",
    statusid: "",
  })

/*   const [dealTypes, setDealTypes] = useState<DealType[]>([])
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([])
  const [statuses, setStatuses] = useState<Status[]>([]) */

  // Загружаем данные для комбобоксов
/*   useEffect(() => {
    APIService.getDealTypes().then(setDealTypes)
    APIService.getObjectTypes().then(setObjectTypes)
    APIService.getStatuses().then(setStatuses)
  }, []) */
/*   useEffect(() => {
    APIService.getMetadata().then((data) => {
      setDealTypes(data.dealTypes);
      setObjectTypes(data.objectTypes);
      setStatuses(data.statuses);
    });
  }, []);
   */
  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Проверка обязательных полей
    const requiredFields = [
      "street",
      "building",
      "rooms",
      "floors",
      "square",
      "price",
      "dealtypeid",
      "typeid",
      "statusid",
    ];
  
    for (const field of requiredFields) {
      if (!newObject[field as keyof NewREObject]?.trim()) {
        alert(`Пожалуйста, заполните поле: ${field}`);
        return;
      }
    }
  
    if (context) {
      context.addREObject({
        street: newObject.street,
        building: Number(newObject.building),
        roomnum: newObject.roomnum ? Number(newObject.roomnum) : undefined,
        rooms: Number(newObject.rooms),
        floors: Number(newObject.floors),
        square: Number(newObject.square),
        price: Number(newObject.price),
        dealtypeid: Number(newObject.dealtypeid),
        typeid: Number(newObject.typeid),
        statusid: Number(newObject.statusid),
      });
  
      // Сбрасываем форму
      setNewObject({
        street: "",
        building: "",
        roomnum: "",
        rooms: "",
        floors: "",
        square: "",
        price: "",
        dealtypeid: "",
        typeid: "",
        statusid: "",
      });
  
      navigate("/");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить объект недвижимости</h2>
  
      <div>
        <input
          type="text"
          placeholder="Улица"
          value={newObject.street}
          required
          onChange={(e) => setNewObject({ ...newObject, street: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Дом"
          value={newObject.building}
          required
          onChange={(e) => setNewObject({ ...newObject, building: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Номер квартиры"
          value={newObject.roomnum}
          onChange={(e) => setNewObject({ ...newObject, roomnum: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Комнат"
          value={newObject.rooms}
          required
          onChange={(e) => setNewObject({ ...newObject, rooms: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Этажей"
          value={newObject.floors}
          required
          onChange={(e) => setNewObject({ ...newObject, floors: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Площадь"
          value={newObject.square}
          required
          onChange={(e) => setNewObject({ ...newObject, square: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="Цена"
          value={newObject.price}
          required
          onChange={(e) => setNewObject({ ...newObject, price: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="ID типа сделки"
          value={newObject.dealtypeid}
          required
          onChange={(e) => setNewObject({ ...newObject, dealtypeid: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="ID типа объекта"
          value={newObject.typeid}
          required
          onChange={(e) => setNewObject({ ...newObject, typeid: e.target.value })}
        />
      </div>
  
      <div>
        <input
          type="text"
          placeholder="ID статуса"
          value={newObject.statusid}
          required
          onChange={(e) => setNewObject({ ...newObject, statusid: e.target.value })}
        />
      </div>
  
      <button type="submit">Добавить</button>
      <button type="button" onClick={() => navigate("/")}>
        Назад
      </button>
    </form>
  );  
}

export default REObjectForm

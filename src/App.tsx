// Импортируем компонент REObjectList из файла REObjectList.tsx, который находится в папке components
import REObjectList from './components/REObjectList';

// Создаем функциональный компонент App
const App = () => {
  return (
    <>
      {/* Рендерим компонент REObjectList, который отвечает за отображение списка объектов недвижимости */}
      <REObjectList />
    </>
  );
};

// Экспортируем компонент App по умолчанию, чтобы его можно было использовать в других частях приложения
export default App;

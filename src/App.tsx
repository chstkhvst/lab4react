/* // Импортируем компонент REObjectList из файла REObjectList.tsx, который находится в папке components
import REObjectList from './components/REObjectList';

// Создаем функциональный компонент App
const App = () => {
  return (
    <>
      <REObjectList />
    </>
  );
}; */

// Экспортируем компонент App по умолчанию, чтобы его можно было использовать в других частях приложения
/* export default App; */
// import React from "react"
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
// import { REObjectProvider } from "./context/REObjectContext"
// import REObjectList from "./components/REObjectList"
// import REObjectForm from "./components/REObjectForm"
// import REObjectDetails from "./components/REObjectDetails"

// const App: React.FC = () => {
//   return (
//     <REObjectProvider>
//       <Router>
//         <h1>REA</h1>
//         <Routes>
//           <Route path="/" element={<REObjectList />} /> {/* Главная страница */}
//           <Route path="reobjects/add" element={<REObjectForm />} /> {/* Добавление */}
//           <Route path="/reobjects/:id" element={<REObjectDetails />} /> {/* Детали  */}
//         </Routes>
//       </Router>
//     </REObjectProvider>
//   )
// }

// export default App
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { REObjectProvider } from "./context/REObjectContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/pages/Home";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ObjectsPage from "./components/pages/ObjectsPage";
import ObjectsPageForUsers from "./components/pages/ObjectsPageForUsers";
import Layout from "./components/common/Layout";
import REObjectForm from "./components/REObjectForm";
import REObjectDetails from "./components/REObjectDetails";
import { useAuth } from "./context/AuthContext"

const ProtectedRoute: React.FC<{ children: React.ReactElement, adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    alert("Недостаточно прав. Выполните вход!");
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    alert("У вас нет прав администратора.");
    return <Navigate to="/" replace />;
  }

  return children;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <REObjectProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/objects-for-users"
                element={
                  <ProtectedRoute>
                    <ObjectsPageForUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/objects"
                element={
                  <ProtectedRoute adminOnly>
                    <ObjectsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
              path="/objects/add"
              element={
                <ProtectedRoute adminOnly>
                  <REObjectForm />
                </ProtectedRoute>
              }
              />

              
              <Route
                path="/objects/:id"
                element={
                  <ProtectedRoute>
                    <REObjectDetails />
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="/objects/:id/edit"
                element={
                  <ProtectedRoute adminOnly>
                    <REObjectForm isEditMode />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
          </Layout>
        </Router>
      </REObjectProvider>
    </AuthProvider>
  );
};

export default App;
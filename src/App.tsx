import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { REObjectProvider } from "./context/REObjectContext";
import { AuthProvider } from "./context/AuthContext";
import { ReservationProvider } from "./context/ReservationContext";
import Home from "./components/pages/Home";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ObjectsPage from "./components/pages/ObjectsPage";
import ObjectsPageForUsers from "./components/pages/ObjectsPageForUsers";
import Layout from "./components/common/Layout";
import REObjectForm from "./components/REObjectForm";
import REObjectDetails from "./components/REObjectDetails";
import AccountDetails from "./components/AccountDetails";
import UsersList from "./components/UsersList";
import { useAuth } from "./context/AuthContext";
import ReservationList from "./components/ReservationList";
import { ContractProvider } from "./context/ContractContext";
import ContractList from "./components/ContractList";
import ContractDetails from "./components/ContractDetails";
import { CircularProgress } from "@mui/material";

const ProtectedRoute: React.FC<{ children: React.ReactElement, adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  if (isLoading) return <CircularProgress/>
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
    <ReservationProvider>
      <AuthProvider>
      <REObjectProvider>
        <ContractProvider> 
          <Router>
            <Layout>
              <Routes>
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
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AccountDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-users"
                  element={
                    <ProtectedRoute adminOnly>
                      <UsersList />
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
                  path="/reservations"
                  element={
                    <ProtectedRoute adminOnly>
                      <ReservationList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contracts"
                  element={
                    <ProtectedRoute adminOnly>
                      <ContractList/>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/contracts/:id"
                  element={
                    <ProtectedRoute adminOnly>
                      <ContractDetails />
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
              </Routes>
            </Layout>
          </Router>
        </ContractProvider> 
      </REObjectProvider>
    </AuthProvider>
    </ReservationProvider>

  );
};

export default App;
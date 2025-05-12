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
import ErrorBoundary from "./components/common/ErrorBoundary";

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
    <ErrorBoundary>
    <ReservationProvider>
      <AuthProvider>
      <REObjectProvider>
        <ContractProvider> 
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
                <Route path="/login" element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
                <Route path="/register" element={<ErrorBoundary><RegisterPage /></ErrorBoundary>} />
                <Route
                  path="/objects-for-users"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary><ObjectsPageForUsers /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary><AccountDetails /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-users"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><UsersList /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/objects"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><ObjectsPage /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reservations"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><ReservationList /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contracts"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><ContractList/></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/contracts/:id"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><ContractDetails /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/objects/add"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary><REObjectForm /></ErrorBoundary> 
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/objects/:id"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary><REObjectDetails /></ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
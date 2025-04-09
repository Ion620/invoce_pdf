import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientsList from './pages/clients/ClientsList';
import ClientForm from './pages/clients/ClientForm';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceForm from './pages/invoices/InvoiceForm';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Încărcare...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/clients" replace />} />
                <Route path="clients">
                    <Route index element={<ClientsList />} />
                    <Route path="create" element={<ClientForm />} />
                    <Route path="edit/:id" element={<ClientForm />} />
                </Route>
                <Route path="facturi">
                    <Route index element={<InvoiceList />} />
                    <Route path="create" element={<InvoiceForm />} />
                    <Route path="edit/:id" element={<InvoiceForm />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;

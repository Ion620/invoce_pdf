import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Apps from './Apps';
import './bootstrap';
import '../css/app.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <AuthProvider>
            <Apps />
            <ToastContainer position="bottom-right" />
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

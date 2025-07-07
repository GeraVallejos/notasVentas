import { createBrowserRouter } from "react-router-dom";
import { privateLoader, publicLoader } from "./loader";
import NotasPage from "../pages/NotasPage";
import HomePage from "../pages/HomePage";
import Loginpage from "../pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import NotasDataPage from "../pages/NotasDataPage";
import HistoricoNotasPage from "../pages/HistoricoNotasPage";

export const getRoutes = () => createBrowserRouter([
    {
        element: <AppLayout />,
        loader: privateLoader,
        children: [
            {
                index: true,
                element: <HomePage />,
                
            },
            {
                path: "notas",
                element: <NotasPage />,
            },
            {
                path: "lista-notas",
                element: <NotasDataPage />,
            },
            {
                path: "lista-historico",
                element: <HistoricoNotasPage />,
            },
        ]
    },
    {
        element: <AuthLayout />,
        loader: publicLoader,
        children: [
            {
                path: "*",
                element: <Loginpage />,
            },
            {
                path: "login",
                element: <Loginpage />,
            },
        ]
    },
])
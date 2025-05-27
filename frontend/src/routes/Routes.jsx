import { createBrowserRouter } from "react-router-dom";
import { privateLoader, publicLoader } from "./loader";
import NotasPage from "../pages/NotasPage";
import HomePage from "../pages/HomePage";
import Loginpage from "../pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/Applayout";
import NotasDataPage from "../pages/NotasDataPage";

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
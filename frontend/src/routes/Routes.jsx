import { createBrowserRouter } from "react-router-dom";
import { privateLoader, publicLoader } from "./loader";
import NotasPage from "../pages/NotasPage";
import HomePage from "../pages/HomePage";
import Loginpage from "../pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import NotasDataPage from "../pages/NotasDataPage";
import HistoricoNotasPage from "../pages/HistoricoNotasPage";
import GroupsRouter from "./GroupsRouter";
import MateriasPrimasPage from "../pages/MateriasPrimasPage";
import SabadosPage from "../pages/SabadosPage";
import HistoricoSabadosPage from "../pages/HistoricoSabadosPage";
import ListaMateriasPrimasPage from "../pages/ListaMateriasPrimasPage";
import HistoricoPrimasPage from "../pages/HistoricoPrimasPage";


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
                element: (
                    <GroupsRouter group="Admin">
                        <HistoricoNotasPage />
                    </GroupsRouter>),
            },
            {
                path: "lista-materias-primas",
                element: (
                    <GroupsRouter group="Admin">
                        <ListaMateriasPrimasPage />
                    </GroupsRouter>),
            },
            {
                path: "materias-primas",
                element: (
                    <GroupsRouter group="Admin">
                        <MateriasPrimasPage />
                    </GroupsRouter>),
            },
            {
                path: "historico-materias-primas",
                element: (
                    <GroupsRouter group="Admin">
                        <HistoricoPrimasPage />
                    </GroupsRouter>),
            },
            {
                path: "sabados",
                element: (
                    <GroupsRouter group="Admin">
                        <SabadosPage />
                    </GroupsRouter>),
            },
            {
                path: "historico-sabados",
                element: (
                    <GroupsRouter group="Admin">
                        <HistoricoSabadosPage />
                    </GroupsRouter>),
            },
            {
                path: "*",
                element: <HomePage />
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
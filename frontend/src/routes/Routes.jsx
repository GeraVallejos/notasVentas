import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { privateLoader, publicLoader } from "./loader";
import NotasPage from "../pages/NotasPage";
import HomePage from "../pages/HomePage";
import Loginpage from "../pages/LoginPage";

export const getRoutes = () => createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: privateLoader,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "notas",
                element: <NotasPage />,
            },      
        ]
    },
    {
        path: "login",
        loader: publicLoader,
        element: <Loginpage />,
    },
    {
        path: "*",
        loader: publicLoader,
        element: <Loginpage />,
    },
    
])
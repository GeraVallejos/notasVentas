import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { Provider } from 'react-redux'
import './index.css'
import { getRoutes } from './routes/Routes';
import { store } from './store';

const router = getRoutes();

createRoot(document.getElementById('root')).render(


  <StrictMode>
  
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>

  </StrictMode>,
)
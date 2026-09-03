import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Catalogo from './Catalogo'
import './index.css'

createRoot(document.getElementById('root')!).render(<StrictMode><Catalogo /></StrictMode>)

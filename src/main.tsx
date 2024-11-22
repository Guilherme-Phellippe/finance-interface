import { createRoot } from 'react-dom/client'
import App from './App'
import { Modal } from './components/modal/Modal'
import { ModalProvider } from './context/ModalContext'

createRoot(document.getElementById('root')!).render(
    <ModalProvider>
        <App />
        <Modal />
    </ModalProvider>
)

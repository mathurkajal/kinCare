import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '../presentation/App.tsx';
import { StoreProvider } from './store/StoreProvider.tsx';
import '../presentation/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
);

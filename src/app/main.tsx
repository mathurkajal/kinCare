import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../presentation/App.tsx';
import { ErrorBoundary } from '../presentation/components/ErrorBoundary.tsx';
import '../presentation/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

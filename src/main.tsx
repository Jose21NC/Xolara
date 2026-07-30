import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { OverlayProvider } from './contexts/OverlayContext';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

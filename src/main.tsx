import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './routes/App';
import './styles/index.css';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import { CharacterProvider } from './context/CharacterContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LibraryProvider>
          <CharacterProvider>
            <App />
          </CharacterProvider>
        </LibraryProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);

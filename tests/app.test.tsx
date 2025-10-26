import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/routes/App';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { LibraryProvider } from '@/context/LibraryContext';
import { CharacterProvider } from '@/context/CharacterContext';

describe('App', () => {
  it('renders the header', () => {
    render(
      <HashRouter>
        <ThemeProvider>
          <LibraryProvider>
            <CharacterProvider>
              <App />
            </CharacterProvider>
          </LibraryProvider>
        </ThemeProvider>
      </HashRouter>
    );

    expect(
      screen.getByRole('link', { name: /Lasers & Feelings Character Creator/i })
    ).toBeInTheDocument();
  });
});

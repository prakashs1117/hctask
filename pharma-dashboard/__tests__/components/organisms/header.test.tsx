import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../../components/organisms/header';

const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}));

jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'common.mfeArchitecture': 'MFE Architecture',
        'common.mfeShort': 'MFE',
        'common.changeLanguage': 'Change Language',
        'common.toggleLanguage': 'Toggle Language',
        'common.toggleTheme': 'Toggle Theme',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('Header', () => {
  it('should render header with MFE text', () => {
    render(<Header />);
    expect(screen.getByText('MFE Architecture')).toBeInTheDocument();
  });

  it('should have theme toggle button', () => {
    render(<Header />);
    const themeButtons = screen.getAllByTitle('Toggle Theme');
    expect(themeButtons.length).toBeGreaterThan(0);
  });

  it('should toggle theme when theme button is clicked', () => {
    render(<Header />);
    const themeButton = screen.getAllByTitle('Toggle Theme')[0];
    fireEvent.click(themeButton);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should have locale switcher button', () => {
    render(<Header />);
    const localeButton = screen.getByTitle('Change Language');
    expect(localeButton).toBeInTheDocument();
  });
});

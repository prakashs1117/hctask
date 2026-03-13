import React from 'react';
import { render, screen } from '@testing-library/react';
import { TranslatedText, LoadingText, SearchPlaceholder, FiltersText, ClearAllText } from '../../../components/molecules/translated-text';

jest.mock('../../../lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
        'common.search': 'Search...',
        'common.filters': 'Filters',
        'common.clearAll': 'Clear All',
        'greeting.hello': 'Hello {name}',
      };
      let value = translations[key];
      if (!value) return key;
      if (params) {
        Object.keys(params).forEach(param => {
          value = value.replace(new RegExp(`{${param}}`, 'g'), String(params[param]));
        });
      }
      return value;
    },
    translations: {},
  }),
}));

describe('TranslatedText', () => {
  it('should render translated text', () => {
    render(<TranslatedText keyPath="common.loading" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should use fallback when translation returns key', () => {
    render(<TranslatedText keyPath="unknown.key" fallback="Fallback Text" />);
    expect(screen.getByText('Fallback Text')).toBeInTheDocument();
  });

  it('should show key when no fallback and translation missing', () => {
    render(<TranslatedText keyPath="missing.key" />);
    expect(screen.getByText('missing.key')).toBeInTheDocument();
  });

  it('should apply className', () => {
    render(<TranslatedText keyPath="common.loading" className="text-bold" />);
    const span = screen.getByText('Loading...');
    expect(span).toHaveClass('text-bold');
  });
});

describe('Common text components', () => {
  it('should render LoadingText', () => {
    render(<LoadingText />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render SearchPlaceholder', () => {
    render(<SearchPlaceholder />);
    expect(screen.getByText('Search...')).toBeInTheDocument();
  });

  it('should render FiltersText', () => {
    render(<FiltersText />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render ClearAllText', () => {
    render(<ClearAllText />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });
});

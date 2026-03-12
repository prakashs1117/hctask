import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFoundState } from '../../../components/molecules/not-found-state';

// next/link is already mocked in jest.setup.js

describe('NotFoundState', () => {
  it('should render entity not found message', () => {
    render(
      <NotFoundState entity="Program" backUrl="/programs" backLabel="Back to Programs" />
    );
    expect(screen.getByText('Program not found')).toBeInTheDocument();
  });

  it('should render back link with correct URL', () => {
    render(
      <NotFoundState entity="Program" backUrl="/programs" backLabel="Back to Programs" />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/programs');
  });

  it('should render back button label', () => {
    render(
      <NotFoundState entity="Program" backUrl="/programs" backLabel="Back to Programs" />
    );
    expect(screen.getByText('Back to Programs')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <NotFoundState entity="User" backUrl="/users" backLabel="Back" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

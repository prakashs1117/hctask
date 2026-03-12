import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../../../components/organisms/page-header';
import { Activity } from 'lucide-react';

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<PageHeader title="Programs" description="Manage your programs" />);
    expect(screen.getByText('Manage your programs')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<PageHeader title="Programs" />);
    expect(screen.queryByText('Manage your programs')).not.toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const { container } = render(<PageHeader title="Test" icon={Activity} />);
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('should render action when provided', () => {
    render(<PageHeader title="Test" action={<button>Add</button>} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PageHeader title="Test" className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});

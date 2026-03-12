import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../../../components/molecules/stat-card';
import { Activity } from 'lucide-react';

describe('StatCard', () => {
  it('should render title and value', () => {
    render(<StatCard title="Total Programs" value={42} icon={Activity} />);
    expect(screen.getByText('Total Programs')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render string value', () => {
    render(<StatCard title="Status" value="Active" icon={Activity} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<StatCard title="Programs" value={10} icon={Activity} description="Active programs" />);
    expect(screen.getByText('Active programs')).toBeInTheDocument();
  });

  it('should render enhanced style with bgColor', () => {
    const { container } = render(
      <StatCard title="Programs" value={10} icon={Activity} bgColor="bg-blue-100" />
    );
    expect(container.querySelector('.bg-blue-100')).toBeInTheDocument();
  });

  it('should render basic style without bgColor', () => {
    render(<StatCard title="Programs" value={10} icon={Activity} />);
    expect(screen.getByText('Programs')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});

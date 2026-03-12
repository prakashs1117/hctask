import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../../../components/molecules/metric-card';
import { Users } from 'lucide-react';

describe('MetricCard', () => {
  it('should render label and value', () => {
    render(<MetricCard icon={Users} label="Total Studies" value={5} theme="studies" />);
    expect(screen.getByText('Total Studies')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render string value', () => {
    render(<MetricCard icon={Users} label="Enrollment" value="25%" theme="progress" />);
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard icon={Users} label="Test" value={0} theme="enrolled" className="extra-class" />
    );
    expect(container.querySelector('.extra-class')).toBeInTheDocument();
  });

  it('should render all theme variants', () => {
    const themes = ['studies', 'enrolled', 'target', 'progress'] as const;
    themes.forEach(theme => {
      const { unmount } = render(
        <MetricCard icon={Users} label={`${theme} label`} value={0} theme={theme} />
      );
      expect(screen.getByText(`${theme} label`)).toBeInTheDocument();
      unmount();
    });
  });
});

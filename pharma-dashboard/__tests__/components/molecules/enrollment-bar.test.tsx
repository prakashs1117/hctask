import React from 'react';
import { render, screen } from '@testing-library/react';
import { EnrollmentBar } from '../../../components/molecules/enrollment-bar';

describe('EnrollmentBar', () => {
  it('should render enrollment numbers with label', () => {
    render(<EnrollmentBar current={50} target={100} />);
    expect(screen.getByText(/50 \/ 100 enrolled/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('should hide label when showLabel is false', () => {
    render(<EnrollmentBar current={50} target={100} showLabel={false} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('should handle zero target', () => {
    render(<EnrollmentBar current={0} target={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <EnrollmentBar current={50} target={100} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show green color for 90%+ enrollment', () => {
    const { container } = render(<EnrollmentBar current={95} target={100} />);
    const progressBar = container.querySelector('[style]');
    expect(progressBar).toHaveClass('bg-green-500');
  });

  it('should show amber color for 50-74% enrollment', () => {
    const { container } = render(<EnrollmentBar current={60} target={100} />);
    const progressBar = container.querySelector('[style]');
    expect(progressBar).toHaveClass('bg-amber-500');
  });

  it('should show red color for <50% enrollment', () => {
    const { container } = render(<EnrollmentBar current={20} target={100} />);
    const progressBar = container.querySelector('[style]');
    expect(progressBar).toHaveClass('bg-red-500');
  });
});

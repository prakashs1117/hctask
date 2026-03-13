import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateAlertDialog } from '../../../../components/organisms/alerts/create-alert-dialog';

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../../components/organisms/alerts/create-alert-form', () => ({
  CreateAlertForm: () => <div data-testid="alert-form">Alert Form</div>,
}));

describe('CreateAlertDialog', () => {
  it('should render create button when canCreate is true', () => {
    render(<CreateAlertDialog canCreate={true} />);
    expect(screen.getByText('Create Alert')).toBeInTheDocument();
  });

  it('should not render when canCreate is false', () => {
    const { container } = render(<CreateAlertDialog canCreate={false} />);
    expect(container.innerHTML).toBe('');
  });
});

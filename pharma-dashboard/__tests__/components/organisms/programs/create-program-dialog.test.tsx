import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateProgramDialog } from '../../../../components/organisms/programs/create-program-dialog';

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../../components/organisms/programs/create-program-form', () => ({
  CreateProgramForm: () => <div data-testid="create-form">Form</div>,
}));

describe('CreateProgramDialog', () => {
  it('should render create button when canCreate is true', () => {
    render(<CreateProgramDialog canCreate={true} />);
    expect(screen.getByText('Create Program')).toBeInTheDocument();
  });

  it('should not render when canCreate is false', () => {
    const { container } = render(<CreateProgramDialog canCreate={false} />);
    expect(container.innerHTML).toBe('');
  });
});

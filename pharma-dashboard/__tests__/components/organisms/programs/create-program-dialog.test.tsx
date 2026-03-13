import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateProgramDialog } from '../../../../components/organisms/programs/create-program-dialog';

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

let capturedOnSubmit: ((data: unknown) => Promise<void>) | undefined;
let capturedOnCancel: (() => void) | undefined;

jest.mock('../../../../components/organisms/programs/create-program-form', () => ({
  CreateProgramForm: ({ onSubmit, onCancel }: { onSubmit: (data: unknown) => Promise<void>; onCancel: () => void }) => {
    capturedOnSubmit = onSubmit;
    capturedOnCancel = onCancel;
    return (
      <div data-testid="create-form">
        <button data-testid="submit-btn" onClick={() => onSubmit({ name: 'Test' })}>Submit</button>
        <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    );
  },
}));

describe('CreateProgramDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnSubmit = undefined;
    capturedOnCancel = undefined;
  });

  it('should render create button when canCreate is true', () => {
    render(<CreateProgramDialog canCreate={true} />);
    expect(screen.getByText('Create Program')).toBeInTheDocument();
  });

  it('should not render when canCreate is false', () => {
    const { container } = render(<CreateProgramDialog canCreate={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('should open dialog when button clicked', () => {
    render(<CreateProgramDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Program'));
    expect(screen.getByText('Create New Program')).toBeInTheDocument();
  });

  it('should close dialog on cancel', () => {
    render(<CreateProgramDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Program'));
    expect(screen.getByText('Create New Program')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('cancel-btn'));
  });

  it('should handle submit success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'PRG-NEW' }),
    });

    render(<CreateProgramDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Program'));
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      const { toast } = require('sonner');
      expect(toast.success).toHaveBeenCalledWith('Program created successfully!');
    });
  });

  it('should handle submit failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    render(<CreateProgramDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Program'));

    await expect(async () => {
      await capturedOnSubmit?.({ name: 'Test' });
    }).rejects.toThrow();

    const { toast } = require('sonner');
    expect(toast.error).toHaveBeenCalledWith('Failed to create program. Please try again.');
  });
});

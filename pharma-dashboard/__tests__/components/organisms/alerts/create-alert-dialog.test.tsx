import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateAlertDialog } from '../../../../components/organisms/alerts/create-alert-dialog';

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn().mockReturnValue({
    invalidateQueries: jest.fn(),
  }),
}));

jest.mock('../../../../lib/hooks/usePrograms', () => ({
  usePrograms: () => ({ data: [], isLoading: false }),
}));

let capturedOnSubmit: ((data: unknown) => Promise<void>) | undefined;
let capturedOnCancel: (() => void) | undefined;

jest.mock('../../../../components/organisms/alerts/create-alert-form', () => ({
  CreateAlertForm: ({ onSubmit, onCancel }: { onSubmit: (data: unknown) => Promise<void>; onCancel: () => void }) => {
    capturedOnSubmit = onSubmit;
    capturedOnCancel = onCancel;
    return (
      <div data-testid="alert-form">
        <button data-testid="submit-btn" onClick={() => onSubmit({ program: 'Test' })}>Submit</button>
        <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    );
  },
}));

describe('CreateAlertDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnSubmit = undefined;
    capturedOnCancel = undefined;
  });

  it('should render create button when canCreate is true', () => {
    render(<CreateAlertDialog canCreate={true} />);
    expect(screen.getByText('Create Alert')).toBeInTheDocument();
  });

  it('should not render when canCreate is false', () => {
    const { container } = render(<CreateAlertDialog canCreate={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('should open dialog when button clicked', () => {
    render(<CreateAlertDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Alert'));
    expect(screen.getByText('Create New Alert')).toBeInTheDocument();
  });

  it('should close dialog on cancel', () => {
    render(<CreateAlertDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Alert'));
    fireEvent.click(screen.getByTestId('cancel-btn'));
  });

  it('should handle submit success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'ALT-NEW' }),
    });

    render(<CreateAlertDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Alert'));
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      const { toast } = require('sonner');
      expect(toast.success).toHaveBeenCalledWith('Alert created successfully!');
    });
  });

  it('should handle submit failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    render(<CreateAlertDialog canCreate={true} />);
    fireEvent.click(screen.getByText('Create Alert'));

    await expect(async () => {
      await capturedOnSubmit?.({ program: 'Test' });
    }).rejects.toThrow();

    const { toast } = require('sonner');
    expect(toast.error).toHaveBeenCalledWith('Failed to create alert. Please try again.');
  });
});

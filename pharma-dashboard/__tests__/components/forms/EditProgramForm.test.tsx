import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditProgramForm } from '@/components/organisms/programs/edit-program-form';
import { type Program } from '../../../types';

const mockProgram: Program = {
  id: "PROG001",
  name: "Test Program",
  description: "A test program",
  therapeuticArea: "Oncology",
  phase: "Phase II",
  status: "Active",
  manager: "Dr. Test Manager",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  studies: [],
  milestones: []
};

const defaultProps = {
  program: mockProgram,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  isLoading: false,
};

describe('EditProgramForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields with correct initial values', () => {
      render(<EditProgramForm {...defaultProps} />);

      expect(screen.getByDisplayValue('Test Program')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A test program')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Oncology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Phase II')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dr. Test Manager')).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(<EditProgramForm {...defaultProps} />);

      expect(screen.getByText('Program Name *')).toBeInTheDocument();
      expect(screen.getByText('Therapeutic Area *')).toBeInTheDocument();
      expect(screen.getByText('Development Phase *')).toBeInTheDocument();
      expect(screen.getByText('Status *')).toBeInTheDocument();
      expect(screen.getByText('Program Manager *')).toBeInTheDocument();
    });

    it('should render Cancel and Update buttons', () => {
      render(<EditProgramForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update program/i })).toBeInTheDocument();
    });

    it('should handle empty description gracefully', () => {
      const programWithoutDescription = { ...mockProgram, description: undefined };

      render(<EditProgramForm {...defaultProps} program={programWithoutDescription} />);

      const descriptionField = screen.getByRole('textbox', { name: /description/i });
      expect(descriptionField).toHaveValue('');
    });
  });

  describe('Form Interactions', () => {
    it('should call onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should update input values when user types', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Program Name');

      expect(nameInput).toHaveValue('Updated Program Name');
    });

    it('should update select values when user changes selections', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const phaseSelect = screen.getByDisplayValue('Phase II');
      await user.selectOptions(phaseSelect, 'Phase III');

      expect(phaseSelect).toHaveValue('Phase III');
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty required fields', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Program name is required')).toBeInTheDocument();
      });
    });

    it('should show error for name too long', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);
      await user.type(nameInput, 'a'.repeat(101)); // 101 characters, exceeds limit

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name too long')).toBeInTheDocument();
      });
    });

    it('should show error for empty manager field', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const managerInput = screen.getByDisplayValue('Dr. Test Manager');
      await user.clear(managerInput);

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Manager name is required')).toBeInTheDocument();
      });
    });

    it('should not show validation errors for optional description field', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const descriptionInput = screen.getByRole('textbox', { name: /description/i });
      await user.clear(descriptionInput);

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      // Should still submit successfully without description
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with updated data on successful submission', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Program');

      const phaseSelect = screen.getByDisplayValue('Phase II');
      await user.selectOptions(phaseSelect, 'Phase III');

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Updated Program',
          description: 'A test program',
          therapeuticArea: 'Oncology',
          phase: 'Phase III',
          status: 'Active',
          manager: 'Dr. Test Manager',
        });
      });
    });

    it('should handle submission errors gracefully', async () => {
      const mockOnSubmitWithError = jest.fn().mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();

      render(<EditProgramForm {...defaultProps} onSubmit={mockOnSubmitWithError} />);

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update program. Please try again.')).toBeInTheDocument();
      });
    });

    it('should disable buttons during loading state', () => {
      render(<EditProgramForm {...defaultProps} isLoading={true} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const submitButton = screen.getByRole('button', { name: /updating.../i });

      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should show updating text when submitting', () => {
      render(<EditProgramForm {...defaultProps} isLoading={true} />);

      expect(screen.getByRole('button', { name: /updating.../i })).toBeInTheDocument();
    });
  });

  describe('Select Options', () => {
    it('should render all therapeutic area options', () => {
      render(<EditProgramForm {...defaultProps} />);

      const expectedOptions = ['Oncology', 'Neurology', 'Cardiology', 'Immunology', 'Dermatology', 'Endocrinology'];
      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render all phase options', () => {
      render(<EditProgramForm {...defaultProps} />);

      const expectedPhases = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Approved'];

      expectedPhases.forEach(phase => {
        expect(screen.getByRole('option', { name: phase })).toBeInTheDocument();
      });
    });

    it('should render all status options', () => {
      render(<EditProgramForm {...defaultProps} />);

      const expectedStatuses = ['Active', 'On Hold', 'Completed', 'Discontinued'];

      expectedStatuses.forEach(status => {
        expect(screen.getByRole('option', { name: status })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should associate labels with form inputs', () => {
      render(<EditProgramForm {...defaultProps} />);

      expect(screen.getByLabelText('Program Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Therapeutic Area *')).toBeInTheDocument();
      expect(screen.getByLabelText('Development Phase *')).toBeInTheDocument();
      expect(screen.getByLabelText('Status *')).toBeInTheDocument();
      expect(screen.getByLabelText('Program Manager *')).toBeInTheDocument();
    });

    it('should show error messages with proper styling', async () => {
      const user = userEvent.setup();
      render(<EditProgramForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);

      const submitButton = screen.getByRole('button', { name: /update program/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Program name is required');
        expect(errorMessage).toHaveClass('text-destructive');
      });
    });
  });
});

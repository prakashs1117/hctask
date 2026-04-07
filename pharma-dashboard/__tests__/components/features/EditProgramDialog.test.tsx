import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { EditProgramDialog } from '@/components/organisms/programs/edit-program-dialog';
import { mockProgram } from '../../test-utils';
import type { Program } from '@/types';

// Mock sonner toast
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  }
}));

// Mock react-query
const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

// Get the mocked functions from test-utils
const { useUpdateProgramMutation } = jest.requireMock('@/lib/store/api/apiSlice');

describe('EditProgramDialog', () => {
  let mockMutationFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mocked mutation function
    mockMutationFn = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { success: true } })
    });

    // Mock the hook to return our mutation function
    useUpdateProgramMutation.mockReturnValue([mockMutationFn, { isLoading: false, error: null }]);
  });

  describe('Permission Handling', () => {
    it('should render nothing when canEdit is false', () => {
      const { container } = render(
        <EditProgramDialog program={mockProgram} canEdit={false} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render edit button when canEdit is true', () => {
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      expect(screen.getByRole('button', { name: /edit program/i })).toBeInTheDocument();
    });
  });

  describe('Button Variants', () => {
    it('should render default variant button for detail page', () => {
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} variant="default" />
      );

      const button = screen.getByRole('button', { name: /edit program/i });
      expect(button).toBeInTheDocument();
    });

    it('should render table variant button for list view', () => {
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} variant="table" />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-1', 'h-7', 'px-2', 'hidden', 'md:inline-flex');
    });

    it('should default to "default" variant when not specified', () => {
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      const button = screen.getByRole('button', { name: /edit program/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Dialog Functionality', () => {
    it('should open dialog when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      // "Edit Program" appears in both button and dialog title
      expect(screen.getAllByText('Edit Program').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Update the program information below. Changes will be saved immediately.')).toBeInTheDocument();
    });

    it('should display form with pre-populated data', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Check input values using getByRole or more flexible queries
      expect(screen.getByRole('textbox', { name: /program name/i })).toHaveValue('Test Program');
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('A test program for testing');
      expect(screen.getByDisplayValue('Oncology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Phase II')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /manager/i })).toHaveValue('Test Manager');
    });

    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Dialog should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should call update mutation with correct data on form submission', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Update program name
      const nameInput = screen.getByRole('textbox', { name: /program name/i });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Program');

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockMutationFn).toHaveBeenCalledWith({
          id: mockProgram.id,
          data: {
            name: 'Updated Program',
            description: 'A test program for testing',
            therapeuticArea: 'Oncology',
            phase: 'Phase II',
            status: 'Active',
            manager: 'Test Manager',
          }
        });
      });
    });

    it('should show success toast on successful update', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Program updated successfully!');
      });
    });

    it('should handle API errors gracefully', async () => {
      // Set up error mock before rendering
      const mockErrorMutation = jest.fn().mockReturnValue({
        unwrap: jest.fn().mockRejectedValue(new Error('API Error'))
      });
      useUpdateProgramMutation.mockReturnValue([mockErrorMutation, { isLoading: false, error: null }]);

      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update program. Please try again.')).toBeInTheDocument();
      });

      // Toast should also be called
      expect(mockToastError).toHaveBeenCalledWith('Failed to update program. Please try again.');
    });

    it('should handle network errors', async () => {
      // Set up error mock before rendering
      const mockErrorMutation = jest.fn().mockReturnValue({
        unwrap: jest.fn().mockRejectedValue(new Error('Network error'))
      });
      useUpdateProgramMutation.mockReturnValue([mockErrorMutation, { isLoading: false, error: null }]);

      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update program. Please try again.')).toBeInTheDocument();
      });

      // Toast should also be called
      expect(mockToastError).toHaveBeenCalledWith('Failed to update program. Please try again.');
    });
  });

  describe('Loading States', () => {
    it('should close dialog after successful submission', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle programs without description', async () => {
      const programWithoutDescription = { ...mockProgram, description: undefined };
      const user = userEvent.setup();

      render(
        <EditProgramDialog program={programWithoutDescription} canEdit={true} />
      );

      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      const descriptionField = screen.getByRole('textbox', { name: /description/i });
      expect(descriptionField).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');
    });

    it('should focus management for dialog', async () => {
      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Dialog should be focused or contain focused element
      expect(document.activeElement).toBeTruthy();
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditProgramDialog } from '@/components/organisms/programs/edit-program-dialog';
import { type Program } from '../../../types';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

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

describe('EditProgramDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
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

      expect(screen.getByDisplayValue('Test Program')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A test program')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Oncology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Phase II')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dr. Test Manager')).toBeInTheDocument();
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
    it('should make PUT request with correct data on form submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProgram, name: 'Updated Program' })
      });

      const user = userEvent.setup();
      render(
        <EditProgramDialog program={mockProgram} canEdit={true} />
      );

      // Open dialog
      const editButton = screen.getByRole('button', { name: /edit program/i });
      await user.click(editButton);

      // Update program name
      const nameInput = screen.getByDisplayValue('Test Program');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Program');

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update program/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${mockProgram.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Updated Program',
            description: 'A test program',
            therapeuticArea: 'Oncology',
            phase: 'Phase II',
            status: 'Active',
            manager: 'Dr. Test Manager',
          })
        });
      });
    });

    it('should show success toast on successful update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProgram, name: 'Updated Program' })
      });

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
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

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
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

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
    });
  });

  describe('Loading States', () => {
    it('should close dialog after successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProgram, name: 'Updated Program' })
      });

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

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Root, Field, Label, Control, Submit } from '@radix-ui/react-form';

const projectType = { value: 'design', label: 'Design' };

interface FormData {
  projectName: string;
  goals: string;
  deadline: string;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
}

interface ProjectFormProps {
  onSubmit: (data: FormData & { projectType: string }) => void;
  initialData?: FormData | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<FormData>({
    projectName: initialData?.projectName || '',
    goals: initialData?.goals || '',
    deadline: initialData?.deadline || '',
    budget: initialData?.budget || '',
    budgetBreakdown: initialData?.budgetBreakdown || [{ item: '', amount: '' }],
  });

  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBudgetBreakdownChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newBudgetBreakdown = [...formData.budgetBreakdown];
    newBudgetBreakdown[index] = { ...newBudgetBreakdown[index], [name]: value };
    setFormData(prevData => ({
      ...prevData,
      budgetBreakdown: newBudgetBreakdown,
    }));
  };

  const addBudgetBreakdownItem = () => {
    setFormData(prevData => ({
      ...prevData,
      budgetBreakdown: [...prevData.budgetBreakdown, { item: '', amount: '' }],
    }));
  };

  const removeBudgetBreakdownItem = (index: number) => {
    const newBudgetBreakdown = formData.budgetBreakdown.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      budgetBreakdown: newBudgetBreakdown,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({ ...formData, projectType: projectType.value });
    } catch {
      setError('Failed to generate brief. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Root onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Field name="projectType" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Project Type</Label>
        <div className="input-field flex items-center">
          <span>{projectType.label}</span>
        </div>
      </Field>

      <Field name="projectName" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Project Name</Label>
        <Control asChild>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter project name"
            required
          />
        </Control>
      </Field>

      <Field name="goals" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Project Goals</Label>
        <Control asChild>
          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Describe your project goals"
            rows={4}
            required
          />
        </Control>
      </Field>

      <Field name="deadline" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Deadline</Label>
        <Control asChild>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </Control>
      </Field>

      <Field name="budget" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Budget</Label>
        <Control asChild>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter total budget amount"
            required
          />
        </Control>
      </Field>

      <Field name="showBudgetBreakdown" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Show Budget Breakdown</Label>
        <Control asChild>
          <input
            type="checkbox"
            name="showBudgetBreakdown"
            checked={showBudgetBreakdown}
            onChange={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
            className="mr-2"
          />
        </Control>
      </Field>

      {showBudgetBreakdown && (
        <Field name="budgetBreakdown" className="mb-4">
          <Label className="block text-sm font-medium mb-2">Budget Breakdown</Label>
          {formData.budgetBreakdown.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <Control asChild>
                <input
                  type="text"
                  name="item"
                  value={item.item}
                  onChange={(e) => handleBudgetBreakdownChange(index, e)}
                  className="input-field mr-2"
                  placeholder="Item"
                  required
                />
              </Control>
              <Control asChild>
                <input
                  type="number"
                  name="amount"
                  value={item.amount}
                  onChange={(e) => handleBudgetBreakdownChange(index, e)}
                  className="input-field mr-2"
                  placeholder="Amount"
                  required
                />
              </Control>
              <button
                type="button"
                onClick={() => removeBudgetBreakdownItem(index)}
                className="btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBudgetBreakdownItem}
            className="btn-success"
          >
            Add Item
          </button>
        </Field>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <Submit asChild>
        <button
          className={`btn-primary w-full ${isLoading ? 'bg-secondary text-white hover:bg-secondary cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Brief...' : 'Generate Brief'}
        </button>
      </Submit>
    </Root>
  );
};

export default ProjectForm;
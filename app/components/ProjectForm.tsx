import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, Image as ImageIcon, X } from 'lucide-react';
import { uploadImage } from '@/utils/imageUpload';

const projectType = { value: 'design', label: 'Design' };

interface FormData {
  projectName: string;
  goals: string;
  deadline: string;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
  references: { type: 'link' | 'image'; value: string }[];
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
    references: initialData?.references || [],
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

  const handleAddReference = (type: 'link' | 'image') => {
    setFormData(prevData => ({
      ...prevData,
      references: [...prevData.references, { type, value: '' }],
    }));
  };

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...formData.references];
    newReferences[index].value = value;
    setFormData(prevData => ({
      ...prevData,
      references: newReferences,
    }));
  };

  const handleRemoveReference = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      references: prevData.references.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      console.log('Uploading image:', file.name);
      const imageUrl = await uploadImage(file);
      console.log('Image uploaded successfully:', imageUrl);
      handleReferenceChange(index, imageUrl);
      
      // Update the UI to show the uploaded image
      const updatedReferences = [...formData.references];
      updatedReferences[index] = { type: 'image', value: imageUrl };
      setFormData(prevData => ({
        ...prevData,
        references: updatedReferences,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Type</label>
        <div className="input-field flex items-center">
          <span>{projectType.label}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Goals</label>
        <textarea
          name="goals"
          value={formData.goals}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Describe your project goals"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleInputChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Budget</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter total budget amount"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          <input
            type="checkbox"
            name="showBudgetBreakdown"
            checked={showBudgetBreakdown}
            onChange={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
            className="mr-2"
          />
          Show Budget Breakdown
        </label>
      </div>

      {showBudgetBreakdown && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Budget Breakdown</label>
          {formData.budgetBreakdown.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name="item"
                value={item.item}
                onChange={(e) => handleBudgetBreakdownChange(index, e)}
                className="input-field mr-2"
                placeholder="Item"
                required
              />
              <input
                type="number"
                name="amount"
                value={item.amount}
                onChange={(e) => handleBudgetBreakdownChange(index, e)}
                className="input-field mr-2"
                placeholder="Amount"
                required
              />
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
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">References</label>
        {formData.references.map((ref, index) => (
          <div key={index} className="flex items-center mb-2">
            {ref.type === 'link' ? (
              <input
                type="text"
                value={ref.value}
                onChange={(e) => handleReferenceChange(index, e.target.value)}
                className="input-field flex-grow"
                placeholder="Enter link URL"
              />
            ) : (
              <div className="flex items-center">
                {ref.value ? (
                  <>
                    <span className="mr-2">Image uploaded</span>
                    <a
                      href={ref.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </a>
                  </>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(index, file);
                      }
                    }}
                    className="input-field flex-grow"
                  />
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemoveReference(index)}
              className="btn-danger ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleAddReference('link')}
            className="btn-secondary flex items-center"
          >
            <Link className="w-4 h-4 mr-2" />
            Add Link
          </button>
          <button
            type="button"
            onClick={() => handleAddReference('image')}
            className="btn-secondary flex items-center"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add Image
          </button>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className={`btn-primary w-full ${isLoading ? 'bg-secondary text-white hover:bg-secondary cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Generating Brief...' : 'Generate Brief'}
      </button>
    </form>
  );
};

export default ProjectForm;
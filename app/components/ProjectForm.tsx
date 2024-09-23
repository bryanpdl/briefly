import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Root, Field, Label, Control, Submit } from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';

const projectTypes = [
  { value: 'design', label: 'Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'business', label: 'Business' },
  { value: 'healthcare', label: 'Healthcare' },
];

interface FormData {
  projectName: string;
  goals: string;
  deadline: string;
  budget: string;
}

interface ProjectFormProps {
  onSubmit: (data: FormData & { projectType: string }) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit }) => {
  const [projectType, setProjectType] = useState('');
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    goals: '',
    deadline: '',
    budget: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ ...formData, projectType });
  };

  return (
    <Root onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Field name="projectType" className="mb-4">
        <Label className="block text-sm font-medium mb-2">Project Type</Label>
        <Select.Root value={projectType} onValueChange={setProjectType}>
          <Select.Trigger className="input-field">
            <Select.Value placeholder="Select a project type" />
          </Select.Trigger>
          <Select.Content className="bg-white shadow-lg rounded-lg overflow-hidden">
            <Select.Viewport>
              {projectTypes.map((type) => (
                <Select.Item key={type.value} value={type.value} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {type.label}
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
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
            placeholder="Enter budget amount"
          />
        </Control>
      </Field>

      <Submit asChild>
        <button className="btn-primary w-full">
          Generate Brief
        </button>
      </Submit>
    </Root>
  );
};

export default ProjectForm;
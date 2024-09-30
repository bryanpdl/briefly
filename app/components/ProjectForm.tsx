import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uploadImage } from '../../utils/imageUpload';
import LoadingAnimation from './LoadingAnimation';

interface ProjectFormData {
  projectType: string;
  projectName: string;
  goals: string;
  deadline: Date | null;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
  references: { type: 'link' | 'image'; value: string }[];
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: ProjectFormData | null;
  onCancelEdit?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData, onCancelEdit }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>({
    projectType: initialData?.projectType || 'Web App',
    projectName: initialData?.projectName || '',
    goals: initialData?.goals || '',
    deadline: initialData?.deadline || null,
    budget: initialData?.budget || '',
    budgetBreakdown: initialData?.budgetBreakdown || [{ item: '', amount: '' }],
    references: initialData?.references || [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const questions = [
    { key: 'projectType', question: "What's your type of project?", emoji: '📂' },
    { key: 'projectName', question: "What's the name of your project?", emoji: '📝' },
    { key: 'goals', question: "What are the main goals of your project?", emoji: '🎯' },
    { key: 'deadline', question: "When do you need this project completed?", emoji: '⏳' },
    { key: 'budget', question: "What's your budget for this project?", emoji: '💰' },
    { key: 'budgetBreakdown', question: "Let's break down your budget:", emoji: '💰' },
    { key: 'references', question: "Do you have any references or inspirations?", emoji: '🔗' },
  ];

  useEffect(() => {
    const newProgress = ((step + 1) / questions.length) * 100;
    setProgress(newProgress);

    // Save form progress to localStorage
    localStorage.setItem('formProgress', JSON.stringify({ step, formData }));
  }, [step, formData, questions.length]);

  useEffect(() => {
    // Load form progress from localStorage on component mount
    const savedProgress = localStorage.getItem('formProgress');
    if (savedProgress) {
      const { step: savedStep, formData: savedFormData } = JSON.parse(savedProgress);
      setStep(savedStep);
      setFormData((prevData) => ({
        ...prevData,
        ...savedFormData,
        deadline: savedFormData.deadline ? new Date(savedFormData.deadline) : null,
      }));
    }
  }, []);

  const formatNumber = (value: string) => {
    // Remove non-numeric characters except for the decimal point
    value = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      parts.pop();
      value = parts.join('.');
    }
    
    // Format with commas for thousands
    const formatted = Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return formatted === '0' ? '' : formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'budget') {
      setFormData(prev => ({ ...prev, [name]: formatNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, deadline: date }));
  };

  const handleBudgetBreakdownChange = (index: number, field: 'item' | 'amount', value: string) => {
    const newBudgetBreakdown = [...formData.budgetBreakdown];
    if (field === 'amount') {
      newBudgetBreakdown[index][field] = formatNumber(value);
    } else {
      newBudgetBreakdown[index][field] = value;
    }
    setFormData(prev => ({ ...prev, budgetBreakdown: newBudgetBreakdown }));
  };

  const removeBudgetItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      budgetBreakdown: prev.budgetBreakdown.filter((_, i) => i !== index),
    }));
  };

  const addBudgetItem = () => {
    setFormData(prev => ({
      ...prev,
      budgetBreakdown: [...prev.budgetBreakdown, { item: '', amount: '' }],
    }));
  };

  const handleReferenceChange = (index: number, field: 'type' | 'value', value: string) => {
    const newReferences = [...formData.references];
    newReferences[index][field] = value as 'link' | 'image';
    setFormData(prev => ({ ...prev, references: newReferences }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { type: 'link', value: '' }],
    }));
  };

  const handleImageUpload = async (index: number) => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0];
      try {
        const imageUrl = await uploadImage(file);
        handleReferenceChange(index, 'value', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Must be authenticated to upload images.');
      }
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      // Clear form progress from localStorage after successful submission
      localStorage.removeItem('formProgress');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[step];

  const renderInput = (key: keyof ProjectFormData) => {
    switch (key) {
      case 'projectType':
        return (
          <select
            name={key}
            value={formData[key] as string}
            onChange={handleInputChange}
            className="w-full p-2 border rounded min-h-[48px]"
          >
            <option value="Web App">Web App</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Branding & Logo">Branding & Logo</option>
            <option value="Illustration">Illustration</option>
            <option value="3D Design">3D Design</option>
          </select>
        );
      case 'projectName':
        return (
          <input
            type="text"
            name={key}
            value={formData[key] as string}
            onChange={handleInputChange}
            className="w-full p-2 border rounded min-h-[48px]"
          />
        );
      case 'goals':
        return (
          <textarea
            name={key}
            value={formData[key] as string}
            onChange={handleInputChange}
            className="w-full p-2 border rounded min-h-[120px]"
          />
        );
      case 'deadline':
        return (
          <DatePicker
            selected={formData.deadline}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
          />
        );
      case 'budget':
        return (
          <input
            type="text"
            name={key}
            value={formData[key] as string}
            onChange={handleInputChange}
            inputMode="decimal"
            className="w-full p-2 border rounded min-h-[48px]"
          />
        );
      case 'budgetBreakdown':
        return (
          <div>
            {formData.budgetBreakdown.map((item, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => handleBudgetBreakdownChange(index, 'item', e.target.value)}
                  placeholder="Item"
                  className="w-1/3 p-2 border rounded mr-2"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => handleBudgetBreakdownChange(index, 'amount', e.target.value)}
                  placeholder="Amount"
                  inputMode="decimal"
                  className="w-1/3 p-2 border rounded mr-2"
                />
                <button
                  onClick={() => removeBudgetItem(index)}
                  className="w-1/3 btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addBudgetItem} className="btn-secondary mt-2">Add Budget Item</button>
          </div>
        );
      case 'references':
        return (
          <div>
            {formData.references.map((ref, index) => (
              <div key={index} className="flex mb-2">
                <select
                  value={ref.type}
                  onChange={(e) => handleReferenceChange(index, 'type', e.target.value)}
                  className="w-1/4 p-2 border rounded mr-2"
                >
                  <option value="link">Link</option>
                  <option value="image">Image</option>
                </select>
                {ref.type === 'link' ? (
                  <input
                    type="text"
                    value={ref.value}
                    onChange={(e) => handleReferenceChange(index, 'value', e.target.value)}
                    placeholder="Enter URL"
                    className="w-1/2 p-2 border rounded mr-2"
                  />
                ) : (
                  <div className="w-1/2 flex mr-2">
                    <input
                      type="text"
                      value={ref.value}
                      onChange={(e) => handleReferenceChange(index, 'value', e.target.value)}
                      placeholder="Enter image URL or upload"
                      className="w-2/3 p-2 border rounded mr-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={() => handleImageUpload(index)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-1/3 btn-secondary"
                    >
                      Upload
                    </button>
                  </div>
                )}
                <button
                  onClick={() => removeReference(index)}
                  className="w-1/4 btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addReference} className="btn-secondary mt-2">Add Reference</button>
          </div>
        );
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="max-w-[672px] mx-auto mt-10">
      {isLoading && <LoadingAnimation />}
      <div className="text-left mb-4">
        <span className="text-6xl">{currentQuestion.emoji}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="mt-4 p-6 bg-[#FAFAFA] rounded-lg outline outline-1 outline-[#EBE0E3] shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
          {renderInput(currentQuestion.key as keyof ProjectFormData)}
          <div className="mt-4 flex justify-between">
            {step > 0 && (
              <button onClick={handlePrevious} className="btn-primary">
                Previous
              </button>
            )}
            <button 
              onClick={step === questions.length - 1 ? handleSubmit : handleNext} 
              className="btn-primary"
              disabled={isLoading}
            >
              {step === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="bg-[#35AF89] h-2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      {onCancelEdit && (
        <div className="mt-8">
          <button onClick={onCancelEdit} className="btn-inverted">
            Cancel Form Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
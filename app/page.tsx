'use client';

import React, { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectBrief from './components/ProjectBrief';
import { generateBrief } from '../utils/gptApi'; // You'll need to create this file

interface ProjectFormData {
  projectType: string;
  projectName: string;
  goals: string;
  deadline: string;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
}

export default function Home() {
  const [brief, setBrief] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormSubmit = async (data: ProjectFormData) => {
    if (!isClient) return;
    try {
      const generatedBrief = await generateBrief(data);
      setBrief(generatedBrief);
      setFormData(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating brief:', error);
    }
  };

  const handleEditBrief = () => {
    setShowForm(true);
  };

  const handleCreateNewBrief = () => {
    setFormData(null);
    setShowForm(true);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center">Project Brief Generator</h1>
      {showForm ? (
        <ProjectForm onSubmit={handleFormSubmit} initialData={formData} />
      ) : (
        <ProjectBrief brief={brief} onEdit={handleEditBrief} onCreateNew={handleCreateNewBrief} />
      )}
    </div>
  );
}

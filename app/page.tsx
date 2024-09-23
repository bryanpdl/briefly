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
}

export default function Home() {
  const [brief, setBrief] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormSubmit = async (formData: ProjectFormData) => {
    if (!isClient) return;
    try {
      const generatedBrief = await generateBrief(formData);
      setBrief(generatedBrief);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating brief:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleEditBrief = () => {
    setShowForm(true);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center">Project Brief Generator</h1>
      {showForm ? (
        <ProjectForm onSubmit={handleFormSubmit} />
      ) : (
        <ProjectBrief brief={brief} onEdit={handleEditBrief} />
      )}
    </div>
  );
}

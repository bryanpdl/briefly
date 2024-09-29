'use client';

import React, { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectBrief from './components/ProjectBrief';
import { generateBrief } from '../utils/gptApi';
import { signInWithGoogle, signOut, checkUserSubscription } from '../utils/auth';
import { User } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import LinkModal from './components/LinkModal';
import Image from 'next/image';
import { format } from 'date-fns'; // Add this import

interface ProjectFormData {
  projectType: string;
  projectName: string;
  goals: string;
  deadline: Date | null; // Change this to match ProjectForm.tsx
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
  references: { type: 'link' | 'image'; value: string }[];
}

export default function Home() {
  const [brief, setBrief] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  // Remove the unused isLoading state
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const isSubscribed = await checkUserSubscription(user.uid);
        setIsPaidUser(isSubscribed);
      } else {
        setIsPaidUser(false);
      }
    });

    // Load persisted state from localStorage
    const persistedBrief = localStorage.getItem('persistedBrief');
    const persistedFormData = localStorage.getItem('persistedFormData');
    const persistedShowForm = localStorage.getItem('persistedShowForm');
    const persistedFormProgress = localStorage.getItem('formProgress');

    if (persistedBrief) setBrief(persistedBrief);
    if (persistedFormData) {
      const parsedData = JSON.parse(persistedFormData);
      setFormData({
        ...parsedData,
        deadline: parsedData.deadline ? new Date(parsedData.deadline) : null,
      });
    }
    if (persistedShowForm) setShowForm(persistedShowForm === 'true');
    if (persistedFormProgress) {
      const { formData: savedFormData } = JSON.parse(persistedFormProgress);
      setFormData((prevData) => ({
        ...prevData,
        ...savedFormData,
        deadline: savedFormData.deadline ? new Date(savedFormData.deadline) : null,
      }));
      setShowForm(true);
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showLinkModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showLinkModal]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      const formattedData = {
        ...data,
        deadline: data.deadline ? format(data.deadline, 'yyyy-MM-dd') : null
      };
      const generatedBrief = await generateBrief(formattedData);
      setBrief(generatedBrief);
      setFormData(data);
      setShowForm(false);

      // Persist state to localStorage
      localStorage.setItem('persistedBrief', generatedBrief);
      localStorage.setItem('persistedFormData', JSON.stringify({
        ...data,
        deadline: data.deadline ? data.deadline.toISOString() : null,
      }));
      localStorage.setItem('persistedShowForm', 'false');
      localStorage.removeItem('formProgress');
    } catch (error) {
      console.error('Error generating brief:', error);
    }
  };

  const handleEditBrief = () => {
    setShowForm(true);
    // Update localStorage
    localStorage.setItem('persistedShowForm', 'true');
  };

  const handleCreateNewBrief = () => {
    setFormData(null);
    setShowForm(true);
    // Clear localStorage
    localStorage.removeItem('persistedBrief');
    localStorage.removeItem('persistedFormData');
    localStorage.setItem('persistedShowForm', 'true');
  };

  const handleSaveBrief = (updatedBrief: string) => {
    setBrief(updatedBrief);
    // Update localStorage
    localStorage.setItem('persistedBrief', updatedBrief);
    console.log('Brief updated successfully');
  };

  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const isSubscribed = await checkUserSubscription(user.uid);
      setIsPaidUser(isSubscribed);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsPaidUser(false);
  };

  const handleCreateLink = (link: string) => {
    setGeneratedLink(link);
    setShowLinkModal(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    // Update localStorage
    localStorage.setItem('persistedShowForm', 'false');
    // Clear form progress
    localStorage.removeItem('formProgress');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="flex items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl" role="img" aria-label="Grape">🍇</span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold ml-2">briefberry.</span>
            </h1>
            <div className="flex items-center mb-6">
              {user ? (
                <div className="flex items-center">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                  )}
                  <button onClick={handleSignOut} className="btn-secondary text-sm sm:text-base whitespace-nowrap">Sign Out</button>
                </div>
              ) : (
                <button onClick={handleSignIn} className="btn-secondary text-sm sm:text-base whitespace-nowrap">Sign In with Google</button>
              )}
            </div>
          </div>
          {showForm ? (
            <ProjectForm 
              onSubmit={handleFormSubmit} 
              initialData={formData} 
              onCancelEdit={formData ? handleCancelEdit : undefined}
            />
          ) : (
            <ProjectBrief 
              brief={brief} 
              projectName={formData?.projectName || ''} 
              projectType={formData?.projectType || ''} // Add this line
              onEdit={handleEditBrief} 
              onCreateNew={handleCreateNewBrief}
              onSave={handleSaveBrief}
              isPaidUser={isPaidUser}
              onCreateLink={handleCreateLink}
            />
          )}
        </div>
      </main>
      {showLinkModal && (
        <LinkModal
          link={generatedLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectBrief from './components/ProjectBrief';
import { generateBrief } from '../utils/gptApi';
import { signInWithGoogle, signOut, checkUserSubscription } from '../utils/auth';
import { User } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import LinkModal from './components/LinkModal';
import Image from 'next/image'; // Import Image from next/image

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
  const [user, setUser] = useState<User | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

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
    if (!isClient) return;
    try {
      const generatedBrief = await generateBrief(data);
      console.log("Full generated brief:", generatedBrief);
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

  const handleSaveBrief = (updatedBrief: string) => {
    setBrief(updatedBrief);
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

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 max-w-2xl mx-auto"> {/* Add max-w-2xl and mx-auto here */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-6xl font-bold">briefly.</h1>
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
                <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
              </div>
            ) : (
              <button onClick={handleSignIn} className="btn-secondary">Sign In with Google</button>
            )}
          </div>
          {showForm ? (
            <ProjectForm onSubmit={handleFormSubmit} initialData={formData} />
          ) : (
            <ProjectBrief 
              brief={brief} 
              projectName={formData?.projectName || ''} 
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
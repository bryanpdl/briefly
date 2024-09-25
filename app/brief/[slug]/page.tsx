'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getBriefData } from '@/utils/dataStore';

interface Section {
  title: string;
  content: string;
}

interface BriefData {
  projectName: string;
  content: string;
  isPaidUser: boolean;
}

const BriefPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    console.log('Slug:', slug);
    const fetchBriefData = async () => {
      if (slug) {
        const data = await getBriefData(slug);
        console.log('Fetched brief data:', data);
        if (data && data.content) {
          setBriefData(data);
          setSections(parseBriefIntoSections(data.content));
        } else {
          console.error('Invalid brief data received:', data);
        }
      }
    };
    fetchBriefData();
  }, [slug]);

  const parseBriefIntoSections = (text: string): Section[] => {
    if (!text) {
      console.error('Invalid text received for parsing');
      return [];
    }
    const lines = text.split('\n');
    const parsedSections: Section[] = [];
    let currentSection: Section = { title: '', content: '' };

    lines.forEach((line) => {
      if (line.match(/^[A-Z][a-z]+:$/)) {
        if (currentSection.title) {
          parsedSections.push({ ...currentSection });
        }
        currentSection = { title: line.trim(), content: '' };
      } else {
        currentSection.content += line + '\n';
      }
    });

    if (currentSection.title) {
      parsedSections.push(currentSection);
    }

    console.log('Parsed sections:', parsedSections); // Add this line for debugging
    return parsedSections;
  };

  if (!briefData) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container min-h-screen flex flex-col relative">
      {!briefData.isPaidUser && (
        <Link href="/" className="absolute top-4 left-4 text-sm text-gray-600 hover:text-gray-900">
          Powered by <span className="font-bold">briefly</span>.
        </Link>
      )}
      <div className="py-12">
        <h1 className="text-3xl font-bold mb-8">{briefData.projectName}</h1>
        <div className="brief-container">
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="brief-subheading">{section.title}</h2>
                <div className="brief-paragraph whitespace-pre-wrap">{section.content}</div>
              </div>
            ))
          ) : (
            <p>No content available for this brief.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefPage;
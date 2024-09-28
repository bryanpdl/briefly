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
  const slug = params?.slug as string;
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchBriefData = async () => {
      if (slug) {
        const data = await getBriefData(slug);
        if (data) {
          setBriefData(data);
          setSections(parseBriefIntoSections(data.content));
        }
      }
    };
    fetchBriefData();
  }, [slug]);

  const parseBriefIntoSections = (text: string): Section[] => {
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

    return parsedSections;
  };

  const renderContent = (content: string) => {
    console.log('Content to render:', content);
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp))/gi;
    
    const parts = content.split(linkRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 1) {
        // This is the link text
        return (
          <a
            key={`link-${index}`}
            href={parts[index + 1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {part}
          </a>
        );
      } else if (index % 3 === 0) {
        // This is regular text, but may contain image URLs
        return part.split(imageRegex).map((text, i) => {
          if (i % 2 === 1) {
            // This is an image URL
            return (
              <img
                key={`img-${index}-${i}`}
                src={text}
                alt="Reference"
                className="max-w-full h-auto my-2 rounded"
              />
            );
          }
          // This is regular text
          return <React.Fragment key={`text-${index}-${i}`}>{text}</React.Fragment>;
        });
      }
      return null;
    });
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
                <div className="brief-paragraph whitespace-pre-wrap">
                  {renderContent(section.content)}
                </div>
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
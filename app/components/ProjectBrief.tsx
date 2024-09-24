import React, { useState } from 'react';
import { useEffect } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { Edit, FilePlus, Mail, Save, ArrowLeft, RefreshCw } from 'lucide-react';
import { regenerateSection } from '@/utils/gptApi';

interface ProjectBriefProps {
  brief: string;
  projectName: string;
  onEdit: () => void;
  onCreateNew: () => void;
  onSave: (updatedBrief: string) => void;
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({ brief, projectName, onEdit, onCreateNew, onSave }) => {
  console.log("Received brief in ProjectBrief:", brief);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState(brief);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    console.log("Parsing brief into sections:", brief);
    const parsedSections = parseBriefIntoSections(brief);
    console.log("Parsed sections:", parsedSections);
    setSections(parsedSections);
  }, [brief]);

  const parseBriefIntoSections = (text: string) => {
    console.log("Parsing text:", text);
    const lines = text.split('\n');
    const parsedSections: { title: string; content: string }[] = [];
    let currentSection = { title: '', content: '' };

    lines.forEach((line, index) => {
      console.log(`Processing line ${index}:`, line);
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

    console.log("Parsed sections:", parsedSections);
    return parsedSections;
  };

  const handleShare = () => {
    const subject = encodeURIComponent('Project Brief');
    const body = encodeURIComponent(`Here is the project brief:\n\n${editedBrief}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(editedBrief);
    setIsEditing(false);
  };

  const handleBriefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedBrief(e.target.value);
  };

  const handleRegenerateSection = async (sectionTitle: string) => {
    setRegeneratingSection(sectionTitle);
    try {
      const regeneratedContent = await regenerateSection(editedBrief, sectionTitle);
      
      // Create a new array of sections, replacing the regenerated one
      const updatedSections = sections.map(section => 
        section.title === sectionTitle ? { title: sectionTitle, content: regeneratedContent } : section
      );
      
      // Reconstruct the brief from the updated sections
      const updatedBrief = updatedSections.map(section => `${section.title}\n${section.content.trim()}`).join('\n\n');
      
      setEditedBrief(updatedBrief);
      setSections(updatedSections);
      onSave(updatedBrief);
    } catch (error) {
      console.error(`Error regenerating ${sectionTitle} section:`, error);
      // You might want to show an error message to the user here
    } finally {
      setRegeneratingSection(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{projectName}</h2>
        <button onClick={onEdit} className="btn-secondary mt-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Form
        </button>
      </div>
      {isEditing ? (
        <textarea
          className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[300px] font-sans text-base leading-relaxed focus:ring-2 focus:ring-primary focus:border-transparent"
          value={editedBrief}
          onChange={handleBriefChange}
        />
      ) : (
        <div className="brief-container">
          {sections.map((section, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="brief-subheading">{section.title}</h3>
                <button
                  onClick={() => handleRegenerateSection(section.title)}
                  className="btn-regenerate"
                  disabled={regeneratingSection === section.title}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {regeneratingSection === section.title ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
              <div className="brief-paragraph whitespace-pre-wrap">{section.content}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {isEditing ? (
          <button onClick={handleSaveClick} className="btn-primary">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        ) : (
          <button onClick={handleEditClick} className="btn-primary">
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </button>
        )}
        <BlobProvider document={<PDFDocument brief={editedBrief} />}>
          {({ url, loading }) => (
            <a
              href={url || '#'}
              download="project_brief.pdf"
              className="btn-primary disabled:opacity-50"
              style={{ pointerEvents: loading ? 'none' : 'auto' }}
            >
              {loading ? 'Loading document...' : 'Download PDF'}
            </a>
          )}
        </BlobProvider>
        <button onClick={handleShare} className="btn-primary">
          <Mail className="w-5 h-5 mr-2" />
          Share
        </button>
        <button onClick={onCreateNew} className="btn-inverted">
          <FilePlus className="w-5 h-5 mr-2" />
          Create New Brief
        </button>
      </div>
    </div>
  );
};

export default ProjectBrief;
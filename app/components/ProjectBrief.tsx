import React, { useState } from 'react';
import { useEffect } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { Edit, FilePlus, Mail, Save, ArrowLeft, RefreshCw, Link } from 'lucide-react';
import { regenerateSection } from '@/utils/gptApi';
import { saveBriefData } from '@/utils/dataStore';
import LinkModal from './LinkModal';

interface ProjectBriefProps {
  brief: string;
  projectName: string;
  onEdit: () => void;
  onCreateNew: () => void;
  onSave: (updatedBrief: string) => void;
  isPaidUser: boolean;
  onCreateLink: (link: string) => void;
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({ brief, projectName, onEdit, onCreateNew, onSave, isPaidUser, onCreateLink }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState(brief);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const parsedSections = parseBriefIntoSections(brief);
    setSections(parsedSections);
  }, [brief]);

  const parseBriefIntoSections = (text: string) => {
    const lines = text.split('\n');
    const parsedSections: { title: string; content: string }[] = [];
    let currentSection = { title: '', content: '' };

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

  const handleRegenerateSection = async (sectionTitle: string) => {
    setRegeneratingSection(sectionTitle);
    try {
      const regeneratedContent = await regenerateSection(brief, sectionTitle);
      const updatedSections = sections.map(section =>
        section.title === sectionTitle ? { ...section, content: regeneratedContent } : section
      );
      setSections(updatedSections);
      const updatedBrief = updatedSections.map(section => `${section.title}\n${section.content}`).join('\n\n');
      setEditedBrief(updatedBrief);
      onSave(updatedBrief);
    } catch (error) {
      console.error('Error regenerating section:', error);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleCreateLink = async () => {
    const slug = Math.random().toString(36).substring(2, 15);
    const uniqueLink = `${window.location.origin}/brief/${slug}`;
    try {
      await saveBriefData(slug, projectName, editedBrief);
      onCreateLink(uniqueLink);
    } catch (error) {
      console.error('Error saving brief data:', error);
      alert('Failed to create link. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">{projectName}</h1>
      <button onClick={onEdit} className="btn-inverted">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Edit Form
        </button>
      <div className="brief-container">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {isPaidUser && (
                <button
                  onClick={() => handleRegenerateSection(section.title)}
                  className="btn-regenerate"
                  disabled={regeneratingSection === section.title}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {regeneratingSection === section.title ? 'Regenerating...' : 'Regenerate'}
                </button>
              )}
            </div>
            <div className="whitespace-pre-wrap">
              {isEditing ? (
                <textarea
                  value={section.content}
                  onChange={(e) => {
                    const updatedSections = [...sections];
                    updatedSections[index].content = e.target.value;
                    setSections(updatedSections);
                    setEditedBrief(updatedSections.map(s => `${s.title}\n${s.content}`).join('\n\n'));
                  }}
                  className="w-full h-40 p-2 border rounded"
                />
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
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
        
        <button onClick={handleCreateLink} className="btn-primary">
          <Link className="w-5 h-5 mr-2" />
          Create Link
        </button>
        {isPaidUser && (
          <>
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
          </>
        )}
      </div>
      
      <div className="mt-4">
        <button onClick={onCreateNew} className="btn-inverted">
          <FilePlus className="w-5 h-5 mr-2" />
          Create New Brief
        </button>
      </div>

      {showLinkModal && (
        <LinkModal
          link={generatedLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectBrief;
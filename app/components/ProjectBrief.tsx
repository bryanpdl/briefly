import React from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';

interface ProjectBriefProps {
  brief: string;
  onEdit: () => void;
  onCreateNew: () => void;
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({ brief, onEdit, onCreateNew }) => {
  const handleShare = () => {
    const subject = encodeURIComponent('Project Brief');
    const body = encodeURIComponent(`Here is the project brief:\n\n${brief}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2>Generated Project Brief</h2>
      <pre className="p-6 bg-white rounded-lg shadow-sm whitespace-pre-wrap border border-gray-200">{brief}</pre>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onEdit}
          className="btn-primary bg-gray-600 hover:bg-gray-700"
        >
          Edit Brief
        </button>
        <BlobProvider document={<PDFDocument brief={brief} />}>
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
        <button
          onClick={handleShare}
          className="btn-primary bg-green-600 hover:bg-green-700"
        >
          Share via Email
        </button>
        <button
          onClick={onCreateNew}
          className="btn-primary bg-blue-600 hover:bg-blue-700"
        >
          Create New Brief
        </button>
      </div>
    </div>
  );
};

export default ProjectBrief;
import { useState } from 'react';
import { Button } from './button';
import { FileDown, Loader2 } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';
import { exportToPDF } from '../../utils/exportUtils';

interface LaTeXExportButtonProps {
  className?: string;
}

export function LaTeXExportButton({ className }: LaTeXExportButtonProps) {
  const { state } = useCVContext();
  const [isExporting, setIsExporting] = useState(false);
  const [latexTemplate, setLatexTemplate] = useState('modern');

  const handleLatexExport = async () => {
    if (!state.personalInfo.firstName || !state.personalInfo.lastName) {
      alert('Please fill in your name before exporting');
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportToPDF(state, {
        fileName: `${state.personalInfo.firstName}_${state.personalInfo.lastName}_CV_LaTeX`,
        latexTemplate,
        customizations: {
          colorScheme: 'blue',
          fontSize: 'normal',
          spacing: 'normal'
        }
      });
      
      console.log('LaTeX Export Success:', result);
      
      // Show success message with LaTeX code preview
      if (result.latexCode) {
        const preview = result.latexCode.slice(0, 500) + '...';
        console.log('Generated LaTeX Preview:', preview);
      }
      
    } catch (error) {
      console.error('LaTeX export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2 items-center">
        <select
          value={latexTemplate}
          onChange={(e) => setLatexTemplate(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="modern">Modern Professional</option>
          <option value="academic">Academic</option>
          <option value="creative">Creative</option>
        </select>
        
        <Button
          onClick={handleLatexExport}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          {isExporting ? 'Generating...' : '          Export PDF'}
        </Button>
      </div>
      
      <div className="text-xs text-gray-600">
        <p>🚀 <strong>Professional PDF</strong>: High-quality typography and layout</p>
        <p>✨ LaTeX-powered document generation</p>
      </div>
    </div>
  );
}
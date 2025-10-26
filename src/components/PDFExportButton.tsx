import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const PDFExportButton = ({ targetId }: { targetId: string }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: window.devicePixelRatio || 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;
      pdf.addImage(imgData, 'PNG', x, y, width, height, undefined, 'FAST');
      pdf.save('lasers-and-feelings-character.pdf');
    } catch (error) {
      console.error('Failed to export PDF', error);
      alert('Unable to export PDF. Try printing the page using your browser.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-wait disabled:opacity-70"
    >
      {isExporting ? 'Preparing PDF…' : 'Export PDF'}
    </button>
  );
};

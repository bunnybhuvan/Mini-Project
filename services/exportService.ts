// These libraries are loaded from CDN in index.html
declare var jspdf: any;
declare var html2canvas: any;

/**
 * Exports an HTML element to a PDF file.
 * @param element The HTML element to capture.
 * @param fileName The name of the file to be saved.
 */
export const exportToPdf = async (element: HTMLElement, fileName: string): Promise<void> => {
    if (!element) {
        console.error("Element to export not found.");
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Improve resolution
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 dimensions in points: 595.28 x 841.89
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / ratio;
        
        // If height is still greater than pdf height, scale based on height
        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight * ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = 0; // Align to top

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save(fileName);

    } catch (error) {
        console.error("Error exporting to PDF:", error);
    }
};
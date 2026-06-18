// These libraries are loaded from CDN in index.html
declare var pdfjsLib: any;
declare var mammoth: any;

/**
 * Reads a File object and returns its content as an ArrayBuffer.
 * @param file The file to read.
 * @returns A promise that resolves with the ArrayBuffer.
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Parses a PDF file and extracts its text content.
 * @param arrayBuffer The ArrayBuffer of the PDF file.
 * @returns A promise that resolves with the extracted text.
 */
const parsePdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
};

/**
 * Parses a DOCX file and extracts its raw text content.
 * @param arrayBuffer The ArrayBuffer of the DOCX file.
 * @returns A promise that resolves with the extracted text.
 */
const parseDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

/**
 * Parses a resume file (PDF or DOCX) and extracts the text content.
 * @param file The resume file to parse.
 * @returns A promise that resolves with the extracted text.
 */
export const parseResumeFile = async (file: File): Promise<string> => {
    const arrayBuffer = await readFileAsArrayBuffer(file);

    if (file.type === 'application/pdf') {
        return parsePdf(arrayBuffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return parseDocx(arrayBuffer);
    } else {
        throw new Error('Unsupported file type.');
    }
};
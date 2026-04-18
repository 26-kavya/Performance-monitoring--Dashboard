import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Configure pdfjs worker to run in browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const analyzeResume = async (file) => {
    try {
        let text = "";
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'pdf') {
            text = await extractTextFromPDF(file);
        } else if (fileType === 'docx') {
            text = await extractTextFromDOCX(file);
        } else if (fileType === 'txt') {
            text = await extractTextFromTXT(file);
        } else {
            throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
        }

        return scoreResume(text);
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw error;
    }
};

const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    fullText += pageText + " ";
                }
                resolve(fullText);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

const extractTextFromDOCX = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

const extractTextFromTXT = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
    });
};

const scoreResume = (text) => {
    text = text.toLowerCase();
    let score = 0;

    const findings = {
        hasSkills: false,
        hasProjects: false,
        hasEducation: false,
        hasExperience: false,
        hasInternshipOrCerts: false,
        detectedKeywords: [],
        missingSections: [],
        suggestions: []
    };

    // 1. Check core sections
    if (text.includes("skills") || text.includes("technical skills") || text.includes("core competencies")) {
        score += 20;
        findings.hasSkills = true;
    } else {
        findings.missingSections.push("Skills");
        findings.suggestions.push("Add a dedicated 'Skills' section listing your technical competencies clearly.");
    }

    if (text.includes("projects") || text.includes("personal projects") || text.includes("academic projects")) {
        score += 20;
        findings.hasProjects = true;
    } else {
        findings.missingSections.push("Projects");
        findings.suggestions.push("Include a 'Projects' section highlighting your practical work and what you built.");
    }

    if (text.includes("education") || text.includes("academic background") || text.includes("university")) {
        score += 15;
        findings.hasEducation = true;
    } else {
        findings.missingSections.push("Education");
        findings.suggestions.push("Add an 'Education' section detailing your academic background.");
    }

    if (text.includes("experience") || text.includes("work history") || text.includes("employment")) {
        score += 20;
        findings.hasExperience = true;
    } else {
        findings.missingSections.push("Experience");
        findings.suggestions.push("Add an 'Experience' section. If you don't have professional experience, expand on projects or internships.");
    }

    if (text.includes("internship") || text.includes("certifications") || text.includes("certificate")) {
        score += 15;
        findings.hasInternshipOrCerts = true;
    } else {
        findings.suggestions.push("Consider adding 'Internships' or 'Certifications' to boost your profile if you have any.");
    }

    // 2. Check technical keywords
    const keywords = ["java", "python", "sql", "react", "node", "html", "css", "javascript", "c++", "aws", "docker"];
    let matchedKeywords = 0;

    // Function to escape special regex characters (like '+' in 'c++')
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    keywords.forEach(keyword => {
        // Use word boundaries for stricter matching, and escape the keyword
        const escapedKeyword = escapeRegExp(keyword);

        // Special case for c++: \b doesn't match after +, so we need a slightly modified regex for symbols
        const regexPattern = /[a-z]+$/.test(keyword)
            ? `\\b${escapedKeyword}\\b`
            : `\\b${escapedKeyword}(?!\\w)`;

        const regex = new RegExp(regexPattern, 'i');

        if (regex.test(text)) {
            matchedKeywords++;
            findings.detectedKeywords.push(keyword.toUpperCase());
        }
    });

    // Up to 10 points for keywords (2 points per keyword, max 10)
    const keywordScore = Math.min(matchedKeywords * 2, 10);
    score += keywordScore;

    if (matchedKeywords === 0) {
        findings.suggestions.push("We couldn't detect any standard technical keywords (e.g., Java, Python, React). Make sure they are spelled correctly and clearly visible.");
    }

    return {
        score,
        findings
    };
};

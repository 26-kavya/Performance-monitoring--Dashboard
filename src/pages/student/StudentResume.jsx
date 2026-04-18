import React, { useState } from 'react';
import { UploadCloud, File, Activity, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { analyzeResume } from '../../utils/resumeAnalyzer';

const StudentResume = () => {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
                setFile(null);
                setResult(null);
                return;
            }
            setError(null);
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const analysisResult = await analyzeResume(file);
            setResult(analysisResult);
        } catch (err) {
            setError(err.message || 'An error occurred during resume analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderCircularScore = (score) => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        // Color changes based on score
        const getStrokeColor = (val) => {
            if (val >= 80) return '#10B981'; // green-500
            if (val >= 50) return '#F59E0B'; // amber-500
            return '#EF4444'; // red-500
        };

        return (
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-slate-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="64"
                        cy="64"
                    />
                    <circle
                        stroke={getStrokeColor(score)}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="64"
                        cy="64"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-[#e0e0e0]">{score}</span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-[#e0e0e0]">Resume Analyzer</h1>
                <p className="text-slate-500 dark:text-[#a0aec0] mt-2 text-lg">Upload your resume to instantly receive an ATS-style score and personalized feedback.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1 border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-[#e0e0e0] mb-6 flex items-center gap-2">
                            <UploadCloud className="text-indigo-600 dark:text-indigo-400" />
                            Upload Resume
                        </h2>

                        <label
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group
                                ${file ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:bg-[#121212]'}
                            `}
                        >
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />
                            <File className={`w-12 h-12 mb-4 ${file ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                            <span className="text-sm font-medium text-slate-700 dark:text-[#e0e0e0] text-center">
                                {file ? file.name : "Click to browse or drag and drop"}
                            </span>
                            {!file && <span className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT up to 10MB</span>}
                        </label>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className={`w-full mt-8 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-sm
                            ${!file || isAnalyzing
                                ? 'bg-slate-100 dark:bg-[#2a2a2a] text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95'}
                        `}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Activity size={20} />
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {result ? (
                        <>
                            {/* Score Overview */}
                            <div className="border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    {renderCircularScore(result.score)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0] mb-2">Analysis Complete</h3>
                                    <p className="text-slate-600 dark:text-[#a0aec0] text-lg">
                                        Your resume scored <span className="font-semibold text-slate-800 dark:text-[#e0e0e0]">{result.score} points </span>
                                        based on structure and standard technical keywords.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Details - Positive */}
                                <div className="border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-[#333] pb-3">
                                        <CheckCircle className="text-emerald-500" size={20} />
                                        Positive Findings
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.findings.hasSkills && <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Found Skills section</li>}
                                        {result.findings.hasProjects && <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Found Projects section</li>}
                                        {result.findings.hasEducation && <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Found Education section</li>}
                                        {result.findings.hasExperience && <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Found Experience section</li>}
                                        {result.findings.hasInternshipOrCerts && <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Found Internships/Certifications</li>}
                                        {result.findings.detectedKeywords.length > 0 && (
                                            <li className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm flex-col">
                                                <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Standard Skills Detected:</div>
                                                <div className="flex flex-wrap gap-2 ml-6">
                                                    {result.findings.detectedKeywords.map((k, i) => (
                                                        <span key={i} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">{k}</span>
                                                    ))}
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Details - Improvements */}
                                <div className="border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-[#333] pb-3">
                                        <AlertCircle className="text-rose-500" size={20} />
                                        Missing Core Sections
                                    </h3>
                                    {result.findings.missingSections.length > 0 ? (
                                        <ul className="space-y-3">
                                            {result.findings.missingSections.map((section, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-[#a0aec0] text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                                                    <span>Missing <strong>{section}</strong> section.</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-slate-500 dark:text-[#a0aec0] text-sm italic py-2">
                                            Great job! All core resume sections are present.
                                        </div>
                                    )}
                                </div>

                                {/* Recommendations */}
                                <div className="md:col-span-2 border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl p-6 shadow-sm bg-gradient-to-r from-amber-50 to-white">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-4 flex items-center gap-2">
                                        <Lightbulb className="text-amber-500" size={20} />
                                        Recommendations
                                    </h3>
                                    {result.findings.suggestions.length > 0 ? (
                                        <ul className="space-y-3">
                                            {result.findings.suggestions.map((s, idx) => (
                                                <li key={idx} className="flex items-start gap-3 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-3 rounded-lg border border-amber-100 shadow-sm text-sm text-slate-700 dark:text-[#e0e0e0]">
                                                    <span className="font-bold text-amber-500 mt-0.5">{idx + 1}.</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-slate-500 dark:text-[#a0aec0] text-sm italic">
                                            Your resume looks very solid out of the box. Keep maintaining clear structure and actionable bullet points!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State Placeholder */
                        <div className="border border-slate-200 dark:border-[#333] bg-slate-50/50 rounded-2xl p-12 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-full flex items-center justify-center shadow-sm mb-6">
                                <Activity className="text-slate-300 w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-[#e0e0e0] mb-2">No Analysis Yet</h3>
                            <p className="text-slate-500 dark:text-[#a0aec0] max-w-sm">Upload your resume and click Analyze to generate your personalized action plan and score.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentResume;

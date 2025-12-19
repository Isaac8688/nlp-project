
import React, { useState, useCallback } from 'react';
import { EducationLevel, EssayResult } from './types';
import { gradeEssay } from './services/geminiService';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [essayText, setEssayText] = useState('');
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.HIGH_SCHOOL);
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<EssayResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGrade = async () => {
    if (essayText.trim().length < 50) {
      setError('Essay is too short for a meaningful analysis. Please write at least 50 words.');
      return;
    }

    setIsGrading(true);
    setError(null);
    try {
      const analysis = await gradeEssay(essayText, level);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during grading. Please try again.');
    } finally {
      setIsGrading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setEssayText('');
    setError(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-pen-nib"></i>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Lumina Grader</h1>
            </div>
          </div>
        </header>
        <Dashboard result={result} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-pen-nib"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Lumina Grader</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Controls Panel */}
          <div className="p-8 lg:w-1/3 bg-slate-50 border-r border-slate-100 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Essay Analysis</h2>
              <p className="text-slate-500 text-sm mt-1">Select your academic level and paste your text to get an instant graded report.</p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Education Level</span>
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                >
                  {Object.values(EducationLevel).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </label>

              <div className="pt-4">
                <button 
                  onClick={handleGrade}
                  disabled={isGrading || essayText.trim().length === 0}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isGrading 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  {isGrading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Grade Essay
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex gap-3 animate-in slide-in-from-top-2">
                  <i className="fa-solid fa-circle-info mt-1"></i>
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Features</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-indigo-500 w-4"></i> Lexical Diversity check</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-indigo-500 w-4"></i> Sentence Complexity</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-indigo-500 w-4"></i> Rubric Scoring</li>
              </ul>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="flex-1 p-0 flex flex-col min-h-[500px]">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Paste your essay here (minimum 50 words)..."
              className="flex-1 w-full p-8 text-lg text-slate-700 resize-none focus:outline-none placeholder:text-slate-300 leading-relaxed font-light"
            ></textarea>
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Characters: {essayText.length}</span>
              <span>Words: {essayText.trim().split(/\s+/).filter(Boolean).length}</span>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-slate-400 text-sm max-w-md text-center">
          Powered by Gemini 3 Pro NLP. Academic levels adjust grading strictness and feedback focus.
        </p>
      </main>

      <footer className="p-4 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        © 2024 Lumina Academic Systems • Built with Gemini API
      </footer>
    </div>
  );
};

export default App;

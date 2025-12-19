
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { EssayResult } from '../types';

interface DashboardProps {
  result: EssayResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, onReset }) => {
  const rubricData = [
    { subject: 'Content', A: result.rubricScores.content, fullMark: 100 },
    { subject: 'Organization', A: result.rubricScores.organization, fullMark: 100 },
    { subject: 'Grammar', A: result.rubricScores.grammar, fullMark: 100 },
    { subject: 'Vocabulary', A: result.rubricScores.vocabulary, fullMark: 100 },
  ];

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Grading Report</h2>
          <p className="text-slate-500">Comprehensive analysis of your essay submission</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
        >
          <i className="fa-solid fa-rotate-left mr-2"></i> New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
             <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * result.overallScore) / 100}
                  className="text-indigo-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-slate-800">{result.overallScore}</span>
              </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-800">Overall Grade</h3>
          <p className="text-slate-500 mt-2">{result.summary}</p>
        </div>

        {/* NLP Metrics Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
             <i className="fa-solid fa-microscope text-indigo-500 mr-2"></i> NLP Metrics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             {[
               { label: 'Word Count', value: result.metrics.wordCount, icon: 'fa-font' },
               { label: 'Sentences', value: result.metrics.sentenceCount, icon: 'fa-align-left' },
               { label: 'Readability', value: result.metrics.readabilityScore, icon: 'fa-book-open' },
               { label: 'Lexical Diversity', value: (result.metrics.lexicalDiversity * 100).toFixed(1) + '%', icon: 'fa-brain' },
               { label: 'Complexity', value: result.metrics.sentenceComplexity.toFixed(1) + '/10', icon: 'fa-layer-group' },
             ].map((m, idx) => (
               <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <i className={`fa-solid ${m.icon} mr-2`}></i> {m.label}
                  </div>
                  <div className="text-xl font-bold text-slate-700">{m.value}</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Rubric Radar Chart */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Rubric Analysis</h3>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={rubricData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
         </div>

         {/* Feedback Section */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800">Critical Feedback</h3>
            <div className="space-y-3">
              {result.feedback.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${item.type === 'positive' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${item.type === 'positive' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                      <i className={`fa-solid ${item.type === 'positive' ? 'fa-check' : 'fa-triangle-exclamation'} text-xs`}></i>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide opacity-70 block mb-1">{item.category}</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;

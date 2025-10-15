import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';

import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVAnalysisResultsProps {
  analysisData: {
    fileName: string;
    fileSize: number;
    fileType: string;
    extractedText: string;
    personalInfo: any;
    experience: any[];
    education: any[];
    skills: any[];
    suggestions: Array<{
      type: 'missing' | 'improvement' | 'optimization';
      category: string;
      message: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    score: {
      overall: number;
      completeness: number;
      relevance: number;
      formatting: number;
    };
  };
  onImproveCV: (extractedData: any) => void;
  onUploadNew: () => void;
}

export function CVAnalysisResults({ analysisData, onImproveCV, onUploadNew }: CVAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'extracted'>('overview');

  // Safety check for analysisData
  if (!analysisData) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600">Error: No Analysis Data</h3>
        <p className="text-gray-600 mt-2">The analysis data is missing or invalid.</p>
        <Button onClick={onUploadNew} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Destructure the analysisData for easier access
  const { fileName, fileSize, personalInfo, experience, education, skills, suggestions, score } = analysisData;
  
  // Create extractedData object for backward compatibility
  const extractedData = { personalInfo, experience, education, skills };
  
  // Create file object for backward compatibility  
  const file = { name: fileName, size: fileSize };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-purple-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
      case 'medium': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
      case 'low': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300';
      default: return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'missing': return <AlertTriangle className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'optimization': return <Lightbulb className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const prioritySuggestions = suggestions?.filter((s: any) => s.priority === 'high') || [];
  const mediumSuggestions = suggestions?.filter((s: any) => s.priority === 'medium') || [];
  const lowSuggestions = suggestions?.filter((s: any) => s.priority === 'low') || [];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <Card className="bg-purple-50 border-purple-200 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-2xl text-white shadow-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  CV Analysis Complete
                </CardTitle>
                <p className="text-slate-600 mt-2 flex items-center gap-2">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-xs px-2 py-1 bg-slate-200 rounded-full">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onUploadNew}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Upload New CV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Score Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className={cn("text-4xl font-bold mb-2 transition-all duration-300", getScoreColor(score.overall))}>
              {score.overall}%
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Overall Score</p>
            <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-bold", 
              score.overall >= 90 ? "bg-emerald-100 text-emerald-800" :
              score.overall >= 80 ? "bg-blue-100 text-blue-800" :
              score.overall >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}>
              {getScoreLabel(score.overall)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className={cn("text-3xl font-bold mb-2", getScoreColor(score.completeness))}>
              {score.completeness}%
            </div>
            <p className="text-sm font-medium text-slate-600">📋 Completeness</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className={cn("text-3xl font-bold mb-2", getScoreColor(score.relevance))}>
              {score.relevance}%
            </div>
            <p className="text-sm font-medium text-slate-600">Relevance</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className={cn("text-3xl font-bold mb-2", getScoreColor(score.formatting))}>
              {score.formatting}%
            </div>
            <p className="text-sm font-medium text-slate-600">📐 Structure</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Action Button */}
      <Card className="bg-blue-50 border-blue-200 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  🚀 Ready to Improve Your CV?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Use our AI-powered builder to create an enhanced version based on your existing content
                </p>
              </div>
            </div>
            <Button 
              onClick={() => onImproveCV(extractedData)} 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base font-medium"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Improve CV Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Quick Overview' },
          { id: 'suggestions', label: `Suggestions (${suggestions.length})` },
          { id: 'extracted', label: 'Extracted Data' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  What's Good
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {extractedData.personalInfo.name && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 ">
                    <User className="h-4 w-4 text-slate-500 " />
                    <span>Personal information detected</span>
                  </div>
                )}
                {extractedData.experience.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 ">
                    <Briefcase className="h-4 w-4 text-slate-500 " />
                    <span>{extractedData.experience.length} work experience entries</span>
                  </div>
                )}
                {extractedData.education.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 ">
                    <GraduationCap className="h-4 w-4 text-slate-500 " />
                    <span>{extractedData.education.length} education entries</span>
                  </div>
                )}
                {extractedData.skills.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 ">
                    <Code className="h-4 w-4 text-slate-500 " />
                    <span>{extractedData.skills.length} skills listed</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Priority Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prioritySuggestions.length === 0 ? (
                  <p className="text-sm text-slate-600 ">
                    No critical issues found! 🎉
                  </p>
                ) : (
                  prioritySuggestions.slice(0, 4).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-slate-700 ">
                      {getSuggestionIcon(suggestion.type)}
                      <span>{suggestion.message}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            {prioritySuggestions.length > 0 && (
              <Card className="border-red-200  shadow-lg shadow-red-500/10">
                <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50  ">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 text-white rounded-lg">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-red-700  text-xl font-bold">
                        🚨 High Priority Issues
                      </span>
                      <p className="text-sm text-red-600  font-normal mt-1">
                        {prioritySuggestions.length} critical items requiring immediate attention
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {prioritySuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-rose-50/50   rounded-xl border border-red-100  hover:shadow-md transition-all duration-200">
                      <div className="p-2 bg-red-100  rounded-lg text-red-600 ">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900 ">{suggestion.category}</span>
                          <Badge className={cn("px-3 py-1 text-xs font-bold rounded-full", getPriorityColor(suggestion.priority))}>
                            HIGH PRIORITY
                          </Badge>
                        </div>
                        <p className="text-slate-700  leading-relaxed">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {mediumSuggestions.length > 0 && (
              <Card className="border-amber-200  shadow-lg shadow-amber-500/10">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50  ">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 text-white rounded-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-amber-700  text-xl font-bold">
                        ⚠️ Medium Priority Items
                      </span>
                      <p className="text-sm text-amber-600  font-normal mt-1">
                        {mediumSuggestions.length} improvements to enhance your CV's effectiveness
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {mediumSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50/50   rounded-xl border border-amber-100  hover:shadow-md transition-all duration-200">
                      <div className="p-2 bg-amber-100  rounded-lg text-amber-600 ">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900 ">{suggestion.category}</span>
                          <Badge className={cn("px-3 py-1 text-xs font-bold rounded-full", getPriorityColor(suggestion.priority))}>
                            MEDIUM
                          </Badge>
                        </div>
                        <p className="text-slate-700  leading-relaxed">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {lowSuggestions.length > 0 && (
              <Card className="border-blue-200  shadow-lg shadow-blue-500/10">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50  ">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-blue-700  text-xl font-bold">
                        💡 Enhancement Opportunities
                      </span>
                      <p className="text-sm text-blue-600  font-normal mt-1">
                        {lowSuggestions.length} suggestions to make your CV even better
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {lowSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50   rounded-xl border border-blue-100  hover:shadow-md transition-all duration-200">
                      <div className="p-2 bg-blue-100  rounded-lg text-blue-600 ">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900 ">{suggestion.category}</span>
                          <Badge className={cn("px-3 py-1 text-xs font-bold rounded-full", getPriorityColor(suggestion.priority))}>
                            ENHANCEMENT
                          </Badge>
                        </div>
                        <p className="text-slate-700  leading-relaxed">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'extracted' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-800 ">
                <div><strong className="text-slate-900 ">Name:</strong> {extractedData.personalInfo.name || 'Not detected'}</div>
                <div><strong className="text-slate-900 ">Title:</strong> {extractedData.personalInfo.title || 'Not detected'}</div>
                <div><strong className="text-slate-900 ">Email:</strong> {extractedData.personalInfo.email || 'Not detected'}</div>
                <div><strong className="text-slate-900 ">Phone:</strong> {extractedData.personalInfo.phone || 'Not detected'}</div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience ({extractedData.experience.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {extractedData.experience.length === 0 ? (
                  <p className="text-sm text-slate-600 ">No experience entries detected</p>
                ) : (
                  extractedData.experience.slice(0, 3).map((exp: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-slate-800 ">{exp.position}</div>
                      <div className="text-slate-600 ">{exp.company} • {exp.duration}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education ({extractedData.education.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {extractedData.education.length === 0 ? (
                  <p className="text-sm text-slate-600 ">No education entries detected</p>
                ) : (
                  extractedData.education.map((edu: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-slate-800 ">{edu.degree}</div>
                      <div className="text-slate-600 ">{edu.institution} • {edu.duration}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills ({extractedData.skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {extractedData.skills.length === 0 ? (
                  <p className="text-sm text-slate-600 ">No skills detected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.slice(0, 10).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.length > 10 && (
                      <Badge variant="outline">
                        +{extractedData.skills.length - 10} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

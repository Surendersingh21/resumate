import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, Eye, Download, X, Heart, Share2, Award, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { mockTemplates } from '../utils/template-data';
import type { Template } from '../utils/template-data';

const categories = ['All', 'Professional', 'Creative', 'Executive', 'Academic', 'Healthcare', 'Sales', 'Finance'];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('jobSuccess');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyATS, setShowOnlyATS] = useState(false);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesFavorites = !showOnlyFavorites || favorites.includes(template.id);
    const matchesATS = !showOnlyATS || template.isATSFriendly;
    
    return matchesSearch && matchesCategory && matchesFavorites && matchesATS;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'jobSuccess':
        return b.jobSuccessRate - a.jobSuccessRate;
      case 'atsScore':
        return b.atsScore - a.atsScore;
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getATSBadgeColor = (score: number) => {
    if (score >= 85) return 'gradient-primary';
    if (score >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 75) return 'text-purple-600';
    if (rate >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full gradient-card mb-8">
            <Award className="h-5 w-5 text-gradient mr-3" />
            <span className="text-sm font-semibold text-muted-foreground">Professional CV Templates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-6">
            ATS-Friendly CV Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Choose from our collection of professionally designed, ATS-optimized templates with proven job success rates.
            <br />Get hired faster with templates that pass through applicant tracking systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg gradient-card">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-foreground">98% ATS Compatible</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg gradient-card">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-foreground">85% Average Success Rate</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg gradient-card">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-foreground">50k+ Downloads</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="gradient-card border-0 shadow-glow mb-12">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gradient">Find Your Perfect Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Search Templates</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base gradient-card border-0 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 px-4 text-base gradient-card border-0 rounded-lg focus:ring-2 focus:ring-primary/20 text-foreground"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-12 px-4 text-base gradient-card border-0 rounded-lg focus:ring-2 focus:ring-primary/20 text-foreground"
                >
                  <option value="jobSuccess">Job Success Rate</option>
                  <option value="atsScore">ATS Score</option>
                  <option value="rating">Rating</option>
                  <option value="downloads">Downloads</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Quick Filters</label>
                <div className="flex flex-col gap-3">
                  <Button
                    variant={showOnlyFavorites ? "default" : "outline"}
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`justify-start h-10 ${showOnlyFavorites ? 'gradient-primary shadow-glow text-white' : 'gradient-card border-0 hover:gradient-primary hover:text-white'} transition-all duration-300`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${showOnlyFavorites && favorites.length > 0 ? 'fill-current' : ''}`} />
                    Favorites ({favorites.length})
                  </Button>
                  <Button
                    variant={showOnlyATS ? "default" : "outline"}
                    onClick={() => setShowOnlyATS(!showOnlyATS)}
                    className={`justify-start h-10 ${showOnlyATS ? 'gradient-primary shadow-glow text-white' : 'gradient-card border-0 hover:gradient-primary hover:text-white'} transition-all duration-300`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ATS-Friendly Only
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
              <Badge className="px-4 py-2 text-sm font-semibold gradient-primary text-white border-0 shadow-md">
                <CheckCircle className="w-4 h-4 mr-2" />
                {mockTemplates.filter(t => t.isATSFriendly).length} ATS-Friendly Templates
              </Badge>
              <Badge className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md">
                <Search className="w-4 h-4 mr-2" />
                {sortedTemplates.length} Templates Found
              </Badge>
              <Badge className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-md">
                <TrendingUp className="w-4 h-4 mr-2" />
                Avg Success: {Math.round(mockTemplates.reduce((acc, t) => acc + t.jobSuccessRate, 0) / mockTemplates.length)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-glow transition-all duration-500 border-0 gradient-card hover:scale-105 relative overflow-hidden animate-slide-in-blur">
              {/* ATS Badge */}
              {template.isATSFriendly && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`${getATSBadgeColor(template.atsScore)} text-white border-0 font-semibold shadow-lg`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ATS {template.atsScore}%
                  </Badge>
                </div>
              )}

              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 font-semibold shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(template.id)}
                className={`absolute top-4 right-16 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  favorites.includes(template.id) 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-purple-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
              </button>

              <CardHeader className="pb-3">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Success Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getSuccessRateColor(template.jobSuccessRate)}`}>
                      {template.jobSuccessRate}%
                    </div>
                    <div className="text-xs text-gray-500">Job Success</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getSuccessRateColor(template.interviewRate)}`}>
                      {template.interviewRate}%
                    </div>
                    <div className="text-xs text-gray-500">Interview Rate</div>
                  </div>
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-purple-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Popular Industries */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Popular in:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.popularIndustries.slice(0, 2).map((industry, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {industry}
                      </Badge>
                    ))}
                    {template.popularIndustries.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{template.popularIndustries.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setPreviewTemplate(template)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Link to={`/builder?template=${template.id}`}>
                    <Button className="w-full" size="sm">
                      <Zap className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">{previewTemplate.name}</h2>
                    <p className="text-gray-600">{previewTemplate.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(null)}
                    className="border-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Template Preview */}
                  <div>
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={previewTemplate.preview}
                        alt={previewTemplate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Template Details */}
                  <div className="space-y-6">
                    {/* ATS Analysis */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        ATS Analysis
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{previewTemplate.atsScore}%</div>
                          <div className="text-sm text-gray-600">ATS Compatibility</div>
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${getSuccessRateColor(previewTemplate.jobSuccessRate)}`}>
                            {previewTemplate.jobSuccessRate}%
                          </div>
                          <div className="text-sm text-gray-600">Job Success Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                        Success Metrics
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Interview Rate:</span>
                          <span className="font-semibold text-gray-900">{previewTemplate.interviewRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Downloads:</span>
                          <span className="font-semibold text-gray-900">{previewTemplate.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Rating:</span>
                          <span className="font-semibold flex items-center text-gray-900">
                            <Star className="w-4 h-4 text-purple-400 fill-current mr-1" />
                            {previewTemplate.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Popular Industries */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Popular Industries</h3>
                      <div className="flex flex-wrap gap-2">
                        {previewTemplate.popularIndustries.map((industry, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">{industry}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Key Features</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {previewTemplate.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Link to={`/builder?template=${previewTemplate.id}`} className="flex-1">
                        <Button className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Use This Template
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => toggleFavorite(previewTemplate.id)}
                        className={favorites.includes(previewTemplate.id) ? 'text-red-600 border-red-300' : ''}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(previewTemplate.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setShowOnlyFavorites(false);
                setShowOnlyATS(false);
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

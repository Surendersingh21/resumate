import { useState, useRef, useEffect } from 'react';
import { Plus, X, AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent } from './card';
import { SortableList } from './sortable-list';
import { validateSkill, getSkillSuggestions, searchSkills, getTrendingSkills, skillCategories } from '@/utils/skillSuggestions';
import { cn } from '@/lib/utils';
import type { Skill } from '@/context/CVContext';

interface SmartSkillsInputProps {
  skills: Skill[];
  onAddSkill: (name: string) => void;
  onRemoveSkill: (id: string) => void;
  onUpdateSkill: (id: string, field: string, value: string) => void;
  onReorderSkills?: (skills: Skill[]) => void;
  professionalTitle?: string; // User's job title for context-aware validation
  className?: string;
}

export function SmartSkillsInput({
  skills,
  onAddSkill,
  onRemoveSkill,
  onUpdateSkill,
  onReorderSkills,
  professionalTitle,
  className
}: SmartSkillsInputProps) {
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validation, setValidation] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTrending, setShowTrending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const trendingSkills = getTrendingSkills();

  useEffect(() => {
    if (newSkill.trim().length > 0) {
      // Validate the skill with professional context
      const validationResult = validateSkill(newSkill, professionalTitle);
      setValidation(validationResult);

      // Get suggestions based on input
      if (newSkill.length >= 2) {
        const searchResults = searchSkills(newSkill, 8);
        setSuggestions(searchResults);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setValidation(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newSkill, professionalTitle]);

  const handleAddSkill = (skillName: string = newSkill) => {
    if (skillName.trim()) {
      const validation = validateSkill(skillName, professionalTitle);
      if (validation.isRelevant) {
        onAddSkill(skillName.trim());
        setNewSkill('');
        setValidation(null);
        setShowSuggestions(false);
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const categorySkills = getSkillSuggestions(category, 12);
    setSuggestions(categorySkills);
    setShowSuggestions(true);
    setShowTrending(false);
  };

  const handleShowTrending = () => {
    setShowTrending(!showTrending);
    setSelectedCategory('');
    if (!showTrending) {
      setSuggestions(trendingSkills);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Input Section */}
      <div className="space-y-3">
        {professionalTitle && (
          <div className="flex items-center gap-2 text-sm text-blue-600  bg-blue-50  rounded-lg p-3">
            <Lightbulb className="h-4 w-4" />
            <span>
              <strong>Context:</strong> Validating skills for <em>{professionalTitle}</em> role
            </span>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill (e.g., React, Python, Project Management)"
              className={cn(
                "pr-12",
                validation?.isRelevant === false && "border-red-500 focus:border-red-500",
                validation?.isRelevant === true && "border-green-500 focus:border-green-500"
              )}
            />
            {validation && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validation.isRelevant ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={() => handleAddSkill()}
            disabled={!newSkill.trim() || validation?.isRelevant === false}
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Validation Message */}
        {validation && (
          <Card className={cn(
            "border-l-4",
            validation.isRelevant ? "border-l-green-500 bg-green-50 " : "border-l-red-500 bg-red-50 "
          )}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {validation.isRelevant ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className={cn(
                    "text-sm font-medium",
                    validation.isRelevant ? "text-green-800 " : "text-red-800 "
                  )}>
                    {validation.suggestion}
                    {validation.relevanceScore && validation.isRelevant && (
                      <span className="ml-2 text-xs opacity-75">
                        (Relevance: {validation.relevanceScore}/10)
                      </span>
                    )}
                  </p>
                  {validation.reason && (
                    <p className="text-xs text-gray-600 ">
                      {validation.reason}
                    </p>
                  )}
                  {validation.alternatives && validation.alternatives.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700 ">
                        Consider these professional alternatives:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {validation.alternatives.slice(0, 4).map((alt: string, index: number) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewSkill(alt);
                              inputRef.current?.focus();
                            }}
                            className="h-6 text-xs"
                          >
                            {alt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShowTrending}
            className="text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {showTrending ? 'Hide Trending' : 'Show Trending Skills'}
          </Button>
          
          <div className="flex flex-wrap gap-1">
            {Object.values(skillCategories).slice(0, 4).map((category) => (
              <Button
                key={category.category}
                type="button"
                variant={selectedCategory === category.category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category.category)}
                className="text-xs h-7"
              >
                {category.category.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {showTrending ? 'Trending Skills' : selectedCategory ? `${selectedCategory} Skills` : 'Suggested Skills'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSkill(suggestion)}
                    className="text-xs h-7 hover:bg-blue-50 "
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Skills List */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Your Skills</h4>
          {onReorderSkills ? (
            <SortableList
              items={skills}
              onReorder={onReorderSkills}
              renderItem={(skill) => (
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => onUpdateSkill(skill.id, 'name', e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      value={skill.level}
                      onChange={(e) => onUpdateSkill(skill.id, 'level', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                    >
                      {skillLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          ) : (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => onUpdateSkill(skill.id, 'name', e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      value={skill.level}
                      onChange={(e) => onUpdateSkill(skill.id, 'level', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                    >
                      {skillLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

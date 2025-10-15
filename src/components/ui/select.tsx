import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  flag?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term with US prioritized
  const filteredOptions = searchable 
    ? options
        .filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          // Prioritize US in search results
          if (searchTerm && a.label.includes('United States')) return -1;
          if (searchTerm && b.label.includes('United States')) return 1;
          return 0;
        })
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm
          border border-input bg-background
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          rounded-md transition-colors
          ${className}
        `}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.flag && <span className="text-lg">{selectedOption.flag}</span>}
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-7 pr-2 py-1 text-xs border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value + option.label}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                    hover:bg-accent hover:text-accent-foreground
                    focus:outline-none focus:bg-accent focus:text-accent-foreground
                    transition-colors
                    ${value === option.value ? 'bg-accent text-accent-foreground' : ''}
                  `}
                >
                  {option.flag && <span className="text-lg">{option.flag}</span>}
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && <Check className="h-4 w-4" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

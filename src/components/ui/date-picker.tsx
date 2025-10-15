import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i + 10);

  const formatDisplayValue = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const handleMonthSelect = (monthIndex: number, year: number) => {
    const formattedValue = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    onChange(formattedValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {value ? formatDisplayValue(value) : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {/* Year selector */}
            <div className="p-3 border-b border-border">
              <select
                value={value ? value.split('-')[0] : currentYear}
                onChange={(e) => {
                  const year = parseInt(e.target.value);
                  const month = value ? value.split('-')[1] : '01';
                  onChange(`${year}-${month}`);
                }}
                className="w-full bg-background text-foreground text-sm font-medium border border-border rounded px-2 py-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month grid */}
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                  const monthValue = `${value ? value.split('-')[0] : currentYear}-${String(index + 1).padStart(2, '0')}`;
                  const isSelected = value === monthValue;
                  const currentDate = new Date();
                  const isCurrentMonth = 
                    index === currentDate.getMonth() && 
                    parseInt(value ? value.split('-')[0] : currentYear.toString()) === currentDate.getFullYear();
                  
                  return (
                    <Button
                      key={month}
                      type="button"
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleMonthSelect(index, parseInt(value ? value.split('-')[0] : currentYear.toString()))}
                      className={cn(
                        "h-9 text-xs font-medium",
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                        isCurrentMonth && !isSelected && "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {month.slice(0, 3)}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="border-t border-border p-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    const currentValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                    onChange(currentValue);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-xs"
                >
                  This Month
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="flex-1 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced date picker with preset options
export function EnhancedDatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [customInput, setCustomInput] = useState(false);

  const presets = [
    { label: 'Current', value: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }},
    { label: 'Last Month', value: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }},
    { label: '6 Months Ago', value: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }},
    { label: '1 Year Ago', value: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }},
  ];

  if (customInput) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCustomInput(false)}
            className="text-xs"
          >
            Use Picker
          </Button>
        </div>
        <Input
          type="month"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setCustomInput(true)}
          className="text-xs"
        >
          Custom Input
        </Button>
      </div>
      
      <div className="space-y-2">
        <DatePicker
          label=""
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(preset.value())}
              className="text-xs h-7"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

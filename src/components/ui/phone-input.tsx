import React from 'react';
import { Phone } from 'lucide-react';
import { Input } from './input';
import { Select, type SelectOption } from './select';

// Common country codes with flags (Nepal first as default, US prioritized in search)
const countryCodes: SelectOption[] = [
  { value: '+977', label: 'Nepal (+977)', flag: '🇳🇵' },
  { value: '+1-us', label: 'United States (+1)', flag: '🇺🇸' },
  { value: '+1-ca', label: 'Canada (+1)', flag: '🇨🇦' },
  { value: '+44', label: 'United Kingdom (+44)', flag: '🇬🇧' },
  { value: '+33', label: 'France (+33)', flag: '🇫🇷' },
  { value: '+49', label: 'Germany (+49)', flag: '🇩🇪' },
  { value: '+39', label: 'Italy (+39)', flag: '🇮🇹' },
  { value: '+34', label: 'Spain (+34)', flag: '🇪🇸' },
  { value: '+31', label: 'Netherlands (+31)', flag: '🇳🇱' },
  { value: '+32', label: 'Belgium (+32)', flag: '🇧🇪' },
  { value: '+41', label: 'Switzerland (+41)', flag: '🇨🇭' },
  { value: '+43', label: 'Austria (+43)', flag: '🇦🇹' },
  { value: '+45', label: 'Denmark (+45)', flag: '🇩🇰' },
  { value: '+46', label: 'Sweden (+46)', flag: '🇸🇪' },
  { value: '+47', label: 'Norway (+47)', flag: '🇳🇴' },
  { value: '+358', label: 'Finland (+358)', flag: '🇫🇮' },
  { value: '+91', label: 'India (+91)', flag: '🇮🇳' },
  { value: '+86', label: 'China (+86)', flag: '🇨🇳' },
  { value: '+81', label: 'Japan (+81)', flag: '🇯🇵' },
  { value: '+82', label: 'South Korea (+82)', flag: '🇰🇷' },
  { value: '+61', label: 'Australia (+61)', flag: '🇦🇺' },
  { value: '+64', label: 'New Zealand (+64)', flag: '🇳🇿' },
  { value: '+55', label: 'Brazil (+55)', flag: '🇧🇷' },
  { value: '+52', label: 'Mexico (+52)', flag: '🇲🇽' },
  { value: '+7', label: 'Russia (+7)', flag: '🇷🇺' },
  { value: '+380', label: 'Ukraine (+380)', flag: '🇺🇦' },
  { value: '+48', label: 'Poland (+48)', flag: '🇵🇱' },
  { value: '+420', label: 'Czech Republic (+420)', flag: '🇨🇿' },
  { value: '+36', label: 'Hungary (+36)', flag: '🇭🇺' },
  { value: '+351', label: 'Portugal (+351)', flag: '🇵🇹' },
  { value: '+30', label: 'Greece (+30)', flag: '🇬🇷' },
  { value: '+90', label: 'Turkey (+90)', flag: '🇹🇷' },
  { value: '+972', label: 'Israel (+972)', flag: '🇮🇱' },
  { value: '+971', label: 'UAE (+971)', flag: '🇦🇪' },
  { value: '+966', label: 'Saudi Arabia (+966)', flag: '🇸🇦' },
  { value: '+27', label: 'South Africa (+27)', flag: '🇿🇦' }
];

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "(555) 123-4567",
  className = "",
  error = false
}) => {
  // Parse existing value to extract country code and number
  const parsePhoneNumber = (phoneValue: string) => {
    const trimmed = phoneValue.trim();
    if (!trimmed) return { countryCode: '+977', number: '' };
    
    // Extract actual phone code (like +1, +44) from display value
    const getActualPhoneCode = (countryValue: string) => {
      if (countryValue.startsWith('+1-')) return '+1';
      return countryValue;
    };
    
    // Find matching country code by checking the actual phone number prefix
    for (const country of countryCodes) {
      const actualCode = getActualPhoneCode(country.value);
      if (trimmed.startsWith(actualCode)) {
        return {
          countryCode: country.value,
          number: trimmed.slice(actualCode.length).trim()
        };
      }
    }
    
    // If no country code found, assume it's Nepal local number
    return { countryCode: '+977', number: trimmed };
  };

  const { countryCode, number } = parsePhoneNumber(value);

  // Get the actual phone code for display purposes
  const getActualPhoneCode = (countryValue: string) => {
    if (countryValue.startsWith('+1-')) return '+1';
    return countryValue;
  };

  const handleCountryChange = (newCountryCode: string) => {
    const actualCode = getActualPhoneCode(newCountryCode);
    const newValue = number ? `${actualCode} ${number}` : actualCode;
    onChange(newValue);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    // Remove any non-digit characters except spaces, hyphens, and parentheses
    const cleanNumber = newNumber.replace(/[^\d\s\-\(\)]/g, '');
    const actualCode = getActualPhoneCode(countryCode);
    const newValue = cleanNumber ? `${actualCode} ${cleanNumber}` : actualCode;
    onChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Country Code Selector */}
      <div className="w-40 flex-shrink-0">
        <Select
          options={countryCodes}
          value={countryCode}
          onChange={handleCountryChange}
          placeholder="Country"
          searchable={true}
          className={error ? 'border-red-500 focus:border-red-500' : ''}
        />
      </div>
      
      {/* Phone Number Input */}
      <div className="flex-1 relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="tel"
          value={number}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className={`pl-10 ${error ? 'border-orange-500 focus:border-orange-500' : ''}`}
        />
      </div>
    </div>
  );
};

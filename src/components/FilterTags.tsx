
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const filterOptions = [
  { value: 'budget', label: 'Budget', color: 'bg-blue-100 text-blue-800' },
  { value: 'santé', label: 'Santé', color: 'bg-green-100 text-green-800' },
  { value: 'rapide', label: 'Rapide', color: 'bg-amber-100 text-amber-800' }
];

interface FilterTagsProps {
  selectedFilters: string[];
  onChange: (values: string[]) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ selectedFilters, onChange }) => {
  return (
    <div className="mb-4">
      <ToggleGroup 
        type="multiple" 
        className="justify-start gap-2"
        value={selectedFilters}
        onValueChange={onChange}
      >
        {filterOptions.map((option) => (
          <ToggleGroupItem 
            key={option.value} 
            value={option.value}
            className={`transition-all ${
              selectedFilters.includes(option.value) 
                ? option.color 
                : 'bg-gray-100 text-gray-600'
            } rounded-full px-4 py-1 text-sm font-medium`}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default FilterTags;

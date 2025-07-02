import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  isOpen,
  setIsOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);
  const hasValue = !!selectedOption;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100]" ref={dropdownRef}>

      <label className="absolute top-1 left-4 text-xs text-white/70 z-10 pointer-events-none">
        {label}
      </label>

      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full mt-5 px-4 py-3 bg-white/10 dark:bg-white/5 border-2 rounded-xl backdrop-blur-sm text-white cursor-pointer transition-all duration-300 ${
          error
            ? 'border-red-400 hover:border-red-300'
            : 'border-white/20 hover:border-white/30 focus:border-white/40'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <span className={`${!hasValue ? 'text-white/50' : 'text-white'}`}>
            {selectedOption?.label || placeholder}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-white/60" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
className="absolute top-full left-0 right-0 mt-2 bg-black/90 rounded-xl border border-white/20 shadow-xl z-[999] max-h-60 overflow-y-auto backdrop-blur-md"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  value === option.value
                    ? 'bg-violet-500/30 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 text-violet-300" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 mt-2 text-red-300 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;

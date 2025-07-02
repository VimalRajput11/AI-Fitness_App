import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  step?: string;
  min?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  step,
  min,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const shouldFloatLabel = isFocused || hasValue;

  const handleLabelClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Input Container */}
      <div className="relative">
        <motion.input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          step={step}
          min={min}
          className={`w-full px-4 pt-6 pb-2 bg-white/10 dark:bg-white/5 border-2 rounded-xl backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-0 ${
            error
              ? 'border-red-400 focus:border-red-300'
              : 'border-white/20 focus:border-white/40 hover:border-white/30'
          }`}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        
        {/* Floating Label */}
        <motion.label
          onClick={handleLabelClick}
          className={`absolute left-4 cursor-text transition-all duration-300 ${
            shouldFloatLabel
              ? 'top-2 text-xs text-white/70'
              : 'top-4 text-base text-white/60'
          }`}
          animate={{
            y: shouldFloatLabel ? 0 : 0,
            scale: shouldFloatLabel ? 0.85 : 1,
            color: shouldFloatLabel 
              ? (error ? '#FCA5A5' : '#E5E7EB') 
              : '#D1D5DB'
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>

        {/* Focus Ring */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-violet-400/50 pointer-events-none"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
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

export default InputField;
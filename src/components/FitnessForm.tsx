import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap } from 'lucide-react';
import InputField from './InputField';
import Dropdown from './Dropdown';

interface FitnessData {
  weight: string;
  height: string;
  heightUnit: string;
  activityLevel: string;
  language: string;
}

interface FitnessFormProps {
  onSubmit: (data: FitnessData) => void;
  isCalculating: boolean;
}

const FitnessForm: React.FC<FitnessFormProps> = ({ onSubmit, isCalculating }) => {
  const [formData, setFormData] = useState<FitnessData>({
    weight: '',
    height: '',
    heightUnit: 'cm',
    activityLevel: '',
    language: 'English',
  });

  const [errors, setErrors] = useState<Partial<FitnessData>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'Lightly Active', label: 'Lightly Active (light exercise 1-3 days/week)' },
    { value: 'Active', label: 'Active (moderate exercise 3-5 days/week)' },
    { value: 'Very Active', label: 'Very Active (hard exercise 6-7 days/week)' },
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिंदी (Hindi)' },
  ];

  const heightUnits = [
    { value: 'cm', label: 'cm' },
    { value: 'ft', label: 'ft' },
    { value: 'inch', label: 'inch' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FitnessData> = {};
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Please select an activity level';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FitnessData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Fitness Assessment</h2>
        <p className="text-white/70">Get personalized AI-powered health insights</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Weight (kg)"
          type="number"
          value={formData.weight}
          onChange={(value) => handleInputChange('weight', value)}
          error={errors.weight}
          placeholder="Enter your weight"
          step="0.1"
          min="1"
        />

        {/* Height input with unit dropdown */}
<div className="flex flex-col sm:flex-row gap-3 relative z-[50]">

          <div className="flex-1">
            <InputField
              label="Height"
              type="number"
              value={formData.height}
              onChange={(value) => handleInputChange('height', value)}
              error={errors.height}
              placeholder="Enter your height"
              step="0.1"
              min="1"
            />
          </div>
          <div className="w-[120px] z 10">
            <Dropdown
              label="Unit"
              options={heightUnits}
              value={formData.heightUnit}
              onChange={(value) => handleInputChange('heightUnit', value)}
              isOpen={openDropdown === 'heightUnit'}
              setIsOpen={(open) => setOpenDropdown(open ? 'heightUnit' : null)}
            />
          </div>
        </div>

        <div className="relative z-10">
          <Dropdown
            label="Activity Level"
            options={activityLevels}
            value={formData.activityLevel}
            onChange={(value) => handleInputChange('activityLevel', value)}
            error={errors.activityLevel}
            placeholder="Select your activity level"
            isOpen={openDropdown === 'activity'}
            setIsOpen={(open) => setOpenDropdown(open ? 'activity' : null)}
          />
        </div>

        <div className="relative z-0">
          <Dropdown
            label="Language"
            options={languages}
            value={formData.language}
            onChange={(value) => handleInputChange('language', value)}
            placeholder="Select language"
            isOpen={openDropdown === 'language'}
            setIsOpen={(open) => setOpenDropdown(open ? 'language' : null)}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isCalculating}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-white text-lg transition-all duration-300 ${
            isCalculating
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
          whileHover={!isCalculating ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isCalculating ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center justify-center space-x-3">
            {isCalculating ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Calculate Fitness</span>
              </>
            )}
          </div>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default FitnessForm;

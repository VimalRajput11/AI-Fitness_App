import React from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  Activity, 
  Target, 
  Zap, 
  TrendingUp,
  Heart,
  Award,
  Lightbulb
} from 'lucide-react';

interface FitnessResult {
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  suggestions: string[];
}

interface ResultCardProps {
  result: FitnessResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-blue-300';
      case 'Normal weight': return 'text-green-300';
      case 'Overweight': return 'text-yellow-300';
      case 'Obese': return 'text-red-300';
      default: return 'text-white';
    }
  };

  const getBMIIcon = (category: string) => {
    switch (category) {
      case 'Underweight': return TrendingUp;
      case 'Normal weight': return Award;
      case 'Overweight': return Target;
      case 'Obese': return Heart;
      default: return Activity;
    }
  };

  const BMIIcon = getBMIIcon(result.bmiCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Results</h2>
        <p className="text-white/70">AI-powered fitness insights</p>
      </motion.div>

      {/* BMI Card */}
      <motion.div
        className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BMIIcon className={`w-6 h-6 ${getBMIColor(result.bmiCategory)}`} />
            <h3 className="text-xl font-semibold text-white">BMI Analysis</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{result.bmi}</div>
            <div className={`text-sm font-medium ${getBMIColor(result.bmiCategory)}`}>
              {result.bmiCategory}
            </div>
          </div>
        </div>
        
        {/* BMI Progress Bar */}
        <div className="relative h-2 bg-gray-600 rounded-full overflow-hidden">
          <motion.div
            className={`absolute left-0 top-0 h-full rounded-full ${
              result.bmiCategory === 'Underweight' ? 'bg-blue-400' :
              result.bmiCategory === 'Normal weight' ? 'bg-green-400' :
              result.bmiCategory === 'Overweight' ? 'bg-yellow-400' : 
              'bg-red-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(result.bmi / 40 * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Calorie Card */}
      <motion.div
        className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Daily Calories</h3>
              <p className="text-white/60 text-sm">Recommended intake</p>
            </div>
          </div>
          <div className="text-right">
            <motion.div 
              className="text-3xl font-bold text-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {result.dailyCalories.toLocaleString()}
            </motion.div>
            <div className="text-sm text-white/60">kcal/day</div>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-violet-400 rounded-full mt-2"></div>
                <p className="text-white/90 text-sm leading-relaxed">{suggestion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button
          onClick={onReset}
          className="w-full py-4 px-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-2xl font-semibold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <RotateCcw className="w-5 h-5" />
            <span>New Assessment</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;
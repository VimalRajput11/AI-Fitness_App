import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Activity } from 'lucide-react';
import FitnessForm from './components/FitnessForm';
import ResultCard from './components/ResultCard';
import { getFitnessAdvice } from './utils/gemini';

interface FitnessData {
  weight: string;
  height: string;
  heightUnit: string;
  activityLevel: string;
  language: string;
}

interface FitnessResult {
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  suggestions: string[];
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [result, setResult] = useState<FitnessResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const convertHeightToMeters = (height: number, unit: string): number => {
    if (unit === 'cm') return height / 100;
    if (unit === 'ft') return height * 0.3048;
    if (unit === 'inch') return height * 0.0254;
    return height; // fallback
  };

  const calculateFitnessData = async (data: FitnessData): Promise<FitnessResult> => {
    const weight = parseFloat(data.weight);
    const heightRaw = parseFloat(data.height);
    const heightMeters = convertHeightToMeters(heightRaw, data.heightUnit);

    const bmi = weight / (heightMeters * heightMeters);

    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    const activityMultiplier = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Active': 1.55,
      'Very Active': 1.725,
    }[data.activityLevel] || 1.2;

    const heightCm = heightMeters * 100;
    const bmr = 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * 30);
    const dailyCalories = Math.round(bmr * activityMultiplier);

    const suggestions = await getFitnessAdvice(bmi, bmiCategory, data.activityLevel, data.language);

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      dailyCalories,
      suggestions,
    };
  };

  const handleFormSubmit = async (data: FitnessData) => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const fitnessResult = await calculateFitnessData(data);
    setResult(fitnessResult);
    setIsCalculating(false);
  };

  const handleReset = () => {
    setResult(null);
    setIsCalculating(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      <div className="fixed inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 animate-gradient-x"></div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          className="p-6 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Fitness Tracker</h1>
              <p className="text-white/80 text-sm">Personalized health insights</p>
            </div>
          </div>

          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </motion.header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {!result ? (
              <FitnessForm onSubmit={handleFormSubmit} isCalculating={isCalculating} />
            ) : (
              <ResultCard result={result} onReset={handleReset} />
            )}
          </div>
        </main>

        <motion.footer
          className="p-6 text-center text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>Developed By Vimal Rajput ❤️</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;

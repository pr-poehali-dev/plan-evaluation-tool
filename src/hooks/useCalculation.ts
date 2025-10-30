import { useState, useEffect } from 'react';

export interface Calculation {
  id: string;
  plan: number;
  fact: number;
  percentage: number;
  score: number;
  date: string;
  additionalPercentage?: number;
  finalPercentage?: number;
}

export interface Indicator {
  id: string;
  name: string;
  plan: string;
  fact: string;
  percentage: number;
}

export const getScoreFromPercentage = (percentage: number): number => {
  if (percentage <= 10) return 0;
  if (percentage <= 35) return 1;
  if (percentage <= 50) return 2;
  if (percentage <= 65) return 3;
  if (percentage <= 79) return 4;
  return 5;
};

export const getScoreColor = (score: number): string => {
  const colors = [
    'from-red-500 to-red-600',
    'from-orange-500 to-orange-600',
    'from-yellow-500 to-yellow-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600'
  ];
  return colors[score] || colors[0];
};

export const getScoreLabel = (score: number): string => {
  const labels = ['Неудовлетворительно', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Очень хорошо', 'Отлично'];
  return labels[score] || labels[0];
};

export function useCalculation() {
  const [plan, setPlan] = useState<string>('');
  const [fact, setFact] = useState<string>('');
  const [result, setResult] = useState<{ percentage: number; score: number; finalPercentage?: number; additionalPercentage?: number } | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [filteredHistory, setFilteredHistory] = useState<Calculation[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setFilteredHistory(parsed);
    }
  }, []);

  const calculateScore = () => {
    const planNum = parseFloat(plan);
    const factNum = parseFloat(fact);

    if (isNaN(planNum) || isNaN(factNum) || planNum <= 0) {
      return;
    }

    const basePercentage = (factNum / planNum) * 100;
    const finalPercentage = basePercentage + averagePercentage;
    const score = getScoreFromPercentage(finalPercentage);

    setResult({ 
      percentage: basePercentage, 
      score, 
      finalPercentage,
      additionalPercentage: averagePercentage 
    });

    const newCalculation: Calculation = {
      id: Date.now().toString(),
      plan: planNum,
      fact: factNum,
      percentage: basePercentage,
      score,
      date: new Date().toLocaleString('ru-RU'),
      additionalPercentage: averagePercentage,
      finalPercentage
    };

    const updatedHistory = [newCalculation, ...history].slice(0, 20);
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
  };

  const addIndicator = () => {
    const newIndicator: Indicator = {
      id: Date.now().toString(),
      name: '',
      plan: '',
      fact: '',
      percentage: 0
    };
    setIndicators([...indicators, newIndicator]);
  };

  const removeIndicator = (id: string) => {
    setIndicators(indicators.filter(ind => ind.id !== id));
  };

  const updateIndicator = (id: string, field: 'name' | 'plan' | 'fact', value: string) => {
    setIndicators(indicators.map(ind => {
      if (ind.id === id) {
        const updated = { ...ind, [field]: value };
        if (field === 'plan' || field === 'fact') {
          const planNum = parseFloat(updated.plan);
          const factNum = parseFloat(updated.fact);
          if (!isNaN(planNum) && !isNaN(factNum) && planNum > 0) {
            updated.percentage = (factNum / planNum) * 100;
          } else {
            updated.percentage = 0;
          }
        }
        return updated;
      }
      return ind;
    }));
  };

  useEffect(() => {
    if (indicators.length === 0) {
      setAveragePercentage(0);
      return;
    }

    const validIndicators = indicators.filter(ind => {
      const planNum = parseFloat(ind.plan);
      const factNum = parseFloat(ind.fact);
      return !isNaN(planNum) && !isNaN(factNum) && planNum > 0;
    });

    if (validIndicators.length === 0) {
      setAveragePercentage(0);
      return;
    }

    const sum = validIndicators.reduce((acc, ind) => acc + ind.percentage, 0);
    setAveragePercentage(sum / validIndicators.length);
  }, [indicators]);

  const clearHistory = () => {
    setHistory([]);
    setFilteredHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  return {
    plan,
    setPlan,
    fact,
    setFact,
    result,
    history,
    filteredHistory,
    setFilteredHistory,
    indicators,
    averagePercentage,
    calculateScore,
    addIndicator,
    removeIndicator,
    updateIndicator,
    clearHistory
  };
}

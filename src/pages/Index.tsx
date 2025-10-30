import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Calculation {
  id: string;
  plan: number;
  fact: number;
  percentage: number;
  score: number;
  date: string;
}

const getScoreFromPercentage = (percentage: number): number => {
  if (percentage <= 10) return 0;
  if (percentage <= 35) return 1;
  if (percentage <= 50) return 2;
  if (percentage <= 65) return 3;
  if (percentage <= 79) return 4;
  return 5;
};

const getScoreColor = (score: number): string => {
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

const getScoreLabel = (score: number): string => {
  const labels = ['Неудовлетворительно', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Очень хорошо', 'Отлично'];
  return labels[score] || labels[0];
};

export default function Index() {
  const [plan, setPlan] = useState<string>('');
  const [fact, setFact] = useState<string>('');
  const [result, setResult] = useState<{ percentage: number; score: number } | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateScore = () => {
    const planNum = parseFloat(plan);
    const factNum = parseFloat(fact);

    if (isNaN(planNum) || isNaN(factNum) || planNum <= 0) {
      return;
    }

    const percentage = (factNum / planNum) * 100;
    const score = getScoreFromPercentage(percentage);

    setResult({ percentage, score });

    const newCalculation: Calculation = {
      id: Date.now().toString(),
      plan: planNum,
      fact: factNum,
      percentage,
      score,
      date: new Date().toLocaleString('ru-RU')
    };

    const updatedHistory = [newCalculation, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange bg-clip-text text-transparent">
            Оценка выполнения плана
          </h1>
          <p className="text-lg text-muted-foreground">
            Автоматический расчет процента выполнения и присвоение оценки
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="calculator" className="gap-2">
              <Icon name="Calculator" size={18} />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" size={18} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="animate-scale-in">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-8 shadow-xl border-2 hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Icon name="ClipboardList" size={24} className="text-primary" />
                  Данные для расчета
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="plan" className="text-base font-semibold mb-2 block">
                      План
                    </Label>
                    <Input
                      id="plan"
                      type="number"
                      placeholder="Введите плановое значение"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fact" className="text-base font-semibold mb-2 block">
                      Факт
                    </Label>
                    <Input
                      id="fact"
                      type="number"
                      placeholder="Введите фактическое значение"
                      value={fact}
                      onChange={(e) => setFact(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>

                  <Button
                    onClick={calculateScore}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-gradient-purple to-gradient-pink hover:opacity-90 transition-opacity"
                  >
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Рассчитать оценку
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Info" size={18} />
                    Шкала оценок
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>0-10%</span>
                      <span className="font-semibold">Оценка 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>11-35%</span>
                      <span className="font-semibold">Оценка 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>36-50%</span>
                      <span className="font-semibold">Оценка 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>51-65%</span>
                      <span className="font-semibold">Оценка 3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>66-79%</span>
                      <span className="font-semibold">Оценка 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>80-100%</span>
                      <span className="font-semibold">Оценка 5</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-xl border-2 hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  Результаты расчета
                </h2>

                {result ? (
                  <div className="space-y-8 animate-fade-in">
                    <div className="relative">
                      <div className="w-48 h-48 mx-auto relative">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(result.percentage / 100) * 553} 553`}
                            className="transition-all duration-1000 ease-out animate-pulse-glow"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9b87f5" />
                              <stop offset="50%" stopColor="#D946EF" />
                              <stop offset="100%" stopColor="#F97316" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <div className="text-5xl font-bold bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange bg-clip-text text-transparent">
                            {result.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl bg-gradient-to-r ${getScoreColor(result.score)} text-white text-center shadow-lg animate-scale-in`}>
                      <div className="text-6xl font-bold mb-2">{result.score}</div>
                      <div className="text-xl font-semibold">{getScoreLabel(result.score)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-sm text-muted-foreground mb-1">План</div>
                        <div className="text-2xl font-bold">{parseFloat(plan).toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-sm text-muted-foreground mb-1">Факт</div>
                        <div className="text-2xl font-bold">{parseFloat(fact).toLocaleString()}</div>
                      </div>
                    </div>

                    <Progress value={result.percentage} className="h-3" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
                    <Icon name="BarChart3" size={64} className="mb-4 opacity-20" />
                    <p className="text-lg">Введите данные и нажмите "Рассчитать оценку"</p>
                    <p className="text-sm mt-2">для получения результатов</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-scale-in">
            <Card className="p-8 shadow-xl border-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="History" size={24} className="text-primary" />
                  История расчетов
                </h2>
                {history.length > 0 && (
                  <Button variant="outline" onClick={clearHistory} className="gap-2">
                    <Icon name="Trash2" size={18} />
                    Очистить историю
                  </Button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <Icon name="FileText" size={64} className="mb-4 opacity-20" />
                  <p className="text-lg">История расчетов пуста</p>
                  <p className="text-sm mt-2">Выполните расчет в калькуляторе</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((calc, index) => (
                    <div
                      key={calc.id}
                      className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">План</div>
                          <div className="font-semibold">{calc.plan.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Факт</div>
                          <div className="font-semibold">{calc.fact.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Процент</div>
                          <div className="font-semibold">{calc.percentage.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Оценка</div>
                          <div className={`font-bold text-lg bg-gradient-to-r ${getScoreColor(calc.score)} bg-clip-text text-transparent`}>
                            {calc.score}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-1">Дата</div>
                          <div className="text-sm">{calc.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

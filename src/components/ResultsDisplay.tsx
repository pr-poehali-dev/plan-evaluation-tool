import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface ResultsDisplayProps {
  result: { percentage: number; score: number; finalPercentage?: number; additionalPercentage?: number } | null;
  plan: string;
  fact: string;
  getScoreColor: (score: number) => string;
  getScoreLabel: (score: number) => string;
}

export default function ResultsDisplay({ result, plan, fact, getScoreColor, getScoreLabel }: ResultsDisplayProps) {
  return (
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
                  strokeDasharray={`${((result.finalPercentage || result.percentage) / 100) * 553} 553`}
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
                  {(result.finalPercentage || result.percentage).toFixed(1)}%
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

          {result.additionalPercentage !== undefined && result.additionalPercentage > 0 && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Базовый процент:</span>
                  <span className="font-bold">{result.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Дополнительный:</span>
                  <span className="font-bold text-primary">+{result.additionalPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Итоговый процент:</span>
                  <span className="font-bold text-lg">{result.finalPercentage?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          <Progress value={result.finalPercentage || result.percentage} className="h-3" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
          <Icon name="BarChart3" size={64} className="mb-4 opacity-20" />
          <p className="text-lg">Введите данные и нажмите "Рассчитать оценку"</p>
          <p className="text-sm mt-2">для получения результатов</p>
        </div>
      )}
    </Card>
  );
}
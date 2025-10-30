import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useMemo } from 'react';

interface Calculation {
  id: string;
  plan: number;
  fact: number;
  percentage: number;
  score: number;
  date: string;
  additionalPercentage?: number;
  finalPercentage?: number;
}

interface StatisticsPanelProps {
  history: Calculation[];
  getScoreLabel: (score: number) => string;
  getScoreColor: (score: number) => string;
}

export default function StatisticsPanel({ history, getScoreLabel, getScoreColor }: StatisticsPanelProps) {
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        avgPercentage: 0,
        maxPercentage: 0,
        minPercentage: 0,
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        totalCalculations: 0,
        bestResult: null as Calculation | null,
        worstResult: null as Calculation | null,
        trend: 0
      };
    }

    const percentages = history.map(h => h.finalPercentage || h.percentage);
    const scores = history.map(h => h.score);

    const avgPercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const maxPercentage = Math.max(...percentages);
    const minPercentage = Math.min(...percentages);

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const bestResult = history.reduce((best, current) => {
      const currentPercent = current.finalPercentage || current.percentage;
      const bestPercent = best.finalPercentage || best.percentage;
      return currentPercent > bestPercent ? current : best;
    });

    const worstResult = history.reduce((worst, current) => {
      const currentPercent = current.finalPercentage || current.percentage;
      const worstPercent = worst.finalPercentage || worst.percentage;
      return currentPercent < worstPercent ? current : worst;
    });

    let trend = 0;
    if (history.length >= 2) {
      const recentCount = Math.min(5, history.length);
      const recent = history.slice(0, recentCount);
      const older = history.slice(recentCount, Math.min(recentCount * 2, history.length));
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, h) => sum + (h.finalPercentage || h.percentage), 0) / recent.length;
        const olderAvg = older.reduce((sum, h) => sum + (h.finalPercentage || h.percentage), 0) / older.length;
        trend = recentAvg - olderAvg;
      }
    }

    return {
      avgPercentage,
      maxPercentage,
      minPercentage,
      avgScore,
      maxScore,
      minScore,
      totalCalculations: history.length,
      bestResult,
      worstResult,
      trend
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Статистика появится после первых расчетов
        </p>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (stats.trend > 5) return { name: 'TrendingUp' as const, color: 'text-green-500', text: 'Рост' };
    if (stats.trend < -5) return { name: 'TrendingDown' as const, color: 'text-red-500', text: 'Снижение' };
    return { name: 'Minus' as const, color: 'text-yellow-500', text: 'Стабильно' };
  };

  const trendInfo = getTrendIcon();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-gradient-purple to-gradient-pink rounded-lg">
              <Icon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Средний процент</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gradient-purple to-gradient-pink bg-clip-text text-transparent">
                {stats.avgPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name={trendInfo.name} size={16} className={trendInfo.color} />
            <span className={trendInfo.color}>{trendInfo.text}</span>
            {stats.trend !== 0 && (
              <span className="text-muted-foreground">
                {Math.abs(stats.trend).toFixed(1)}%
              </span>
            )}
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Icon name="Award" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Максимум</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.maxPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Оценка: {getScoreLabel(stats.maxScore)}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Icon name="AlertCircle" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Минимум</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.minPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Оценка: {getScoreLabel(stats.minScore)}
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-gradient-pink to-gradient-orange rounded-lg">
              <Icon name="Star" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Лучший результат</p>
              <p className={`text-xl font-bold bg-gradient-to-r ${getScoreColor(stats.bestResult?.score || 0)} bg-clip-text text-transparent`}>
                {getScoreLabel(stats.bestResult?.score || 0)}
              </p>
            </div>
          </div>
          {stats.bestResult && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">План:</span>
                <span className="font-medium">{stats.bestResult.plan.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Факт:</span>
                <span className="font-medium">{stats.bestResult.fact.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Процент:</span>
                <span className="font-medium text-green-600">
                  {(stats.bestResult.finalPercentage || stats.bestResult.percentage).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span className="font-medium">{stats.bestResult.date}</span>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Худший результат</p>
              <p className={`text-xl font-bold bg-gradient-to-r ${getScoreColor(stats.worstResult?.score || 0)} bg-clip-text text-transparent`}>
                {getScoreLabel(stats.worstResult?.score || 0)}
              </p>
            </div>
          </div>
          {stats.worstResult && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">План:</span>
                <span className="font-medium">{stats.worstResult.plan.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Факт:</span>
                <span className="font-medium">{stats.worstResult.fact.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Процент:</span>
                <span className="font-medium text-orange-600">
                  {(stats.worstResult.finalPercentage || stats.worstResult.percentage).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span className="font-medium">{stats.worstResult.date}</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Calculator" size={20} className="text-gradient-purple" />
              <p className="text-sm text-muted-foreground">Всего расчетов</p>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gradient-purple to-gradient-pink bg-clip-text text-transparent">
              {stats.totalCalculations}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="BarChart2" size={20} className="text-gradient-pink" />
              <p className="text-sm text-muted-foreground">Средняя оценка</p>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gradient-pink to-gradient-orange bg-clip-text text-transparent">
              {stats.avgScore.toFixed(1)}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Target" size={20} className="text-gradient-orange" />
              <p className="text-sm text-muted-foreground">Диапазон оценок</p>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gradient-orange to-gradient-purple bg-clip-text text-transparent">
              {stats.minScore} - {stats.maxScore}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

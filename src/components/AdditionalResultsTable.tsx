import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Indicator {
  id: string;
  name: string;
  plan: string;
  fact: string;
  percentage: number;
}

interface AdditionalResultsTableProps {
  indicators: Indicator[];
  averagePercentage: number;
  employeeCount: string;
  distributedPercentage: number;
}

export default function AdditionalResultsTable({
  indicators,
  averagePercentage,
  employeeCount,
  distributedPercentage
}: AdditionalResultsTableProps) {
  if (indicators.length === 0) return null;

  return (
    <Card className="p-8 shadow-xl border-2 hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="Table" size={24} className="text-primary" />
        Детализация показателей
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Показатель</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">План</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Факт</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Процент</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator, index) => (
              <tr 
                key={indicator.id} 
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  index % 2 === 0 ? 'bg-muted/10' : ''
                }`}
              >
                <td className="py-3 px-4 font-medium">{indicator.name || `Показатель ${index + 1}`}</td>
                <td className="text-right py-3 px-4">{parseFloat(indicator.plan).toLocaleString()}</td>
                <td className="text-right py-3 px-4">{parseFloat(indicator.fact).toLocaleString()}</td>
                <td className="text-right py-3 px-4">
                  <span className={`font-bold ${
                    indicator.percentage >= 100 ? 'text-green-600' :
                    indicator.percentage >= 80 ? 'text-blue-600' :
                    indicator.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {indicator.percentage.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Средний процент</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-gradient-purple to-gradient-pink bg-clip-text text-transparent">
                {averagePercentage.toFixed(1)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">По {indicators.length} показател{indicators.length === 1 ? 'ю' : 'ям'}</div>
              <div className="text-sm text-muted-foreground">
                Σ = {indicators.reduce((sum, ind) => sum + ind.percentage, 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {parseFloat(employeeCount) > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Icon name="Users" size={14} />
                  Сотрудников
                </div>
                <div className="text-xl font-bold">{employeeCount}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Формула</div>
                <div className="text-sm font-mono bg-white/50 px-2 py-1 rounded">
                  {averagePercentage.toFixed(1)}% ÷ {employeeCount}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">На каждого</div>
                <div className="text-2xl font-bold text-blue-600">
                  {distributedPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            {parseFloat(employeeCount) > 0 
              ? `Распределенный процент (${distributedPercentage.toFixed(2)}%) учитывается в итоговом расчете оценки`
              : 'Средний процент учитывается в итоговом расчете оценки'
            }
          </p>
        </div>
      </div>
    </Card>
  );
}

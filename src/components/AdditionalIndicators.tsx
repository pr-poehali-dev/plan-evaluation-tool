import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Indicator {
  id: string;
  name: string;
  plan: string;
  fact: string;
  percentage: number;
}

interface AdditionalIndicatorsProps {
  indicators: Indicator[];
  onAddIndicator: () => void;
  onRemoveIndicator: (id: string) => void;
  onUpdateIndicator: (id: string, field: 'name' | 'plan' | 'fact', value: string) => void;
  averagePercentage: number;
  employeeCount: string;
  onEmployeeCountChange: (value: string) => void;
  distributedPercentage: number;
}

export default function AdditionalIndicators({
  indicators,
  onAddIndicator,
  onRemoveIndicator,
  onUpdateIndicator,
  averagePercentage,
  employeeCount,
  onEmployeeCountChange,
  distributedPercentage
}: AdditionalIndicatorsProps) {
  return (
    <Card className="p-8 shadow-xl border-2 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="ListPlus" size={24} className="text-primary" />
          Дополнительные показатели
        </h2>
        <Button
          onClick={onAddIndicator}
          variant="outline"
          className="gap-2"
        >
          <Icon name="Plus" size={18} />
          Добавить
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {indicators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-20" />
            <p>Нет дополнительных показателей</p>
            <p className="text-sm mt-1">Нажмите "Добавить" для создания</p>
          </div>
        ) : (
          indicators.map((indicator) => (
            <div key={indicator.id} className="p-4 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Название
                  </label>
                  <Input
                    placeholder="Показатель"
                    value={indicator.name}
                    onChange={(e) => onUpdateIndicator(indicator.id, 'name', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    План
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={indicator.plan}
                    onChange={(e) => onUpdateIndicator(indicator.id, 'plan', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Факт
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={indicator.fact}
                    onChange={(e) => onUpdateIndicator(indicator.id, 'fact', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-center p-2 bg-primary/10 rounded">
                    <div className="text-xs text-muted-foreground">Процент</div>
                    <div className="font-bold text-sm">
                      {indicator.percentage > 0 ? `${indicator.percentage.toFixed(1)}%` : '—'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveIndicator(indicator.id)}
                    className="h-9 w-9 p-0"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {indicators.length > 0 && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Средний процент выполнения</div>
                <div className="text-xs text-muted-foreground">
                  По {indicators.length} показател{indicators.length === 1 ? 'ю' : 'ям'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-gradient-purple to-gradient-pink bg-clip-text text-transparent">
                  {averagePercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    Количество сотрудников
                  </label>
                  <Input
                    type="number"
                    placeholder="Введите количество"
                    min="1"
                    value={employeeCount}
                    onChange={(e) => onEmployeeCountChange(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">На каждого сотрудника</div>
                  <div className="h-10 px-3 bg-primary/10 rounded-md flex items-center justify-center border">
                    <span className="font-bold text-lg">
                      {distributedPercentage > 0 ? `${distributedPercentage.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>
              {parseFloat(employeeCount) > 0 && (
                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="Calculator" size={14} />
                  {averagePercentage.toFixed(1)}% ÷ {employeeCount} = {distributedPercentage.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
          <p>
            Средний процент будет добавлен к основному расчету для более точной оценки выполнения плана
          </p>
        </div>
      </div>
    </Card>
  );
}
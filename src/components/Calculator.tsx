import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CalculatorProps {
  plan: string;
  fact: string;
  onPlanChange: (value: string) => void;
  onFactChange: (value: string) => void;
  onCalculate: () => void;
}

export default function Calculator({ plan, fact, onPlanChange, onFactChange, onCalculate }: CalculatorProps) {
  return (
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
            onChange={(e) => onPlanChange(e.target.value)}
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
            onChange={(e) => onFactChange(e.target.value)}
            className="text-lg h-12"
          />
        </div>

        <Button
          onClick={onCalculate}
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
  );
}

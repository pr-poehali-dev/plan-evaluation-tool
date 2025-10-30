import { Card } from '@/components/ui/card';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HistoryItem {
  id: string;
  date: string;
  percentage: number;
  finalPercentage?: number;
}

interface PerformanceChartProps {
  history: HistoryItem[];
}

export default function PerformanceChart({ history }: PerformanceChartProps) {
  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Пока нет данных для отображения графика. Выполните несколько расчетов, чтобы увидеть динамику.
        </p>
      </Card>
    );
  }

  const chartData = history
    .slice()
    .reverse()
    .map((item) => ({
      date: format(new Date(item.date), 'dd MMM', { locale: ru }),
      fullDate: format(new Date(item.date), 'dd MMMM yyyy, HH:mm', { locale: ru }),
      базовый: Math.round(item.percentage * 10) / 10,
      итоговый: item.finalPercentage ? Math.round(item.finalPercentage * 10) / 10 : Math.round(item.percentage * 10) / 10,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">{payload[0].payload.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange bg-clip-text text-transparent">
          График динамики выполнения
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFinal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: '%', position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="базовый"
              stroke="#9b87f5"
              strokeWidth={2}
              fill="url(#colorBase)"
            />
            <Area
              type="monotone"
              dataKey="итоговый"
              stroke="#F97316"
              strokeWidth={3}
              fill="url(#colorFinal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange bg-clip-text text-transparent">
          Тренд выполнения плана
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: '%', position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="базовый"
              stroke="#9b87f5"
              strokeWidth={2}
              dot={{ fill: '#9b87f5', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="итоговый"
              stroke="#F97316"
              strokeWidth={3}
              dot={{ fill: '#F97316', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

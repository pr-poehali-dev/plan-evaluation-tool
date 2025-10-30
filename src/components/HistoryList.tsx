import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Calculation {
  id: string;
  plan: number;
  fact: number;
  percentage: number;
  score: number;
  date: string;
}

interface HistoryListProps {
  history: Calculation[];
  onClearHistory: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onExportDetailedReport?: () => void;
  getScoreColor: (score: number) => string;
}

export default function HistoryList({ history, onClearHistory, onExportCSV, onExportPDF, onExportDetailedReport, getScoreColor }: HistoryListProps) {
  return (
    <Card className="p-8 shadow-xl border-2">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="History" size={24} className="text-primary" />
          История расчетов
        </h2>
        {history.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {onExportDetailedReport && (
              <Button onClick={onExportDetailedReport} className="gap-2 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange hover:opacity-90">
                <Icon name="FileBarChart" size={18} />
                Отчет
              </Button>
            )}
            <Button variant="outline" onClick={onExportCSV} className="gap-2">
              <Icon name="FileSpreadsheet" size={18} />
              Excel
            </Button>
            <Button variant="outline" onClick={onExportPDF} className="gap-2">
              <Icon name="FileText" size={18} />
              PDF
            </Button>
            <Button variant="outline" onClick={onClearHistory} className="gap-2">
              <Icon name="Trash2" size={18} />
              Очистить
            </Button>
          </div>
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
  );
}
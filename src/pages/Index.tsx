import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Calculator from '@/components/Calculator';
import ResultsDisplay from '@/components/ResultsDisplay';
import HistoryList from '@/components/HistoryList';
import SettingsPanel from '@/components/SettingsPanel';
import AdditionalIndicators from '@/components/AdditionalIndicators';
import PerformanceChart from '@/components/PerformanceChart';

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

interface Indicator {
  id: string;
  name: string;
  plan: string;
  fact: string;
  percentage: number;
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
  const [result, setResult] = useState<{ percentage: number; score: number; finalPercentage?: number; additionalPercentage?: number } | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [averagePercentage, setAveragePercentage] = useState(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedReminderTime = localStorage.getItem('reminderTime');
    if (savedReminderTime) {
      setReminderTime(savedReminderTime);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
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
    localStorage.removeItem('calculationHistory');
  };

  const exportToCSV = () => {
    if (history.length === 0) return;

    const headers = ['План', 'Факт', 'Процент выполнения', 'Оценка', 'Дата'];
    const rows = history.map(calc => [
      calc.plan,
      calc.fact,
      `${calc.percentage.toFixed(1)}%`,
      calc.score,
      calc.date
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `история_расчетов_${new Date().toLocaleDateString('ru-RU')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (history.length === 0) return;

    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('История расчетов выполнения плана', 14, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}`, 14, 28);

    const tableData = history.map(calc => [
      calc.plan.toLocaleString(),
      calc.fact.toLocaleString(),
      `${calc.percentage.toFixed(1)}%`,
      calc.score.toString(),
      getScoreLabel(calc.score),
      calc.date
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['План', 'Факт', 'Процент', 'Оценка', 'Результат', 'Дата']],
      body: tableData,
      theme: 'grid',
      styles: { 
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [155, 135, 245],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'right' },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'left' },
        5: { halign: 'left' }
      }
    });

    doc.save(`история_расчетов_${new Date().toLocaleDateString('ru-RU')}.pdf`);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Ваш браузер не поддерживает уведомления');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      scheduleReminder();
      new Notification('Уведомления включены!', {
        body: 'Вы будете получать напоминания о проверке плана',
        icon: '/icon-192.png'
      });
    }
  };

  const scheduleReminder = () => {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Время проверить план!', {
          body: 'Не забудьте оценить выполнение запланированных задач',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: 'plan-reminder'
        });
        scheduleReminder();
      }
    }, timeUntilReminder);
  };

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
    if (notificationsEnabled) {
      scheduleReminder();
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
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
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="calculator" className="gap-2">
              <Icon name="Calculator" size={18} />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" size={18} />
              История
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Settings" size={18} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="animate-scale-in">
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Calculator
                  plan={plan}
                  fact={fact}
                  onPlanChange={setPlan}
                  onFactChange={setFact}
                  onCalculate={calculateScore}
                />
                <ResultsDisplay
                  result={result}
                  plan={plan}
                  fact={fact}
                  getScoreColor={getScoreColor}
                  getScoreLabel={getScoreLabel}
                />
              </div>
              
              <AdditionalIndicators
                indicators={indicators}
                onAddIndicator={addIndicator}
                onRemoveIndicator={removeIndicator}
                onUpdateIndicator={updateIndicator}
                averagePercentage={averagePercentage}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-scale-in space-y-8">
            <PerformanceChart history={history} />
            <HistoryList
              history={history}
              onClearHistory={clearHistory}
              onExportCSV={exportToCSV}
              onExportPDF={exportToPDF}
              getScoreColor={getScoreColor}
            />
          </TabsContent>

          <TabsContent value="settings" className="animate-scale-in">
            <SettingsPanel
              notificationsEnabled={notificationsEnabled}
              reminderTime={reminderTime}
              onRequestNotificationPermission={requestNotificationPermission}
              onReminderTimeChange={handleReminderTimeChange}
              onDisableNotifications={disableNotifications}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
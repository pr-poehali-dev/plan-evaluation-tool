import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Calculator from '@/components/Calculator';
import ResultsDisplay from '@/components/ResultsDisplay';
import AdditionalResultsTable from '@/components/AdditionalResultsTable';
import HistoryList from '@/components/HistoryList';
import SettingsPanel from '@/components/SettingsPanel';
import AdditionalIndicators from '@/components/AdditionalIndicators';
import PerformanceChart from '@/components/PerformanceChart';
import StatisticsPanel from '@/components/StatisticsPanel';
import HistoryFilters from '@/components/HistoryFilters';
import { useCalculation, getScoreColor, getScoreLabel } from '@/hooks/useCalculation';
import { useNotifications } from '@/hooks/useNotifications';
import { exportToCSV, exportToPDF, exportDetailedReport } from '@/utils/exportUtils';
import { applyFilters } from '@/utils/filterUtils';

export default function Index() {
  const {
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
    employeeCount,
    setEmployeeCount,
    distributedPercentage,
    calculateScore,
    addIndicator,
    removeIndicator,
    updateIndicator,
    clearHistory
  } = useCalculation();

  const {
    notificationsEnabled,
    reminderTime,
    requestNotificationPermission,
    handleReminderTimeChange,
    disableNotifications
  } = useNotifications();

  const handleFilterChange = (filters: any) => {
    const filtered = applyFilters(history, filters);
    setFilteredHistory(filtered);
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
                employeeCount={employeeCount}
                onEmployeeCountChange={setEmployeeCount}
                distributedPercentage={distributedPercentage}
              />

              <AdditionalResultsTable
                indicators={indicators}
                averagePercentage={averagePercentage}
                employeeCount={employeeCount}
                distributedPercentage={distributedPercentage}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-scale-in space-y-8">
            <StatisticsPanel 
              history={history}
              getScoreLabel={getScoreLabel}
              getScoreColor={getScoreColor}
            />
            <PerformanceChart history={history} />
            <HistoryFilters onFilterChange={handleFilterChange} />
            <HistoryList
              history={filteredHistory}
              onClearHistory={clearHistory}
              onExportCSV={() => exportToCSV(history)}
              onExportPDF={() => exportToPDF(history)}
              onExportDetailedReport={() => exportDetailedReport(history)}
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
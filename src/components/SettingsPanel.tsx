import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SettingsPanelProps {
  notificationsEnabled: boolean;
  reminderTime: string;
  onRequestNotificationPermission: () => void;
  onReminderTimeChange: (time: string) => void;
  onDisableNotifications: () => void;
}

export default function SettingsPanel({
  notificationsEnabled,
  reminderTime,
  onRequestNotificationPermission,
  onReminderTimeChange,
  onDisableNotifications
}: SettingsPanelProps) {
  return (
    <Card className="p-8 shadow-xl border-2 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="Settings" size={24} className="text-primary" />
        Настройки
      </h2>

      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100">
          <div className="flex items-start gap-4">
            <Icon name="Bell" size={24} className="text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Push-уведомления</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Получайте напоминания о проверке выполнения плана
              </p>
              
              {notificationsEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Icon name="CheckCircle" size={20} />
                    <span className="font-semibold">Уведомления включены</span>
                  </div>
                  
                  <div>
                    <Label htmlFor="reminderTime" className="text-sm font-semibold mb-2 block">
                      Время напоминания
                    </Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => onReminderTimeChange(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={onDisableNotifications}
                    className="gap-2"
                  >
                    <Icon name="BellOff" size={18} />
                    Отключить уведомления
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onRequestNotificationPermission}
                  className="bg-gradient-to-r from-gradient-purple to-gradient-pink hover:opacity-90 transition-opacity gap-2"
                >
                  <Icon name="Bell" size={18} />
                  Включить уведомления
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-4">
            <Icon name="Info" size={24} className="text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">О приложении</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Приложение для автоматического расчета процента выполнения плана и присвоения оценки по шкале от 0 до 5.</p>
                <p className="font-semibold mt-4">Возможности:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Расчет процента выполнения</li>
                  <li>Автоматическое присвоение оценки</li>
                  <li>История всех расчетов</li>
                  <li>Экспорт в Excel и PDF</li>
                  <li>Push-уведомления</li>
                  <li>Работает офлайн</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

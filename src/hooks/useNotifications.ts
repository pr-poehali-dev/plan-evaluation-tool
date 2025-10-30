import { useState, useEffect } from 'react';

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');

  useEffect(() => {
    const savedReminderTime = localStorage.getItem('reminderTime');
    if (savedReminderTime) {
      setReminderTime(savedReminderTime);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

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

  return {
    notificationsEnabled,
    reminderTime,
    requestNotificationPermission,
    handleReminderTimeChange,
    disableNotifications
  };
}

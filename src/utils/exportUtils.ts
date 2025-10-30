import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Calculation } from '@/hooks/useCalculation';

export const getScoreLabel = (score: number): string => {
  const labels = ['Неудовлетворительно', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Очень хорошо', 'Отлично'];
  return labels[score] || labels[0];
};

export const exportToCSV = (history: Calculation[]) => {
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

export const exportToPDF = (history: Calculation[]) => {
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

export const exportDetailedReport = (history: Calculation[]) => {
  if (history.length === 0) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Подробный отчет выполнения плана', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Дата формирования: ${new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, 28, { align: 'center' });

  const percentages = history.map(h => h.finalPercentage || h.percentage);
  const scores = history.map(h => h.score);
  const avgPercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const maxPercentage = Math.max(...percentages);
  const minPercentage = Math.min(...percentages);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  doc.setFillColor(155, 135, 245);
  doc.rect(14, 35, pageWidth - 28, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Ключевые показатели', 18, 41);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const statsY = 52;
  const statsData = [
    ['Всего расчетов:', history.length.toString()],
    ['Средний процент выполнения:', `${avgPercentage.toFixed(1)}%`],
    ['Максимальное выполнение:', `${maxPercentage.toFixed(1)}%`],
    ['Минимальное выполнение:', `${minPercentage.toFixed(1)}%`],
    ['Средняя оценка:', avgScore.toFixed(2)]
  ];

  let currentY = statsY;
  statsData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 18, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 120, currentY);
    currentY += 7;
  });

  currentY += 5;

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

  doc.setFillColor(34, 197, 94);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Лучший результат', 18, currentY + 5.5);
  currentY += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Дата: ${bestResult.date}`, 18, currentY);
  currentY += 5;
  doc.text(`План: ${bestResult.plan.toLocaleString()} | Факт: ${bestResult.fact.toLocaleString()}`, 18, currentY);
  currentY += 5;
  doc.text(`Процент: ${(bestResult.finalPercentage || bestResult.percentage).toFixed(1)}% | Оценка: ${getScoreLabel(bestResult.score)}`, 18, currentY);
  currentY += 8;

  doc.setFillColor(249, 115, 22);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Худший результат', 18, currentY + 5.5);
  currentY += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Дата: ${worstResult.date}`, 18, currentY);
  currentY += 5;
  doc.text(`План: ${worstResult.plan.toLocaleString()} | Факт: ${worstResult.fact.toLocaleString()}`, 18, currentY);
  currentY += 5;
  doc.text(`Процент: ${(worstResult.finalPercentage || worstResult.percentage).toFixed(1)}% | Оценка: ${getScoreLabel(worstResult.score)}`, 18, currentY);
  currentY += 10;

  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(155, 135, 245);
  doc.rect(14, currentY, pageWidth - 28, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Детальная история расчетов', 18, currentY + 6.5);
  currentY += 12;

  const tableData = history.map(calc => [
    calc.plan.toLocaleString(),
    calc.fact.toLocaleString(),
    `${(calc.finalPercentage || calc.percentage).toFixed(1)}%`,
    calc.score.toString(),
    getScoreLabel(calc.score),
    calc.date
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['План', 'Факт', 'Итог %', 'Оценка', 'Результат', 'Дата']],
    body: tableData,
    theme: 'grid',
    styles: { 
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [155, 135, 245],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    columnStyles: {
      0: { halign: 'right', cellWidth: 25 },
      1: { halign: 'right', cellWidth: 25 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'left', cellWidth: 40 },
      5: { halign: 'left', cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY + 20;
  
  if (finalY < 270) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Сформировано автоматически системой оценки выполнения плана', pageWidth / 2, 285, { align: 'center' });
  }

  doc.save(`подробный_отчет_${new Date().toLocaleDateString('ru-RU')}.pdf`);
};

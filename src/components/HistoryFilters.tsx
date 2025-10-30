import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface HistoryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  scoreFilter: string;
  dateFrom: string;
  dateTo: string;
  percentageMin: string;
  percentageMax: string;
}

export default function HistoryFilters({ onFilterChange }: HistoryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    scoreFilter: 'all',
    dateFrom: '',
    dateTo: '',
    percentageMin: '',
    percentageMax: ''
  });

  const handleFilterUpdate = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: FilterState = {
      scoreFilter: 'all',
      dateFrom: '',
      dateTo: '',
      percentageMin: '',
      percentageMax: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = filters.scoreFilter !== 'all' || 
                           filters.dateFrom !== '' || 
                           filters.dateTo !== '' ||
                           filters.percentageMin !== '' ||
                           filters.percentageMax !== '';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-gradient-purple" />
          <h3 className="text-lg font-semibold">Фильтры</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
            <Icon name="X" size={16} />
            Сбросить
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score-filter" className="text-sm font-medium">
            Оценка
          </Label>
          <Select value={filters.scoreFilter} onValueChange={(value) => handleFilterUpdate('scoreFilter', value)}>
            <SelectTrigger id="score-filter">
              <SelectValue placeholder="Все оценки" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все оценки</SelectItem>
              <SelectItem value="5">5 - Отлично</SelectItem>
              <SelectItem value="4">4 - Очень хорошо</SelectItem>
              <SelectItem value="3">3 - Хорошо</SelectItem>
              <SelectItem value="2">2 - Удовлетворительно</SelectItem>
              <SelectItem value="1">1 - Плохо</SelectItem>
              <SelectItem value="0">0 - Неудовлетворительно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-from" className="text-sm font-medium">
            Дата от
          </Label>
          <Input
            id="date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterUpdate('dateFrom', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-to" className="text-sm font-medium">
            Дата до
          </Label>
          <Input
            id="date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterUpdate('dateTo', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="percentage-min" className="text-sm font-medium">
            Процент от
          </Label>
          <Input
            id="percentage-min"
            type="number"
            placeholder="0"
            min="0"
            max="100"
            value={filters.percentageMin}
            onChange={(e) => handleFilterUpdate('percentageMin', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="percentage-max" className="text-sm font-medium">
            Процент до
          </Label>
          <Input
            id="percentage-max"
            type="number"
            placeholder="100"
            min="0"
            max="100"
            value={filters.percentageMax}
            onChange={(e) => handleFilterUpdate('percentageMax', e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-gradient-to-r from-gradient-purple/10 via-gradient-pink/10 to-gradient-orange/10 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Info" size={16} className="text-gradient-purple" />
            <span className="text-muted-foreground">
              Применены фильтры - показаны только соответствующие записи
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

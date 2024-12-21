import React from 'react';
import { useTrip } from '@/contexts/TripContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MapPin, Clock, DollarSign, Calendar } from 'lucide-react';

export const TripStats = () => {
  const { state } = useTrip();
  const { currentTrip } = state;

  if (!currentTrip) return null;

  const budgetData = currentTrip.budget.reduce((acc, item) => {
    const existing = acc.find((x) => x.category === item.category);
    if (existing) {
      existing.amount += item.amount;
    } else {
      acc.push({ category: item.category, amount: item.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  const numberOfStops = currentTrip.stats?.numberOfStops ?? 0;
  const progressValue = Math.min((numberOfStops / 20) * 100, 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberOfStops}</div>
          <Progress
            value={progressValue}
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(currentTrip.stats.totalDuration / 60)}h
          </div>
          <p className="text-xs text-muted-foreground">
            {currentTrip.stats.totalDuration} minutes total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${currentTrip.stats.totalCost.toFixed(2)}
          </div>
          <Progress
            value={(currentTrip.stats.totalCost / 1000) * 100}
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trip Length</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentTrip.days.length} days</div>
          <p className="text-xs text-muted-foreground">
            {new Date(currentTrip.startDate).toLocaleDateString()} -{' '}
            {new Date(currentTrip.endDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
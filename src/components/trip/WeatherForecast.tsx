import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrip } from '@/contexts/TripContext';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

const weatherIcons: Record<string, React.ReactNode> = {
  clear: <Sun className="h-6 w-6 text-yellow-500" />,
  clouds: <Cloud className="h-6 w-6 text-gray-500" />,
  rain: <CloudRain className="h-6 w-6 text-blue-500" />,
  snow: <CloudSnow className="h-6 w-6 text-blue-200" />,
  thunderstorm: <CloudLightning className="h-6 w-6 text-purple-500" />,
};

export const WeatherForecast = () => {
  const { state } = useTrip();
  const { currentTrip } = state;

  if (!currentTrip) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weather Forecast</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentTrip.days.map((day) => (
          <Card key={day.date}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </CardTitle>
              {day.weather && weatherIcons[day.weather.condition]}
            </CardHeader>
            <CardContent>
              {day.weather ? (
                <>
                  <div className="text-2xl font-bold">
                    {Math.round(day.weather.temperature)}°C
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {day.weather.condition}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weather data available
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

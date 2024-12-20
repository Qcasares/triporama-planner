import React from 'react';
import { MapContainer } from '@/components/MapContainer';
import { Sidebar } from '@/components/Sidebar';
import { TripProvider } from '@/contexts/TripContext';
import { TripStats } from '@/components/trip/TripStats';
import { TripShare } from '@/components/trip/TripShare';
import { WeatherForecast } from '@/components/trip/WeatherForecast';
import { PackingList } from '@/components/trip/PackingList';
import { CurrencyConverter } from '@/components/trip/CurrencyConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageWrapper, GlassCard } from '@/components/ui/layout';
import { motion, AnimatePresence } from 'framer-motion';

export const TripPlanner = () => {
  const [activeTab, setActiveTab] = React.useState('map');

  return (
    <TripProvider>
      <PageWrapper>
        <div className="flex h-screen overflow-hidden" data-testid="trip-planner">
          <Sidebar className="w-80 shrink-0 border-r border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
          
          <main className="flex-1 overflow-hidden bg-muted/10">
            <div className="h-full p-6 grid grid-rows-[auto,1fr] gap-6">
              <GlassCard>
                <TripShare data-testid="share-trip-button" />
              </GlassCard>
              
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full space-y-6"
                data-testid="tab-content"
              >
                <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground">
                  <TabsTrigger
                    value="map"
                    data-testid="map-tab"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value="stats" data-testid="stats-tab">Statistics</TabsTrigger>
                  <TabsTrigger value="weather" data-testid="weather-tab">Weather</TabsTrigger>
                  <TabsTrigger value="tools" data-testid="tools-tab">Travel Tools</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-[calc(100%-3rem)]"
                  >
                    <TabsContent
                      value="map"
                      className="h-full mt-0 border-none p-0 outline-none"
                    >
                      <GlassCard className="h-full">
                        <MapContainer data-testid="map-container" />
                      </GlassCard>
                    </TabsContent>

                    <TabsContent
                      value="stats"
                      className="h-full mt-0 border-none outline-none"
                    >
                      <ScrollArea className="h-full rounded-xl">
                        <div className="p-6">
                          <TripStats data-testid="trip-stats" />
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="weather"
                      className="h-full mt-0 border-none outline-none"
                    >
                      <ScrollArea className="h-full rounded-xl">
                        <div className="p-6">
                          <WeatherForecast data-testid="weather-forecast" />
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="tools"
                      className="h-full mt-0 border-none outline-none"
                    >
                      <ScrollArea className="h-full rounded-xl">
                        <div className="p-6 space-y-6">
                          <PackingList data-testid="packing-list" />
                          <CurrencyConverter data-testid="currency-converter" />
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
          </main>
        </div>
      </PageWrapper>
    </TripProvider>
  );
};
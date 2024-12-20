import React, { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { PackingItem } from '@/types/trip';

export const PackingList = () => {
  const { state } = useTrip();
  const { currentTrip } = state;
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Essentials');
  const [packingItems, setPackingItems] = useState<PackingItem[]>(
    currentTrip?.packingList?.flatMap(category => 
      category.items.map(item => ({
        id: item.id,
        name: item.name,
        checked: item.checked,
        category: category.category
      }))
    ) || []
  );

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    setPackingItems([
      ...packingItems,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newItem.trim(),
        checked: false,
        category: selectedCategory,
      },
    ]);
    setNewItem('');
  };

  const handleRemoveItem = (id: string) => {
    setPackingItems(packingItems.filter((item) => item.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setPackingItems(
      packingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const groupedItems = packingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {['Essentials', 'Clothing', 'Electronics', 'Toiletries', 'Documents'].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Add item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button type="submit" size="icon" onClick={handleAddItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {category}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => handleToggleItem(item.id)}
                        />
                        <span
                          className={`text-sm ${
                            item.checked ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {packingItems.filter((item) => item.checked).length} of{' '}
              {packingItems.length} packed
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPackingItems([])}
              className="text-destructive"
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Trip } from '@/types/trip';

export const mockTrip: Trip = {
  id: '1',
  title: 'Europe Adventure 2024',
  description: 'A 2-week journey through Europe',
  startDate: '2024-06-01',
  endDate: '2024-06-14',
  days: [
    {
      date: '2024-06-01',
      locations: [
        {
          id: '1',
          name: 'Eiffel Tower',
          address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          lat: 48.8584,
          lng: 2.2945,
          type: 'attraction',
          startTime: '09:00',
          endTime: '11:00',
          notes: 'Get there early to avoid crowds',
        },
        {
          id: '2',
          name: 'Louvre Museum',
          address: 'Rue de Rivoli, 75001 Paris, France',
          lat: 48.8606,
          lng: 2.3376,
          type: 'museum',
          startTime: '13:00',
          endTime: '17:00',
          notes: 'Book tickets in advance',
        },
      ],
    },
    {
      date: '2024-06-02',
      locations: [
        {
          id: '3',
          name: 'Notre-Dame Cathedral',
          address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
          lat: 48.8530,
          lng: 2.3499,
          type: 'attraction',
          startTime: '10:00',
          endTime: '12:00',
          notes: 'Currently under renovation',
        },
      ],
    },
  ],
  budget: [
    {
      id: '1',
      category: 'Accommodation',
      amount: 1500,
      currency: 'EUR',
      notes: 'Hotels in Paris',
    },
    {
      id: '2',
      category: 'Transportation',
      amount: 800,
      currency: 'EUR',
      notes: 'Train tickets and metro passes',
    },
    {
      id: '3',
      category: 'Food',
      amount: 1000,
      currency: 'EUR',
      notes: 'Restaurants and cafes',
    },
    {
      id: '4',
      category: 'Activities',
      amount: 700,
      currency: 'EUR',
      notes: 'Museum tickets and tours',
    },
  ],
  collaborators: [
    {
      id: '1',
      email: 'john@example.com',
      role: 'editor',
      status: 'accepted',
    },
    {
      id: '2',
      email: 'jane@example.com',
      role: 'viewer',
      status: 'pending',
    },
  ],
  stats: {
    numberOfStops: 3,
    totalDistance: 15.2,
    totalDuration: '8 hours',
    totalBudget: 4000,
    totalCost: 4000,
  },
  weather: [
    {
      date: '2024-06-01',
      temperature: 22,
      condition: 'sunny',
      precipitation: 0,
      humidity: 65,
    },
    {
      date: '2024-06-02',
      temperature: 20,
      condition: 'partly-cloudy',
      precipitation: 20,
      humidity: 70,
    },
  ],
  packingList: [
    {
      id: '1',
      category: 'Essentials',
      items: [
        { id: '1', name: 'Passport', checked: true },
        { id: '2', name: 'Travel Insurance', checked: true },
        { id: '3', name: 'Credit Cards', checked: false },
      ],
    },
    {
      id: '2',
      category: 'Clothing',
      items: [
        { id: '4', name: 'Walking Shoes', checked: false },
        { id: '5', name: 'Rain Jacket', checked: false },
      ],
    },
  ],
};

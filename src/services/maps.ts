export const getLocationDetails = async (latitude: number, longitude: number): Promise<{
  formatted_address: string;
  lat: number;
  lng: number;
}> => {
  const apiKey = localStorage.getItem('googleMapsApiKey');
  if (!apiKey) {
    throw new Error('Google Maps API key not found');
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
  );
  const data = await response.json();

  if (!data.results?.[0]) {
    throw new Error('No location details found');
  }

  return {
    formatted_address: data.results[0].formatted_address,
    lat: latitude,
    lng: longitude,
  };
};

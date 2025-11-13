// Hebrew country names service
export interface CountryInfo {
  code: string;
  name: string;
  hebrewName: string;
  center: [number, number]; // [lat, lng]
  bounds?: [[number, number], [number, number]]; // [[south, west], [north, east]]
}

// Common countries and their Hebrew names with geographical centers
export const COUNTRIES: CountryInfo[] = [
  {
    code: 'IL',
    name: 'Israel',
    hebrewName: 'ישראל',
    center: [31.5, 34.8],
    bounds: [[29.5, 34.2], [33.4, 35.9]]
  },
  {
    code: 'PS',
    name: 'Palestine',
    hebrewName: 'פלסטין',
    center: [31.9, 35.2],
    bounds: [[31.2, 34.2], [32.5, 35.6]]
  },
  {
    code: 'LB',
    name: 'Lebanon',
    hebrewName: 'לבנון',
    center: [33.8, 35.8],
    bounds: [[33.0, 35.1], [34.7, 36.6]]
  },
  {
    code: 'SY',
    name: 'Syria',
    hebrewName: 'סוריה',
    center: [35.0, 38.0],
    bounds: [[32.3, 35.7], [37.3, 42.4]]
  },
  {
    code: 'JO',
    name: 'Jordan',
    hebrewName: 'ירדן',
    center: [31.0, 36.0],
    bounds: [[29.2, 34.9], [33.4, 39.3]]
  },
  {
    code: 'EG',
    name: 'Egypt',
    hebrewName: 'מצרים',
    center: [26.0, 30.0],
    bounds: [[22.0, 25.0], [31.7, 37.0]]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    hebrewName: 'ערב הסעודית',
    center: [24.0, 45.0],
    bounds: [[16.0, 34.5], [32.2, 55.7]]
  },
  {
    code: 'TR',
    name: 'Turkey',
    hebrewName: 'טורקיה',
    center: [39.0, 35.0],
    bounds: [[35.8, 25.7], [42.1, 44.8]]
  },
  {
    code: 'CY',
    name: 'Cyprus',
    hebrewName: 'קפריסין',
    center: [35.0, 33.0],
    bounds: [[34.6, 32.3], [35.7, 34.6]]
  },
  {
    code: 'GR',
    name: 'Greece',
    hebrewName: 'יוון',
    center: [39.0, 22.0],
    bounds: [[34.8, 19.4], [41.7, 28.2]]
  },
  {
    code: 'IT',
    name: 'Italy',
    hebrewName: 'איטליה',
    center: [42.5, 12.5],
    bounds: [[35.5, 6.6], [47.1, 18.5]]
  },
  {
    code: 'FR',
    name: 'France',
    hebrewName: 'צרפת',
    center: [46.2, 2.2],
    bounds: [[41.3, -5.1], [51.1, 9.6]]
  },
  {
    code: 'ES',
    name: 'Spain',
    hebrewName: 'ספרד',
    center: [40.0, -4.0],
    bounds: [[35.2, -9.3], [43.8, 4.3]]
  },
  {
    code: 'DE',
    name: 'Germany',
    hebrewName: 'גרמניה',
    center: [51.0, 9.0],
    bounds: [[47.3, 5.9], [55.1, 15.0]]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    hebrewName: 'בריטניה',
    center: [54.0, -2.0],
    bounds: [[49.9, -8.2], [60.8, 1.8]]
  },
  {
    code: 'US',
    name: 'United States',
    hebrewName: 'ארצות הברית',
    center: [40.0, -100.0],
    bounds: [[24.4, -125.0], [49.4, -66.9]]
  },
  {
    code: 'RU',
    name: 'Russia',
    hebrewName: 'רוסיה',
    center: [60.0, 100.0],
    bounds: [[41.2, 19.6], [81.9, 180.0]]
  },
  {
    code: 'CN',
    name: 'China',
    hebrewName: 'סין',
    center: [35.0, 105.0],
    bounds: [[18.2, 73.6], [53.6, 135.0]]
  },
  {
    code: 'IN',
    name: 'India',
    hebrewName: 'הודו',
    center: [20.0, 77.0],
    bounds: [[6.7, 68.0], [35.7, 97.4]]
  },
  {
    code: 'JP',
    name: 'Japan',
    hebrewName: 'יפן',
    center: [36.0, 138.0],
    bounds: [[24.0, 123.0], [46.0, 146.0]]
  }
];

/**
 * Get Hebrew country name using Intl.DisplayNames API with fallback to predefined list
 */
export const getHebrewCountryName = (countryCode: string): string => {
  try {
    // Try using Intl.DisplayNames API first
    const displayNames = new Intl.DisplayNames(['he-IL'], { type: 'region' });
    const hebrewName = displayNames.of(countryCode.toUpperCase());
    if (hebrewName && hebrewName !== countryCode.toUpperCase()) {
      return hebrewName;
    }
  } catch (error) {
    console.warn('Intl.DisplayNames not supported or failed:', error);
  }

  // Fallback to predefined list
  const country = COUNTRIES.find(c => c.code === countryCode.toUpperCase());
  return country?.hebrewName || countryCode;
};

/**
 * Get countries that should be visible in the current map bounds
 */
export const getVisibleCountries = (
  mapBounds: [[number, number], [number, number]], // [[south, west], [north, east]]
  zoomLevel: number
): CountryInfo[] => {
  const [southWest, northEast] = mapBounds;
  const [south, west] = southWest;
  const [north, east] = northEast;

  return COUNTRIES.filter(country => {
    // Check if country center is within map bounds
    const [lat, lng] = country.center;
    const isInBounds = lat >= south && lat <= north && lng >= west && lng <= east;

    // For higher zoom levels, show more countries
    if (zoomLevel > 6) {
      return isInBounds;
    }

    // For lower zoom levels, only show major countries or those with bounds intersecting
    if (country.bounds) {
      const [[countrySouth, countryWest], [countryNorth, countryEast]] = country.bounds;
      const boundsIntersect = !(
        countryNorth < south ||
        countrySouth > north ||
        countryEast < west ||
        countryWest > east
      );
      return boundsIntersect;
    }

    return isInBounds;
  });
};

/**
 * Get country info by coordinates (reverse geocoding approximation)
 */
export const getCountryByCoordinates = (lat: number, lng: number): CountryInfo | null => {
  return COUNTRIES.find(country => {
    if (country.bounds) {
      const [[south, west], [north, east]] = country.bounds;
      return lat >= south && lat <= north && lng >= west && lng <= east;
    }
    
    // Simple distance check for countries without bounds
    const [centerLat, centerLng] = country.center;
    const distance = Math.sqrt(
      Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
    );
    return distance < 5; // Rough approximation
  }) || null;
};

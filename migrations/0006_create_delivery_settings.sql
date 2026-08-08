CREATE TABLE IF NOT EXISTS delivery_settings (
  id TEXT PRIMARY KEY,
  pickup_city TEXT NOT NULL,
  free_threshold INTEGER NOT NULL CHECK (free_threshold >= 0),
  pickup_fee INTEGER NOT NULL CHECK (pickup_fee >= 0),
  major_city_fee INTEGER NOT NULL CHECK (major_city_fee >= 0),
  north_region_fee INTEGER NOT NULL CHECK (north_region_fee >= 0),
  south_region_fee INTEGER NOT NULL CHECK (south_region_fee >= 0),
  major_cities TEXT NOT NULL,
  south_cities TEXT NOT NULL,
  active_zones TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO delivery_settings (
  id, pickup_city, free_threshold, pickup_fee, major_city_fee, north_region_fee, south_region_fee,
  major_cities, south_cities, active_zones
) VALUES (
  'default', 'Fès', 2000, 20, 35, 40, 45,
  '["Casablanca","Marrakech","Tanger","Salé","Meknès","Oujda","Kénitra","Tétouan","Témara","Safi","Mohammedia","Khouribga","El Jadida","Béni Mellal","Nador","Taza","Khémisset","Laâyoune","Berkane"]',
  '["Agadir","Dakhla","Guelmim","Tan-Tan","Tarfaya","Ouarzazate","Zagora","Errachidia"]',
  '{"PICKUP_CITY":true,"MAJOR_CITIES":true,"NORTH_REGIONS":true,"SOUTH_REGIONS":true}'
);

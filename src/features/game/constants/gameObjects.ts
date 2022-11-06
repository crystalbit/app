export const GAME_OBJECTS: Record<
  | 'starship'
  | 'base'
  | 'transportBay'
  | 'powerplant'
  | 'robot'
  | 'ghostBase'
  | 'ghostRobots'
  | 'ghostPower'
  | 'ghostTransport'
  | 'spaceXChange'
  | 'hoverCircle',
  string[]
> = {
  starship: ['starship'],
  base: ['base', 'base-active'],
  transportBay: ['transportBay-1', 'transportBay-2', 'transportBay-3'],
  powerplant: ['powerplant-1', 'powerplant-2', 'powerplant-3'],
  robot: ['robots-1', 'robots-2', 'robots-3'],
  ghostBase: ['ghostBase'],
  ghostRobots: ['ghostRobots'],
  ghostPower: ['ghostPower'],
  ghostTransport: ['ghostTransport'],
  spaceXChange: ['spaceXChange'],
  hoverCircle: ['hoverCircle']
};

export const KEY_OBJECTS = {
  base: 'Base Station',
  robot: 'Robot Assembly',
  transport: 'Transport',
  power: 'Power Production'
};

export const HOVER_CIRCLE_POSITIONS = {
  dex: {
    Polygon: { x: 50, y: 150 },
    Harmony: { x: 150, y: 0 }
  },
  base: {
    Polygon: { x: 20, y: 120 },
    Harmony: { x: 40, y: 20 }
  },
  robots: {
    Polygon: { x: -160, y: 100 },
    Harmony: { x: -20, y: 50 }
  },
  power: {
    Polygon: { x: -90, y: 20 },
    Harmony: { x: 0, y: 20 }
  },
  transport: {
    Polygon: { x: 50, y: 150 },
    Harmony: { x: 50, y: 50 }
  }
};

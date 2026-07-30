const DEFAULT_DNA = {
  approach: 33,
  offTee: 22,
  aroundGreen: 15,
  putting: 15,
  accuracy: 10,
  scrambling: 5,
};

const COURSE_DNA = {
  "Augusta National Golf Club": {
    approach: 40,
    offTee: 20,
    aroundGreen: 15,
    putting: 20,
    accuracy: 0,
    scrambling: 5,
  },

  "TPC Sawgrass": {
    approach: 35,
    offTee: 15,
    aroundGreen: 15,
    putting: 20,
    accuracy: 10,
    scrambling: 5,
  },

  "Torrey Pines Golf Course": {
    approach: 30,
    offTee: 25,
    aroundGreen: 15,
    putting: 20,
    accuracy: 5,
    scrambling: 5,
  },

  "Pebble Beach Golf Links": {
    approach: 30,
    offTee: 15,
    aroundGreen: 20,
    putting: 20,
    accuracy: 10,
    scrambling: 5,
  },

  "Harbour Town Golf Links": {
    approach: 25,
    offTee: 10,
    aroundGreen: 20,
    putting: 20,
    accuracy: 20,
    scrambling: 5,
  },

  "TPC River Highlands": {
    approach: 35,
    offTee: 15,
    aroundGreen: 15,
    putting: 20,
    accuracy: 10,
    scrambling: 5,
  },

  "Quail Hollow Club": {
    approach: 30,
    offTee: 30,
    aroundGreen: 15,
    putting: 15,
    accuracy: 5,
    scrambling: 5,
  },

  "Muirfield Village Golf Club": {
    approach: 35,
    offTee: 20,
    aroundGreen: 20,
    putting: 15,
    accuracy: 5,
    scrambling: 5,
  },

  "TPC Scottsdale": {
    approach: 30,
    offTee: 25,
    aroundGreen: 15,
    putting: 20,
    accuracy: 5,
    scrambling: 5,
  },

  "Colonial Country Club": {
    approach: 30,
    offTee: 10,
    aroundGreen: 20,
    putting: 20,
    accuracy: 15,
    scrambling: 5,
  },

  "Bay Hill Club & Lodge": {
    approach: 30,
    offTee: 25,
    aroundGreen: 15,
    putting: 20,
    accuracy: 5,
    scrambling: 5,
  },

  "Riviera Country Club": {
    approach: 35,
    offTee: 20,
    aroundGreen: 15,
    putting: 20,
    accuracy: 5,
    scrambling: 5,
  },
};

export function getCourseDNA(courseName) {
  if (!courseName) return DEFAULT_DNA;

  const entry = Object.entries(COURSE_DNA).find(([name]) =>
    courseName.toLowerCase().includes(name.toLowerCase())
  );

  return entry ? entry[1] : DEFAULT_DNA;
}

export { COURSE_DNA, DEFAULT_DNA };
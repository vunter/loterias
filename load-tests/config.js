// Shared configuration for all load tests
export const CONFIG = {
  backend: {
    baseUrl: __ENV.BACKEND_URL || 'http://localhost:8082',
  },
  frontend: {
    baseUrl: __ENV.FRONTEND_URL || 'http://localhost:3000',
  },
  lotteries: [
    'mega_sena',
    'lotofacil',
    'quina',
    'lotomania',
    'timemania',
    'dupla_sena',
    'dia_de_sorte',
    'super_sete',
    'mais_milionaria',
  ],
  // Sample numbers per lottery for bet-checking tests
  sampleBets: {
    mega_sena: [4, 8, 15, 16, 23, 42],
    lotofacil: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    quina: [5, 12, 33, 50, 71],
    lotomania: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
    timemania: [7, 14, 21, 33, 55, 66, 70, 73, 77, 80],
    dupla_sena: [3, 11, 22, 33, 44, 50],
    dia_de_sorte: [1, 7, 13, 19, 25, 31],
    super_sete: [1, 2, 3, 4, 5, 6, 7],
    mais_milionaria: [1, 10, 20, 30, 40, 50],
  },
};

// Reusable k6 load profiles
export const PROFILES = {
  // Quick smoke test — verify endpoints work under minimal load
  smoke: {
    vus: 1,
    duration: '10s',
  },
  // Light load — baseline performance measurement
  light: {
    stages: [
      { duration: '10s', target: 5 },
      { duration: '30s', target: 5 },
      { duration: '10s', target: 0 },
    ],
  },
  // Standard load — typical usage simulation
  standard: {
    stages: [
      { duration: '15s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '15s', target: 20 },
      { duration: '1m', target: 20 },
      { duration: '15s', target: 0 },
    ],
  },
  // Stress test — find breaking points
  stress: {
    stages: [
      { duration: '10s', target: 10 },
      { duration: '30s', target: 30 },
      { duration: '30s', target: 50 },
      { duration: '30s', target: 80 },
      { duration: '30s', target: 100 },
      { duration: '30s', target: 0 },
    ],
  },
  // Spike test — sudden traffic burst
  spike: {
    stages: [
      { duration: '10s', target: 5 },
      { duration: '5s', target: 80 },
      { duration: '30s', target: 80 },
      { duration: '5s', target: 5 },
      { duration: '20s', target: 5 },
    ],
  },
};

// Shared thresholds
export const THRESHOLDS = {
  http_req_duration: ['p(95)<2000', 'p(99)<5000'],
  http_req_failed: ['rate<0.10'],
};

// Pick a random lottery type
export function randomLottery() {
  return CONFIG.lotteries[Math.floor(Math.random() * CONFIG.lotteries.length)];
}

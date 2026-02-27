import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

// Custom metrics
const dashboardDuration = new Trend('dashboard_duration', true);
const rankingDuration = new Trend('ranking_duration', true);
const conferirDuration = new Trend('conferir_duration', true);
const acumuladoDuration = new Trend('acumulado_duration', true);
const especiaisDuration = new Trend('especiais_duration', true);
const ganhadoresUfDuration = new Trend('ganhadores_uf_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    dashboard_duration: ['p(95)<3000'],
    ranking_duration: ['p(95)<3000'],
    conferir_duration: ['p(95)<2000'],
    especiais_duration: ['p(95)<5000'],
  },
  tags: { testSuite: 'dashboard' },
};

const BASE = CONFIG.backend.baseUrl;

export default function () {
  const tipo = randomLottery();

  group('Dashboard - Main', () => {
    const res = http.get(`${BASE}/api/dashboard/${tipo}`);
    dashboardDuration.add(res.timings.duration);
    const ok = check(res, {
      'dashboard 200': (r) => r.status === 200,
      'has ultimoConcurso': (r) => {
        try { return JSON.parse(r.body).ultimoConcurso !== undefined; }
        catch { return false; }
      },
      'has numerosQuentes': (r) => {
        try { return Array.isArray(JSON.parse(r.body).numerosQuentes); }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);

  group('Dashboard - Number Ranking', () => {
    const res = http.get(`${BASE}/api/dashboard/${tipo}/numeros/ranking`);
    rankingDuration.add(res.timings.duration);
    const ok = check(res, {
      'ranking 200': (r) => r.status === 200,
      'ranking is array': (r) => {
        try { return Array.isArray(JSON.parse(r.body)); }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Dashboard - Conferir Aposta', () => {
    const numeros = CONFIG.sampleBets[tipo] || [1, 2, 3, 4, 5, 6];
    const res = http.get(`${BASE}/api/dashboard/${tipo}/conferir?numeros=${numeros.join(',')}`);
    conferirDuration.add(res.timings.duration);
    const ok = check(res, {
      'conferir 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Dashboard - Acumulado', () => {
    const res = http.get(`${BASE}/api/dashboard/${tipo}/acumulado`);
    acumuladoDuration.add(res.timings.duration);
    const ok = check(res, {
      'acumulado 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Dashboard - Especiais', () => {
    const res = http.get(`${BASE}/api/dashboard/especiais`);
    especiaisDuration.add(res.timings.duration);
    const ok = check(res, {
      'especiais 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Dashboard - Ganhadores por UF', () => {
    const res = http.get(`${BASE}/api/dashboard/${tipo}/ganhadores-por-uf`);
    ganhadoresUfDuration.add(res.timings.duration);
    const ok = check(res, {
      'ganhadores_uf 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);
}

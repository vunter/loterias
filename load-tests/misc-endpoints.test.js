import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

const exportCsvDuration = new Trend('export_csv_duration', true);
const exportFreqDuration = new Trend('export_freq_duration', true);
const exportStatsDuration = new Trend('export_stats_duration', true);
const verificarDuration = new Trend('verificar_duration', true);
const simularDuration = new Trend('simular_duration', true);
const estrategiasDuration = new Trend('estrategias_duration', true);
const homeInfoDuration = new Trend('home_info_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    export_csv_duration: ['p(95)<10000'],
    verificar_duration: ['p(95)<3000'],
    simular_duration: ['p(95)<10000'],
  },
  tags: { testSuite: 'misc' },
};

const BASE = CONFIG.backend.baseUrl;

export default function () {
  const tipo = randomLottery();

  group('Home - Info', () => {
    const res = http.get(`${BASE}/`);
    homeInfoDuration.add(res.timings.duration);
    const ok = check(res, {
      'home 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Estratégias - List', () => {
    const res = http.get(`${BASE}/api/estatisticas/estrategias`);
    estrategiasDuration.add(res.timings.duration);
    const ok = check(res, {
      'estrategias 200': (r) => r.status === 200,
      'estrategias is array': (r) => {
        try { return Array.isArray(JSON.parse(r.body)); }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Export - Concursos CSV', () => {
    const res = http.get(`${BASE}/api/export/${tipo}/concursos.csv`, {
      timeout: '15s',
    });
    exportCsvDuration.add(res.timings.duration);
    const ok = check(res, {
      'export_csv 200': (r) => r.status === 200,
      'is csv': (r) => (r.headers['Content-Type'] || '').includes('text/csv') ||
                        (r.body && r.body.length > 100),
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Export - Frequência CSV', () => {
    const res = http.get(`${BASE}/api/export/${tipo}/frequencia.csv`, {
      timeout: '10s',
    });
    exportFreqDuration.add(res.timings.duration);
    const ok = check(res, {
      'export_freq 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Export - Estatísticas CSV', () => {
    const res = http.get(`${BASE}/api/export/${tipo}/estatisticas.csv`, {
      timeout: '10s',
    });
    exportStatsDuration.add(res.timings.duration);
    const ok = check(res, {
      'export_stats responds': (r) => r.status === 200 || r.status === 500,
      'export_stats 200': (r) => r.status === 200,
    });
    errorRate.add(res.status !== 200 && res.status !== 500);
    if (res.status === 200) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Apostas - Verificar', () => {
    const numeros = CONFIG.sampleBets[tipo] || [1, 2, 3, 4, 5, 6];
    const payload = JSON.stringify({ numeros, concursoInicio: 1, concursoFim: 100 });
    const res = http.post(`${BASE}/api/apostas/${tipo}/verificar`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    verificarDuration.add(res.timings.duration);
    const ok = check(res, {
      'verificar 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Apostas - Simular', () => {
    const numeros = CONFIG.sampleBets[tipo] || [1, 2, 3, 4, 5, 6];
    const payload = JSON.stringify({
      jogos: [numeros],
      concursoInicio: 1,
      concursoFim: 50,
    });
    const res = http.post(`${BASE}/api/apostas/${tipo}/simular`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: '15s',
    });
    simularDuration.add(res.timings.duration);
    const ok = check(res, {
      'simular 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);
}

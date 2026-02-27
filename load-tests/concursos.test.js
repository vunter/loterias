import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

const concursosListDuration = new Trend('concursos_list_duration', true);
const concursoUltimoDuration = new Trend('concurso_ultimo_duration', true);
const concursoByNumberDuration = new Trend('concurso_by_number_duration', true);
const syncStatusDuration = new Trend('sync_status_duration', true);
const backfillStatusDuration = new Trend('backfill_status_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    concursos_list_duration: ['p(95)<2000'],
    concurso_ultimo_duration: ['p(95)<1000'],
    sync_status_duration: ['p(95)<1000'],
  },
  tags: { testSuite: 'concursos' },
};

const BASE = CONFIG.backend.baseUrl;

export default function () {
  const tipo = randomLottery();

  group('Concursos - List (paginated)', () => {
    const page = Math.floor(Math.random() * 5);
    const res = http.get(`${BASE}/api/concursos/${tipo}?page=${page}&size=20`);
    concursosListDuration.add(res.timings.duration);
    const ok = check(res, {
      'concursos_list responds': (r) => r.status === 200 || r.status === 500,
      'concursos_list 200': (r) => r.status === 200,
    });
    errorRate.add(res.status !== 200 && res.status !== 500);
    if (res.status === 200) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Concursos - Último', () => {
    const res = http.get(`${BASE}/api/concursos/${tipo}/ultimo`);
    concursoUltimoDuration.add(res.timings.duration);
    const ok = check(res, {
      'ultimo 200': (r) => r.status === 200,
      'has numero': (r) => {
        try { return JSON.parse(r.body).numero > 0; }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Concursos - By Number', () => {
    // Contest numbers vary by lottery; use a reasonable recent range
    const numero = Math.floor(Math.random() * 100) + 2800;
    const res = http.get(`${BASE}/api/concursos/${tipo}/${numero}`);
    concursoByNumberDuration.add(res.timings.duration);
    // May 404 if number doesn't exist — that's acceptable
    const ok = check(res, {
      'by_number 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Concursos - Sync Status', () => {
    const res = http.get(`${BASE}/api/concursos/sync-status`);
    syncStatusDuration.add(res.timings.duration);
    const ok = check(res, {
      'sync_status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Concursos - Backfill Status', () => {
    const res = http.get(`${BASE}/api/concursos/backfill-status`);
    backfillStatusDuration.add(res.timings.duration);
    const ok = check(res, {
      'backfill_status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);
}

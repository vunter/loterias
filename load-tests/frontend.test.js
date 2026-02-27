import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS } from './config.js';

const pageLoadDuration = new Trend('page_load_duration', true);
const apiProxyDuration = new Trend('api_proxy_duration', true);
const staticAssetDuration = new Trend('static_asset_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    page_load_duration: ['p(95)<5000'],
    api_proxy_duration: ['p(95)<5000'],
    static_asset_duration: ['p(95)<2000'],
  },
  tags: { testSuite: 'frontend' },
};

const FRONT = CONFIG.frontend.baseUrl;
const lotteries = CONFIG.lotteries;

export default function () {
  const tipo = lotteries[Math.floor(Math.random() * lotteries.length)];

  group('Frontend - Home Page', () => {
    const res = http.get(`${FRONT}/`);
    pageLoadDuration.add(res.timings.duration);
    const ok = check(res, {
      'home 200': (r) => r.status === 200,
      'has html': (r) => r.body && r.body.includes('<!DOCTYPE html>') || r.body.includes('<html'),
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);

  // Frontend API proxy — simulates what the browser does (Next.js API route proxies to backend)
  group('Frontend - API Proxy: Dashboard', () => {
    const res = http.get(`${FRONT}/api/dashboard/${tipo}`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy dashboard 200': (r) => r.status === 200,
      'proxy has data': (r) => {
        try { return JSON.parse(r.body).ultimoConcurso !== undefined; }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Ranking', () => {
    const res = http.get(`${FRONT}/api/dashboard/${tipo}/numeros/ranking`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy ranking 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Estratégias', () => {
    const res = http.get(`${FRONT}/api/estatisticas/estrategias`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy estrategias 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Tendências', () => {
    const res = http.get(`${FRONT}/api/analise/${tipo}/tendencias`, {
      timeout: '15s',
    });
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy tendencias 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Financeiro', () => {
    const res = http.get(`${FRONT}/api/analise/${tipo}/financeiro`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy financeiro 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Especiais', () => {
    const res = http.get(`${FRONT}/api/dashboard/especiais`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy especiais 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Gerar Jogos', () => {
    const res = http.get(`${FRONT}/api/estatisticas/${tipo}/gerar-jogos-estrategico?estrategia=EQUILIBRADO&quantidade=3`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy gerar 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Frontend - API Proxy: Sync Status', () => {
    const res = http.get(`${FRONT}/api/concursos/sync-status`);
    apiProxyDuration.add(res.timings.duration);
    const ok = check(res, {
      'proxy sync_status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);
}

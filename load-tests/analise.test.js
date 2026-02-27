import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

const tendenciasDuration = new Trend('tendencias_duration', true);
const ordemSorteioDuration = new Trend('ordem_sorteio_duration', true);
const financeiroDuration = new Trend('financeiro_duration', true);
const duplaSenaDuration = new Trend('dupla_sena_duration', true);
const historicoMensalDuration = new Trend('historico_mensal_duration', true);
const timeCoracaoDuration = new Trend('time_coracao_duration', true);
const sugestaoTimeDuration = new Trend('sugestao_time_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    tendencias_duration: ['p(95)<8000'],    // tendencias is known to be slow
    ordem_sorteio_duration: ['p(95)<3000'],
    financeiro_duration: ['p(95)<3000'],
    historico_mensal_duration: ['p(95)<5000'],
  },
  tags: { testSuite: 'analise' },
};

const BASE = CONFIG.backend.baseUrl;

export default function () {
  const tipo = randomLottery();

  group('Análise - Tendências', () => {
    const res = http.get(`${BASE}/api/analise/${tipo}/tendencias`, {
      timeout: '15s',
    });
    tendenciasDuration.add(res.timings.duration);
    const ok = check(res, {
      'tendencias 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);

  group('Análise - Ordem Sorteio', () => {
    const res = http.get(`${BASE}/api/analise/${tipo}/ordem-sorteio`);
    ordemSorteioDuration.add(res.timings.duration);
    const ok = check(res, {
      'ordem_sorteio 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Análise - Financeiro', () => {
    const res = http.get(`${BASE}/api/analise/${tipo}/financeiro`);
    financeiroDuration.add(res.timings.duration);
    const ok = check(res, {
      'financeiro 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Análise - Dupla Sena', () => {
    const res = http.get(`${BASE}/api/analise/dupla-sena`);
    duplaSenaDuration.add(res.timings.duration);
    const ok = check(res, {
      'dupla_sena 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Análise - Histórico Mensal', () => {
    const res = http.get(`${BASE}/api/analise/${tipo}/historico-mensal`);
    historicoMensalDuration.add(res.timings.duration);
    const ok = check(res, {
      'historico_mensal 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  // Time do Coração — only valid for timemania and dia_de_sorte
  if (tipo === 'timemania' || tipo === 'dia_de_sorte') {
    group('Análise - Time do Coração', () => {
      const res = http.get(`${BASE}/api/analise/${tipo}/time-coracao`);
      timeCoracaoDuration.add(res.timings.duration);
      const ok = check(res, {
        'time_coracao 200': (r) => r.status === 200,
      });
      errorRate.add(!ok);
      if (ok) successfulRequests.add(1);
    });

    sleep(0.2);

    group('Análise - Sugestão Time', () => {
      const estrategias = ['quente', 'frio', 'equilibrado'];
      const est = estrategias[Math.floor(Math.random() * estrategias.length)];
      const res = http.get(`${BASE}/api/analise/${tipo}/time-coracao/sugestao?estrategia=${est}`);
      sugestaoTimeDuration.add(res.timings.duration);
      const ok = check(res, {
        'sugestao_time 200': (r) => r.status === 200,
      });
      errorRate.add(!ok);
      if (ok) successfulRequests.add(1);
    });
  }

  sleep(0.5);
}

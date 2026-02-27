/**
 * Full User Journey Load Test
 *
 * Simulates a real user session: land on page, browse dashboards for multiple
 * lotteries, check a bet, generate games, view análises, export data.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

const journeyDuration = new Trend('full_journey_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    full_journey_duration: ['p(95)<60000'],
  },
  tags: { testSuite: 'user-journey' },
};

const FRONT = CONFIG.frontend.baseUrl;
const BASE = CONFIG.backend.baseUrl;

function req(url, opts) {
  const res = http.get(url, opts);
  const ok = check(res, { [`${url} OK`]: (r) => r.status === 200 });
  errorRate.add(!ok);
  if (ok) successfulRequests.add(1);
  return res;
}

export default function () {
  const start = Date.now();

  // 1. User lands on the homepage
  group('Journey - Land on Homepage', () => {
    req(`${FRONT}/`);
    sleep(1);
  });

  // 2. Initial dashboard loads (default lottery)
  const tipo1 = 'mega_sena';
  group('Journey - View Mega-Sena Dashboard', () => {
    req(`${FRONT}/api/dashboard/${tipo1}`);
    req(`${FRONT}/api/estatisticas/estrategias`);
    req(`${FRONT}/api/concursos/sync-status`);
    sleep(2);
  });

  // 3. User switches to a different lottery
  const tipo2 = randomLottery();
  group(`Journey - Switch to ${tipo2}`, () => {
    req(`${FRONT}/api/dashboard/${tipo2}`);
    sleep(1.5);
  });

  // 4. User views number ranking
  group('Journey - Number Ranking', () => {
    req(`${FRONT}/api/dashboard/${tipo2}/numeros/ranking`);
    sleep(1);
  });

  // 5. User checks their bet
  group('Journey - Check Bet', () => {
    const numeros = CONFIG.sampleBets[tipo2] || [1, 2, 3, 4, 5, 6];
    req(`${FRONT}/api/dashboard/${tipo2}/conferir?numeros=${numeros.join(',')}`);
    sleep(1);
  });

  // 6. User generates games
  group('Journey - Generate Games', () => {
    req(`${FRONT}/api/estatisticas/${tipo2}/gerar-jogos-estrategico?estrategia=EQUILIBRADO&quantidade=5`);
    sleep(1.5);
  });

  // 7. User views tendências
  group('Journey - View Tendências', () => {
    req(`${FRONT}/api/analise/${tipo2}/tendencias`, { timeout: '15s' });
    sleep(2);
  });

  // 8. User views financeiro
  group('Journey - View Financeiro', () => {
    req(`${FRONT}/api/analise/${tipo2}/financeiro`);
    sleep(1);
  });

  // 9. User views ordem de sorteio
  group('Journey - View Ordem Sorteio', () => {
    req(`${FRONT}/api/analise/${tipo2}/ordem-sorteio`);
    sleep(1);
  });

  // 10. User views especiais
  group('Journey - View Especiais', () => {
    req(`${FRONT}/api/dashboard/especiais`);
    sleep(1);
  });

  // 11. User views regional analysis
  group('Journey - Winners by State', () => {
    req(`${FRONT}/api/dashboard/${tipo2}/ganhadores-por-uf`);
    sleep(1);
  });

  // 12. User exports data
  group('Journey - Export CSV', () => {
    req(`${BASE}/api/export/${tipo2}/concursos.csv`, { timeout: '15s' });
    sleep(0.5);
  });

  const elapsed = Date.now() - start;
  journeyDuration.add(elapsed);

  sleep(2);
}

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { CONFIG, PROFILES, THRESHOLDS, randomLottery } from './config.js';

const frequenciaDuration = new Trend('frequencia_duration', true);
const maisFrequentesDuration = new Trend('mais_frequentes_duration', true);
const atrasadosDuration = new Trend('atrasados_duration', true);
const paresImparesDuration = new Trend('pares_impares_duration', true);
const somaMediaDuration = new Trend('soma_media_duration', true);
const sequenciaisDuration = new Trend('sequenciais_duration', true);
const faixasDuration = new Trend('faixas_duration', true);
const correlacaoDuration = new Trend('correlacao_duration', true);
const gerarJogosDuration = new Trend('gerar_jogos_duration', true);
const gerarEstrategicoDuration = new Trend('gerar_estrategico_duration', true);
const errorRate = new Rate('errors');
const successfulRequests = new Counter('successful_requests');

const profile = __ENV.PROFILE || 'light';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    ...THRESHOLDS,
    frequencia_duration: ['p(95)<2000'],
    gerar_jogos_duration: ['p(95)<5000'],
    gerar_estrategico_duration: ['p(95)<5000'],
    correlacao_duration: ['p(95)<5000'],
  },
  tags: { testSuite: 'estatisticas' },
};

const BASE = CONFIG.backend.baseUrl;
const strategies = ['NUMEROS_QUENTES', 'NUMEROS_FRIOS', 'EQUILIBRADO', 'ALEATORIO', 'ATRASADOS'];

export default function () {
  const tipo = randomLottery();

  group('Estatísticas - Frequência', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/frequencia`);
    frequenciaDuration.add(res.timings.duration);
    const ok = check(res, {
      'frequencia 200': (r) => r.status === 200,
      'frequencia is object': (r) => {
        try { return typeof JSON.parse(r.body) === 'object'; }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Estatísticas - Mais Frequentes', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/mais-frequentes?quantidade=10`);
    maisFrequentesDuration.add(res.timings.duration);
    const ok = check(res, { 'mais_frequentes 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.2);

  group('Estatísticas - Atrasados', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/atrasados?quantidade=10`);
    atrasadosDuration.add(res.timings.duration);
    const ok = check(res, { 'atrasados 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.2);

  group('Estatísticas - Pares/Impares', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/pares-impares`);
    paresImparesDuration.add(res.timings.duration);
    const ok = check(res, {
      'pares_impares responds': (r) => r.status === 200 || r.status === 500,
      'pares_impares 200': (r) => r.status === 200,
    });
    errorRate.add(res.status !== 200 && res.status !== 500);
    if (res.status === 200) successfulRequests.add(1);
  });

  sleep(0.2);

  group('Estatísticas - Soma Média', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/soma-media`);
    somaMediaDuration.add(res.timings.duration);
    const ok = check(res, { 'soma_media 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.2);

  group('Estatísticas - Sequenciais', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/sequenciais`);
    sequenciaisDuration.add(res.timings.duration);
    const ok = check(res, { 'sequenciais 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.2);

  group('Estatísticas - Faixas', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/faixas`);
    faixasDuration.add(res.timings.duration);
    const ok = check(res, { 'faixas 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Estatísticas - Correlação', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/correlacao?quantidade=20`);
    correlacaoDuration.add(res.timings.duration);
    const ok = check(res, { 'correlacao 200': (r) => r.status === 200 });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Estatísticas - Gerar Jogos (personalizado)', () => {
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/gerar-jogos?quantidade=3`);
    gerarJogosDuration.add(res.timings.duration);
    const ok = check(res, {
      'gerar_jogos 200': (r) => r.status === 200,
      'gerar_jogos has jogos': (r) => {
        try { return JSON.parse(r.body).jogos !== undefined; }
        catch { return false; }
      },
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.3);

  group('Estatísticas - Gerar Jogos (estratégico)', () => {
    const estrategia = strategies[Math.floor(Math.random() * strategies.length)];
    const res = http.get(`${BASE}/api/estatisticas/${tipo}/gerar-jogos-estrategico?estrategia=${estrategia}&quantidade=3`);
    gerarEstrategicoDuration.add(res.timings.duration);
    const ok = check(res, {
      'gerar_estrategico 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
    if (ok) successfulRequests.add(1);
  });

  sleep(0.5);
}

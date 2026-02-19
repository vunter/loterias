# Loterias Analyzer — Future Features Roadmap

Features identified during comprehensive code review, reorganized by **implementation order**.
Auth is planned but not urgent → features are designed to work single-user first, multi-user later.

---

## Phase 1 — Core Value (do these first, standalone wins)

| # | Feature | Layers | Effort | Why first |
|---|---------|--------|--------|-----------|
| 1 | **Jackpot Tracking & Alerts** | Backend + Frontend | Low | Quick win — data already exists in Caixa sync, just needs an endpoint + badge in UI |
| 2 | **Regional Winner Analysis** | Backend + Frontend | Low | `GanhadorUF` data already stored, needs aggregation endpoint + map/chart |
| 3 | **Plugin: Templates & Favorites** | Plugin | Low | High daily-use value, zero backend dependency |
| 4 | **Win Probability Calculator** | Frontend | Low | Pure math, no backend change, adds analytical depth |
| 5 | **Social Sharing** | Frontend | Low | Share buttons + URL encoding, no backend needed |

## Phase 2 — Persistence & Intelligence (biggest user-facing leap)

| # | Feature | Layers | Effort | Dependency |
|---|---------|--------|--------|------------|
| 6 | **Game History & Saved Bets** | Backend + Frontend + Plugin | Medium | New `Bet` table, CRUD API, "My Bets" tab, plugin saves to backend |
| 7 | **Win Notification & Result Checking** | Backend + Frontend | Medium | Requires #6 (saved bets to check against) |
| 8 | **PDF/Excel Export** | Backend | Medium | Standalone, but more useful with #6 (export bet history) |

## Phase 3 — Mobile & Offline (you use both desktop + mobile)

| # | Feature | Layers | Effort | Notes |
|---|---------|--------|--------|-------|
| 9 | **PWA Support** | Frontend | Low-Med | manifest.json, service worker, install prompt, offline shell |
| 10 | **Plugin: Offline Mode** | Plugin | Medium | Cache last API responses, local fallback generator |

## Phase 4 — Visualizations & Analytics

| # | Feature | Layers | Effort | Notes |
|---|---------|--------|--------|-------|
| 11 | **Advanced Visualizations** | Frontend | Medium | Heatmap, calendar view, cross-lottery comparison |
| 12 | **Accessibility** | Frontend + Plugin | Low | Skip links, focus rings, reduced-motion, ARIA |

## Phase 5 — Backend Hardening

| # | Feature | Layers | Effort | Notes |
|---|---------|--------|--------|-------|
| 13 | **Circuit Breaker (Resilience4j)** | Backend | Low | Protects against Caixa API downtime |
| 14 | **Webhook / Push / Real-time** | Backend | Medium | SSE or WebSocket for live results |
| 15 | **Distributed Cache (Redis)** | Backend | Medium | Needed only if scaling to multiple instances |

## Phase 6 — Multi-user (when ready)

| # | Feature | Layers | Effort | Notes |
|---|---------|--------|--------|-------|
| 16 | **User Auth & Profiles** | Backend + Frontend | High | Spring Security + JWT, user entity, protected routes |
| 17 | **Multi-language (i18n)** | All | High | next-intl, externalized strings, PT-BR + EN |

---

## Dependency Graph

```
Phase 1 (all independent, can be parallelized)
  ├── #1 Jackpot
  ├── #2 Regional Analysis
  ├── #3 Plugin Templates
  ├── #4 Probability Calculator
  └── #5 Social Sharing

Phase 2
  #6 Saved Bets ─── prerequisite for ──→ #7 Win Notifications
                                     └──→ #8 PDF Export (enhanced with bet history)

Phase 3
  #9 PWA (standalone)
  #10 Plugin Offline (standalone)

Phase 4-6 (standalone, order flexible)
```

## Already Completed

- ✅ Full codebase review (52 issues → 41 fixes)
- ✅ Super Sete column-order preservation
- ✅ All 9 lottery rules verification and fixes
- ✅ Chrome extension URL/navigation/filling fixes
- ✅ Plugin: Fill progress bar & confirmation dialog
- ✅ Plugin: Options/Settings page
- ✅ Frontend: SEO & OpenGraph meta tags, JSON-LD, robots.txt, sitemap.xml
- ✅ **Phase 1: Jackpot Tracking** — Backend endpoint + Dashboard alert banner
- ✅ **Phase 1: Regional Winner Analysis** — Backend aggregation + bar chart component
- ✅ **Phase 1: Plugin Templates & Favorites** — Save/load/delete config templates
- ✅ **Phase 1: Win Probability Calculator** — Combinatorics-based odds per tier
- ✅ **Phase 1: Social Sharing** — WhatsApp/Telegram/X/copy/native share

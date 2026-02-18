# Multi-Repo Setup Guide

This project uses a **multi-repository architecture** with **Git Submodules** to organize three independent projects under a single parent repository.

## Repository Structure

```
loterias/                          ← Parent repo (infrastructure + docs)
├── backend/                       ← Submodule → loterias-backend
├── frontend/                      ← Submodule → loterias-frontend
├── aposta-rapido/                 ← Submodule → loterias-aposta-rapido
├── docker-compose.yml
├── nginx/
├── grafana/
├── docs/
├── *.service files
└── install-*.sh scripts
```

## Repositories

| Repository | Tech Stack | Description |
|------------|-----------|-------------|
| `loterias-backend` | Java 25, Spring Boot 4, PostgreSQL | REST API, statistics, game generation, data sync |
| `loterias-frontend` | Next.js 16, React 19, TypeScript, Tailwind | Dashboard, charts, analysis components |
| `loterias-aposta-rapido` | Chrome Extension, Manifest V3 | Auto-fill lottery games on Caixa portal |
| `loterias` | Docker, Nginx, Grafana, Prometheus | Parent repo with infrastructure & documentation |

## Git Submodules

### What Are Submodules?

Git submodules allow you to include one Git repository inside another while keeping them independent. Each submodule has its own history, branches, and remotes.

### Initial Setup (Creating the Parent Repo)

```bash
# Initialize parent repo
cd loterias
git init

# Add submodules (pointing to remote repos)
git submodule add <backend-repo-url> backend
git submodule add <frontend-repo-url> frontend
git submodule add <plugin-repo-url> aposta-rapido

# Commit the submodule references
git commit -m "feat: add backend, frontend and plugin submodules"
```

This creates a `.gitmodules` file:

```ini
[submodule "backend"]
    path = backend
    url = <backend-repo-url>

[submodule "frontend"]
    path = frontend
    url = <frontend-repo-url>

[submodule "aposta-rapido"]
    path = aposta-rapido
    url = <plugin-repo-url>
```

### Cloning the Full Project

```bash
# Clone with all submodules
git clone --recurse-submodules <parent-repo-url>

# Or clone first, then init submodules
git clone <parent-repo-url>
cd loterias
git submodule init
git submodule update
```

### Daily Workflow

#### Working on a Submodule

```bash
# Enter the submodule
cd backend

# Switch to a branch (submodules default to detached HEAD)
git checkout main

# Make changes, commit, push
git add -A
git commit -m "feat: add new endpoint"
git push

# Go back to parent and update the reference
cd ..
git add backend
git commit -m "chore: update backend submodule"
git push
```

#### Pulling Latest Changes

```bash
# Update all submodules to latest remote commit
git submodule update --remote --merge

# Or update a specific submodule
git submodule update --remote --merge backend
```

#### Checking Submodule Status

```bash
# See which commit each submodule points to
git submodule status

# See a summary of changes
git submodule summary
```

## File Distribution

### Parent Repo (`loterias`)

```
├── .gitmodules                    # Submodule configuration
├── .gitignore
├── .dockerignore
├── .env.docker.example            # Docker environment template
├── README.md                      # Project overview
├── FUTURE-FEATURES.md             # Roadmap
├── docker-compose.yml             # Full-stack Docker Compose
├── install-services.sh            # Production installer
├── install-dev-services.sh        # Development installer
├── setup-nexus-repos.sh           # Nexus artifact repos
├── loterias-backend.service       # Systemd (prod backend)
├── loterias-frontend.service      # Systemd (prod frontend)
├── loterias-backend-dev.service   # Systemd (dev backend)
├── loterias-frontend-dev.service  # Systemd (dev frontend)
├── loterias-env.conf              # Environment configuration
├── loterias-logrotate.conf        # Log rotation
├── nginx/                         # Reverse proxy configs
│   ├── loterias-backend.conf
│   ├── nginx.docker.conf
│   └── README.md
├── grafana/                       # Monitoring configs
│   ├── prometheus.yml
│   ├── datasources.yml
│   ├── loki-config.yml
│   ├── loterias-overview-dashboard.json
│   ├── loterias-backend-dashboard.json
│   ├── loterias-logs-dashboard.json
│   └── README.md
└── docs/                          # Project-wide documentation
    ├── README.md
    ├── ARCHITECTURE.md
    ├── BACKEND.md
    ├── FRONTEND.md
    ├── PLUGIN.md
    ├── API.md
    ├── DEPLOY.md
    ├── DEVELOPMENT.md
    └── FEATURES.md
```

### Backend Repo (`loterias-backend`)

```
├── .gitignore
├── .dockerignore
├── pom.xml
├── mvnw
├── .mvn/
├── Dockerfile
├── docker-compose.yml
├── vault-env.sh
├── API.md
├── README.md
├── AGENTS.md
└── src/
    ├── main/java/br/com/loterias/
    │   ├── LoteriasApplication.java
    │   ├── config/          (9 classes)
    │   ├── controller/      (13 classes)
    │   ├── domain/
    │   │   ├── entity/      (5 classes)
    │   │   ├── dto/         (25 classes)
    │   │   └── repository/  (2 interfaces)
    │   ├── service/         (22 classes)
    │   │   └── util/        (2 classes)
    │   └── scheduler/       (1 class)
    ├── main/resources/
    │   ├── application.yml
    │   ├── application-dev.yml
    │   ├── application-db.properties
    │   ├── logback-spring.xml
    │   ├── db/migration/    (4 SQL files)
    │   └── excels/          (reference data)
    └── test/java/           (11 test classes)
```

### Frontend Repo (`loterias-frontend`)

```
├── .gitignore
├── .dockerignore
├── .env.example
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── next-env.d.ts
├── Dockerfile
├── README.md
├── AGENTS.md
├── public/
│   └── *.svg
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── error.tsx
    │   ├── loading.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   └── api/
    │       ├── [...path]/route.ts
    │       └── health/route.ts
    ├── components/          (24 components)
    ├── contexts/
    │   └── ThemeContext.tsx
    └── lib/                 (7 modules)
```

### Plugin Repo (`loterias-aposta-rapido`)

```
├── .gitignore
├── manifest.json
├── README.md
├── icons/
│   ├── icon16.png
│   ├── icon16.svg
│   ├── icon48.png
│   └── icon128.png
└── src/
    ├── popup.html
    ├── popup.js
    ├── popup.css
    ├── options.html
    ├── options.js
    ├── options.css
    ├── background.js
    ├── content.js
    └── content.css
```

## Development with Submodules

### Running the Full Stack

```bash
# Clone everything
git clone --recurse-submodules <parent-repo>
cd loterias

# Start with Docker
docker compose up -d

# Or start with systemd (dev mode)
sudo ./install-dev-services.sh
```

### Independent Development

Each repo can be developed independently:

```bash
# Backend only
cd backend
mvn spring-boot:run

# Frontend only
cd frontend
npm run dev

# Plugin - load as unpacked extension in Chrome
# chrome://extensions → Load unpacked → select aposta-rapido/
```

### CI/CD Considerations

- Each submodule repo has its own CI pipeline
- Parent repo CI should check submodule compatibility
- Use semantic versioning tags in submodule repos
- Parent repo pins specific submodule commits for stability

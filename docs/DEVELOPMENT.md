# Guia de Desenvolvimento

## Requisitos

### Backend
- Java 25
- Maven 3.9+

### Frontend
- Node.js 24+
- npm ou pnpm

## Setup Inicial

### 1. Clonar Repositório

```bash
git clone <repo-url>
cd loterias
```

### 2. Backend

```bash
cd backend

# Instalar dependências e compilar
mvn clean compile

# Rodar em modo desenvolvimento
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install
# ou
pnpm install

# Rodar em modo desenvolvimento
npm run dev
# ou
pnpm dev
```

O frontend estará disponível em `http://localhost:3000`.

## Serviços de Desenvolvimento (Hot Reload)

Para desenvolvimento contínuo, existem serviços systemd com hot reload/hot swap:

### Instalação

```bash
./install-dev-services.sh
```

### Serviços Disponíveis

| Serviço | Descrição | Características |
|---------|-----------|-----------------|
| `loterias-backend-dev` | Backend com Spring DevTools | Hot reload automático ao alterar código Java |
| `loterias-frontend-dev` | Frontend em modo dev | Hot reload automático ao alterar código React/TS |

### Comandos

```bash
# Iniciar serviços de desenvolvimento
sudo systemctl start loterias-backend-dev loterias-frontend-dev

# Parar serviços de desenvolvimento
sudo systemctl stop loterias-backend-dev loterias-frontend-dev

# Ver status
sudo systemctl status loterias-backend-dev loterias-frontend-dev

# Ver logs em tempo real
journalctl -u loterias-backend-dev -f
journalctl -u loterias-frontend-dev -f

# Ver logs de ambos
journalctl -u loterias-backend-dev -u loterias-frontend-dev -f
```

### Importante

⚠️ **Não rode serviços de dev e produção simultaneamente!**

```bash
# Antes de iniciar dev, pare produção:
sudo systemctl stop loterias-backend loterias-frontend

# Antes de iniciar produção, pare dev:
sudo systemctl stop loterias-backend-dev loterias-frontend-dev
```

### Como Funciona o Hot Reload

**Backend (Spring DevTools):**
- Detecta alterações em arquivos `.java` e `.class`
- Reinicia automaticamente o contexto Spring
- Mantém conexões de banco de dados

**Frontend (Next.js Dev):**
- Fast Refresh para componentes React
- Atualização instantânea de CSS/Tailwind
- Preserva estado dos componentes quando possível

## Estrutura de Desenvolvimento

### Backend

```
backend/
├── src/main/java/br/com/loterias/
│   ├── controller/     # REST Controllers
│   ├── domain/
│   │   ├── entity/     # JPA Entities
│   │   ├── dto/        # Data Transfer Objects
│   │   └── repository/ # Spring Data Repositories
│   ├── service/        # Business Logic
│   └── scheduler/      # Scheduled Tasks
├── src/main/resources/
│   ├── application.yml           # Configuração principal
│   ├── application-dev.yml       # Config desenvolvimento
│   ├── application-prod.yml      # Config produção
│   └── logback-spring.xml        # Configuração de logs
└── pom.xml                       # Dependências Maven
```

### Frontend

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/[...path]/        # API Proxy
│   │   ├── globals.css           # Estilos + Tema
│   │   ├── layout.tsx            # Layout Root
│   │   └── page.tsx              # Página Principal
│   ├── components/               # Componentes React
│   ├── contexts/                 # React Contexts
│   └── lib/                      # Utilitários
├── next.config.ts                # Config Next.js
├── package.json                  # Dependências
└── tsconfig.json                 # Config TypeScript
```

## Fluxo de Trabalho

### Criar Nova Feature

1. **Backend**:
   - Criar DTO em `domain/dto/`
   - Criar Service em `service/`
   - Criar/Atualizar Controller em `controller/`
   - Adicionar endpoint à documentação

2. **Frontend**:
   - Adicionar tipos em `lib/api.ts`
   - Adicionar função de API em `lib/api.ts`
   - Criar/Atualizar componente em `components/`
   - Integrar na página principal

### Criar Novo Componente Frontend

```tsx
// src/components/NovoComponente.tsx
'use client';

import { useState, useEffect } from 'react';
import { api, TipoLoteria } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface NovoComponenteProps {
  tipo: TipoLoteria;
}

export function NovoComponente({ tipo }: NovoComponenteProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [tipo]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.novaFuncao(tipo);
      setData(result);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-text-tertiary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-surface-primary rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Novo Componente
      </h2>
      {/* Conteúdo */}
    </div>
  );
}
```

### Criar Novo Endpoint Backend

```java
// Controller
@RestController
@RequestMapping("/api/nova-funcionalidade")
public class NovaFuncionalidadeController {
    
    private final NovaService novaService;
    
    public NovaFuncionalidadeController(NovaService novaService) {
        this.novaService = novaService;
    }
    
    @GetMapping("/{tipo}")
    @Operation(summary = "Nova funcionalidade", description = "Descrição detalhada")
    public Mono<NovaResponse> novaFuncionalidade(@PathVariable String tipo) {
        TipoLoteria tipoLoteria = parseTipoLoteria(tipo);
        return Mono.fromCallable(() -> novaService.processar(tipoLoteria))
                .subscribeOn(Schedulers.boundedElastic());
    }
}

// Service
@Service
public class NovaService {
    
    private final ConcursoRepository concursoRepository;
    
    public NovaService(ConcursoRepository concursoRepository) {
        this.concursoRepository = concursoRepository;
    }
    
    public NovaResponse processar(TipoLoteria tipo) {
        List<Concurso> concursos = concursoRepository
            .findByTipoLoteriaOrderByNumeroDesc(tipo);
        // Lógica
        return new NovaResponse(...);
    }
}

// DTO
public record NovaResponse(
    String tipo,
    String nomeLoteria,
    // outros campos
) {}
```

## Convenções de Código

### Backend (Java)

- **Lombok**: Use `@Slf4j`, `@RequiredArgsConstructor`, `@Data`
- **Records**: Use para DTOs imutáveis
- **Naming**: camelCase para métodos, PascalCase para classes
- **Controllers**: Use `Mono<>` para respostas reativas
- **Services**: Lógica de negócio isolada
- **Repository**: Apenas queries, sem lógica

### Frontend (TypeScript/React)

- **Componentes**: Função com export nomeado
- **Hooks**: `useState`, `useEffect` no topo
- **Tipos**: Definir interfaces para props
- **Estilos**: Tailwind com classes semânticas de tema
- **API**: Todas as chamadas via `lib/api.ts`

### Classes CSS de Tema

Sempre use as classes semânticas ao invés de cores diretas:

```tsx
// ✅ Correto
<div className="bg-surface-primary text-text-primary">

// ❌ Evitar
<div className="bg-gray-800 text-white">
```

Exceção: cores de status (green, red, yellow, blue, purple) para indicadores.

## Testes

### Backend

```bash
# Rodar todos os testes
mvn test

# Rodar teste específico
mvn test -Dtest=NomeDoTeste

# Com cobertura
mvn test jacoco:report
```

### Frontend

```bash
# Lint
npm run lint

# Type check
npm run build
```

## Debugging

### Backend

1. **Logs**: Ajustar `LOG_LEVEL` em `application.yml`
2. **Actuator**: `http://localhost:8080/actuator/health`
3. **Swagger**: `http://localhost:8080/swagger-ui.html`

### Frontend

1. **DevTools**: React Developer Tools
2. **Network**: Verificar chamadas API
3. **Console**: Logs de erro

## Variáveis de Ambiente

### Backend

| Variável | Descrição | Default |
|----------|-----------|---------|
| `SPRING_PROFILES_ACTIVE` | Profile ativo | `dev` |
| `DATABASE_URL` | URL do PostgreSQL | H2 |
| `DATABASE_USERNAME` | Usuário DB | `sa` |
| `DATABASE_PASSWORD` | Senha DB | - |

### Frontend

| Variável | Descrição | Default |
|----------|-----------|---------|
| `BACKEND_URL` | URL do backend | `http://localhost:8080` |
| `LOKI_URL` | URL do Loki | - |
| `LOG_LEVEL` | Nível de log | `info` |

## Build de Produção

### Backend

```bash
cd backend
mvn clean package -DskipTests
# JAR em target/loterias-analyzer-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
# Standalone em .next/standalone/
```

## Comandos Úteis

### Backend

```bash
# Limpar e compilar
mvn clean compile

# Rodar com profile específico
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Ver árvore de dependências
mvn dependency:tree
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Start produção (após build)
npm run start
```

## Troubleshooting Comum

### "Cannot resolve symbol" no IDE

```bash
mvn clean compile
# Reimportar projeto no IDE
```

### Erro de CORS

- Verificar se frontend está usando `/api/` (proxy)
- Verificar `next.config.ts` rewrites

### Tipos não atualizando

```bash
# Reiniciar TypeScript server no VSCode
Ctrl+Shift+P > TypeScript: Restart TS Server
```

### Banco não persiste dados

- H2 em memória (`jdbc:h2:mem:`) não persiste
- Para persistir, use `jdbc:h2:file:./data/loterias`

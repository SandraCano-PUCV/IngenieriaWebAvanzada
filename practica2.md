# Práctica: Observabilidad en un Backend NestJS
**Módulo:** Ingeniería continua, DevOps e infraestructura como código  
**Tema:** Logs estructurados, métricas, trazas y health checks  
**Backend:** NestJS + TypeScript  
**Herramientas:** NestJS Logger, Terminus, Prometheus, Grafana, OpenTelemetry, Jaeger y Docker Compose  
---

## 1. Propósito

Hasta ahora una aplicación puede:

```text
compilar
↓
pasar pruebas
↓
desplegarse
```

Pero después del despliegue necesitamos responder preguntas como:

- ¿El backend está disponible?
- ¿Cuántas solicitudes recibe?
- ¿Cuántas solicitudes fallan?
- ¿Cuánto demora cada endpoint?
- ¿Qué ocurrió antes de un error?
- ¿En qué parte de una petición se consume más tiempo?

Para responderlas incorporaremos **observabilidad**.

---

## 2. Telemetría y observabilidad

### Telemetría

La telemetría corresponde a los datos que una aplicación genera sobre su propio funcionamiento.

En esta práctica utilizaremos cuatro señales:

```text
Logs
Métricas
Trazas
Health checks
```

### Observabilidad

La observabilidad es la capacidad de comprender el estado interno del sistema a partir de esas señales.

```text
NestJS
  |
  +---- Logs ---------> salida JSON
  |
  +---- Métricas -----> Prometheus -----> Grafana
  |
  +---- Trazas -------> OpenTelemetry ---> Jaeger
  |
  `---- Salud --------> /health
```

---

## 3. Resultados de aprendizaje

Al finalizar la práctica, el estudiante será capaz de:

1. Configurar health checks en NestJS.
2. Generar logs estructurados en JSON.
3. Crear métricas HTTP mediante un interceptor global.
4. Exponer métricas en un endpoint `/metrics`.
5. Configurar Prometheus para recolectar métricas.
6. Construir dashboards básicos en Grafana.
7. Instrumentar NestJS con OpenTelemetry.
8. Visualizar trazas en Jaeger.
9. Analizar una falla utilizando varias señales de telemetría.
10. Diferenciar monitoreo y observabilidad.

---

## 4. Arquitectura del laboratorio

```text
                     Cliente
                        |
                        v
                  +-----------+
                  |  NestJS   |
                  +-----------+
                   |    |    |
                 logs métricas trazas
                   |    |    |
                   |    |    +------> OpenTelemetry
                   |    |                 |
                   |    |                 v
                   |    |               Jaeger
                   |    |
                   |    +------------> Prometheus
                   |                        |
                   |                        v
                   |                     Grafana
                   |
                   `----> stdout

                  GET /health
                  GET /metrics
```

---

# PARTE A — Health checks

## 5. Instalar Terminus

NestJS dispone de una integración específica para health checks:

```bash
npm install @nestjs/terminus
```

Crear módulo:

```bash
nest g module health
```

Crear controlador:

```bash
nest g controller health
```

La estructura será:

```text
src/
└── health/
    ├── health.module.ts
    └── health.controller.ts
```

---

## 6. Configurar `HealthModule`

Archivo:

```text
src/health/health.module.ts
```

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController]
})
export class HealthModule {}
```

---

## 7. Crear health check

Archivo:

```text
src/health/health.controller.ts
```

```typescript
import {
  Controller,
  Get
} from '@nestjs/common';

import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {

  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.memory.checkHeap(
          'memory_heap',
          200 * 1024 * 1024
        )
    ]);
  }
}
```

Aquí indicamos que el heap del proceso no debería superar aproximadamente 200 MB.

---

## 8. Registrar `HealthModule`

En `src/app.module.ts`:

```typescript
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule
  ]
})
export class AppModule {}
```

---

## 9. Habilitar shutdown hooks

En `src/main.ts` agregar:

```typescript
app.enableShutdownHooks();
```

Ejemplo:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
```

---

## 10. Probar health check

```bash
curl http://localhost:3000/health
```

Una respuesta saludable tendrá una estructura semejante a:

```json
{
  "status": "ok",
  "info": {
    "memory_heap": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "memory_heap": {
      "status": "up"
    }
  }
}
```

### Pregunta

Si `GET /health` devuelve `200`, ¿significa que todos los endpoints funcionan correctamente?

**Respuesta esperada:** No. Solo indica que las condiciones configuradas en el health check son satisfactorias.

---

# PARTE B — Logs estructurados

## 11. Activar JSON logging en NestJS

NestJS incluye su propio logger y puede emitir JSON estructurado.

Modificar `src/main.ts`:

```typescript
import {
  ConsoleLogger
} from '@nestjs/common';

import {
  NestFactory
} from '@nestjs/core';

import {
  AppModule
} from './app.module';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
      {
        logger:
          new ConsoleLogger({
            json: true
          })
      }
    );

  app.enableShutdownHooks();

  await app.listen(
    process.env.PORT ?? 3000
  );
}

bootstrap();
```

Ahora NestJS imprimirá registros en formato JSON.

---

## 12. Crear logs desde un servicio

En `src/products/products.service.ts`:

```typescript
import {
  Injectable,
  Logger
} from '@nestjs/common';

@Injectable()
export class ProductsService {

  private readonly logger =
    new Logger(
      ProductsService.name
    );

  findAll() {

    this.logger.log(
      'Products requested'
    );

    return [
      {
        id: 1,
        name: 'Teclado'
      }
    ];
  }
}
```

En versiones actuales de NestJS también podemos agregar metadatos estructurados:

```typescript
this.logger.log(
  'Products requested',
  {
    event: 'products_requested',
    count: 10
  }
);
```

---

## 13. ¿Qué no debemos guardar en logs?

Evitar:

```text
password
JWT completo
API keys
tokens
credenciales
datos personales innecesarios
datos financieros sensibles
```

Ejemplo incorrecto:

```typescript
this.logger.log(
  'Login',
  {
    password: dto.password
  }
);
```

---

# PARTE C — Métricas

## 14. Instalar cliente Prometheus

```bash
npm install @prometheus-io/client
```

Crear módulo:

```bash
nest g module metrics
```

Crear servicio:

```bash
nest g service metrics
```

Crear controlador:

```bash
nest g controller metrics
```

Crear interceptor:

```bash
nest g interceptor metrics/metrics
```

---

## 15. Crear `MetricsService`

Archivo:

```text
src/metrics/metrics.service.ts
```

```typescript
import {
  Injectable
} from '@nestjs/common';

import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics
} from '@prometheus-io/client';

@Injectable()
export class MetricsService {

  readonly registry =
    new Registry();

  readonly requestsTotal =
    new Counter({
      name:
        'nest_api_http_requests_total',

      help:
        'Total de solicitudes HTTP',

      labelNames: [
        'method',
        'route',
        'status_code'
      ] as const,

      registers: [
        this.registry
      ]
    });

  readonly requestDuration =
    new Histogram({
      name:
        'nest_api_http_request_duration_seconds',

      help:
        'Duración de solicitudes HTTP',

      labelNames: [
        'method',
        'route',
        'status_code'
      ] as const,

      buckets: [
        0.005,
        0.01,
        0.025,
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2.5,
        5
      ],

      registers: [
        this.registry
      ]
    });

  constructor() {

    collectDefaultMetrics({
      register: this.registry,
      prefix: 'nest_api_'
    });
  }

  startRequest(
    method: string,
    route: string
  ) {

    const endTimer =
      this.requestDuration
        .startTimer({
          method,
          route
        });

    return (
      statusCode: number
    ) => {

      const status =
        String(statusCode);

      this.requestsTotal.inc({
        method,
        route,
        status_code: status
      });

      endTimer({
        status_code: status
      });
    };
  }
}
```

---

## 16. Interceptor global de métricas

Archivo:

```text
src/metrics/metrics.interceptor.ts
```

```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';

import {
  Observable
} from 'rxjs';

import {
  finalize
} from 'rxjs/operators';

import type {
  Request,
  Response
} from 'express';

import {
  MetricsService
} from './metrics.service';

@Injectable()
export class MetricsInterceptor
  implements NestInterceptor {

  constructor(
    private readonly metrics:
      MetricsService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {

    const request =
      context
        .switchToHttp()
        .getRequest<Request>();

    const response =
      context
        .switchToHttp()
        .getResponse<Response>();

    const method =
      request.method;

    const route =
      request.route?.path
      ?? request.path;

    const finish =
      this.metrics.startRequest(
        method,
        route
      );

    return next
      .handle()
      .pipe(
        finalize(() => {

          finish(
            response.statusCode
          );
        })
      );
  }
}
```

---

## 17. Crear endpoint `/metrics`

Archivo:

```text
src/metrics/metrics.controller.ts
```

```typescript
import {
  Controller,
  Get,
  Res
} from '@nestjs/common';

import type {
  Response
} from 'express';

import {
  MetricsService
} from './metrics.service';

@Controller()
export class MetricsController {

  constructor(
    private readonly metrics:
      MetricsService
  ) {}

  @Get('metrics')
  async getMetrics(
    @Res() res: Response
  ) {

    res.setHeader(
      'Content-Type',
      this.metrics
        .registry
        .contentType
    );

    res.send(
      await this.metrics
        .registry
        .metrics()
    );
  }
}
```

---

## 18. Configurar `MetricsModule`

Archivo:

```text
src/metrics/metrics.module.ts
```

```typescript
import {
  Module
} from '@nestjs/common';

import {
  APP_INTERCEPTOR
} from '@nestjs/core';

import {
  MetricsController
} from './metrics.controller';

import {
  MetricsInterceptor
} from './metrics.interceptor';

import {
  MetricsService
} from './metrics.service';

@Module({
  controllers: [
    MetricsController
  ],

  providers: [
    MetricsService,

    {
      provide:
        APP_INTERCEPTOR,

      useClass:
        MetricsInterceptor
    }
  ],

  exports: [
    MetricsService
  ]
})
export class MetricsModule {}
```

Registrar en `AppModule`:

```typescript
@Module({
  imports: [
    HealthModule,
    MetricsModule
  ]
})
export class AppModule {}
```

---

## 19. Probar métricas

Ejecutar solicitudes:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/products
curl http://localhost:3000/products
curl http://localhost:3000/products
```

Luego:

```bash
curl http://localhost:3000/metrics
```

Buscar:

```text
nest_api_http_requests_total
```

Y:

```text
nest_api_http_request_duration_seconds
```

---

# PARTE D — Prometheus

## 20. Configurar Prometheus

Crear:

```text
observability/prometheus.yml
```

```yaml
global:
  scrape_interval: 5s

scrape_configs:

  - job_name: "nest-backend"

    metrics_path: "/metrics"

    static_configs:
      - targets:
          - "backend:3000"
```

Prometheus realizará:

```text
GET /metrics
```

cada 5 segundos.

---

# PARTE E — Trazas con OpenTelemetry

## 21. Instalar OpenTelemetry

```bash
npm install \
  @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http
```

---

## 22. Crear `instrumentation.ts`

Crear:

```text
src/instrumentation.ts
```

```typescript
import {
  NodeSDK
} from '@opentelemetry/sdk-node';

import {
  getNodeAutoInstrumentations
} from '@opentelemetry/auto-instrumentations-node';

import {
  OTLPTraceExporter
} from '@opentelemetry/exporter-trace-otlp-http';

const traceExporter =
  new OTLPTraceExporter({
    url:
      process.env
        .OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
      ??
      'http://localhost:4318/v1/traces'
  });

const sdk =
  new NodeSDK({
    traceExporter,

    instrumentations: [
      getNodeAutoInstrumentations()
    ]
  });

sdk.start();
```

La instrumentación debe cargarse antes de NestJS.

Para desarrollo, si se usa `tsx`:

```bash
npm install -D tsx
```

Agregar a `package.json`:

```json
{
  "scripts": {
    "start:observe":
      "tsx --import ./src/instrumentation.ts src/main.ts"
  }
}
```

Ejecutar:

```bash
npm run start:observe
```

---

## 23. Trace y Span

```text
Trace
=
recorrido completo de una operación

Span
=
etapa de una operación

Trace ID
=
identificador de la traza

Span ID
=
identificador de una etapa
```

Ejemplo:

```text
Trace ID: abc123
   |
   `-- GET /products
        |
        +-- HTTP
        +-- NestJS
        `-- Response
```

---

# PARTE F — Endpoints para experimentar

## 24. Crear controlador de observabilidad

```bash
nest g controller observability
```

Ejemplo:

```typescript
import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';

@Controller('observability')
export class ObservabilityController {

  private readonly logger =
    new Logger(
      ObservabilityController.name
    );

  @Get('ok')
  ok() {

    this.logger.log(
      'Request successful'
    );

    return {
      status: 'ok'
    };
  }

  @Get('slow')
  async slow() {

    this.logger.warn(
      'Slow endpoint requested'
    );

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 2000)
    );

    return {
      status: 'slow',
      duration: '2 seconds'
    };
  }

  @Get('error')
  error() {

    this.logger.error(
      'Simulated error'
    );

    throw new
      InternalServerErrorException(
        'Error simulado'
      );
  }
}
```

---

## 25. Generar señales

```bash
curl http://localhost:3000/observability/ok
```

```bash
curl http://localhost:3000/observability/slow
```

```bash
curl -i http://localhost:3000/observability/error
```

Observar:

```text
logs
métricas
trazas
```

---

# PARTE G — Docker Compose

## 26. Dockerfile para NestJS

Ejemplo:

```dockerfile
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

> Si la instrumentación se carga mediante un archivo compilado, el comando de inicio debe adaptarse para que OpenTelemetry se cargue antes de `main.js`.

---

## 27. Docker Compose

En la raíz:

```text
docker-compose.observability.yml
```

```yaml
services:

  backend:
    build:
      context: ./backend

    container_name:
      nest-backend

    environment:
      NODE_ENV: production
      OTEL_SERVICE_NAME: nest-backend
      OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
        http://jaeger:4318/v1/traces

    ports:
      - "3000:3000"

    depends_on:
      - jaeger


  prometheus:
    image:
      prom/prometheus:latest

    container_name:
      prometheus

    volumes:
      - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml:ro

    ports:
      - "9090:9090"

    depends_on:
      - backend


  grafana:
    image:
      grafana/grafana:latest

    container_name:
      grafana

    ports:
      - "3001:3000"

    depends_on:
      - prometheus


  jaeger:
    image:
      cr.jaegertracing.io/jaegertracing/jaeger:2.21.0

    container_name:
      jaeger

    ports:
      - "16686:16686"
      - "4317:4317"
      - "4318:4318"
```

---

## 28. Levantar stack

```bash
docker compose \
  -f docker-compose.observability.yml \
  up --build
```

Servicios:

| Servicio | URL |
|---|---|
| NestJS | `http://localhost:3000` |
| Prometheus | `http://localhost:9090` |
| Grafana | `http://localhost:3001` |
| Jaeger | `http://localhost:16686` |

---

# PARTE H — Consultas Prometheus

## 29. Total de solicitudes

```promql
nest_api_http_requests_total
```

## 30. Requests por segundo

```promql
rate(
  nest_api_http_requests_total[1m]
)
```

## 31. Errores 5xx

```promql
sum(
  rate(
    nest_api_http_requests_total{
      status_code=~"5.."
    }[1m]
  )
)
```

## 32. Latencia promedio aproximada

```promql
rate(
  nest_api_http_request_duration_seconds_sum[1m]
)
/
rate(
  nest_api_http_request_duration_seconds_count[1m]
)
```

---

# PARTE I — Grafana

## 33. Crear dashboards

Abrir:

```text
http://localhost:3001
```

Agregar Prometheus como datasource:

```text
http://prometheus:9090
```

Crear un panel:

```text
Requests por segundo
```

con:

```promql
rate(
  nest_api_http_requests_total[1m]
)
```

Crear otro:

```text
Errores HTTP 5xx
```

con:

```promql
sum(
  rate(
    nest_api_http_requests_total{
      status_code=~"5.."
    }[1m]
  )
)
```

---

# PARTE J — Jaeger

## 34. Observar trazas

Generar tráfico:

```bash
for i in {1..10}
do
  curl -s \
    http://localhost:3000/observability/ok \
    > /dev/null
done
```

Abrir:

```text
http://localhost:16686
```

Seleccionar:

```text
nest-backend
```

Identificar:

```text
Trace ID
duración
spans
endpoint
status HTTP
```

---

# PARTE K — Análisis de fallas

## 35. Ejecutar endpoint con error

```bash
curl -i \
  http://localhost:3000/observability/error
```

Analizar:

### Logs

```text
¿aparece un error?
¿qué contexto entrega?
```

### Métricas

```promql
sum(
  rate(
    nest_api_http_requests_total{
      status_code=~"5.."
    }[1m]
  )
)
```

### Trazas

```text
¿qué duración tuvo?
¿qué status aparece?
¿qué spans se generaron?
```

---

## 36. Analizar endpoint lento

```bash
curl \
  http://localhost:3000/observability/slow
```

Esperar aproximadamente 2 segundos.

Luego revisar:

```text
histograma de latencia
traza
log de warning
```

---

# PARTE L — Integración posterior con CD

Cuando exista un entorno `staging`, GitHub Actions puede verificar:

```text
GET /health
```

Ejemplo:

```yaml
- name: Health check backend
  run: |
    curl \
      --fail \
      --silent \
      --show-error \
      "${{ vars.STAGING_API_URL }}/health"
```

El CD no reemplaza a Prometheus.

```text
GitHub Actions
→ comprobación puntual después del deploy

Prometheus
→ monitoreo continuo

Grafana
→ visualización

Jaeger
→ análisis de trazas
```

---

# 37. Evidencias solicitadas

Cada equipo debe presentar:

1. Respuesta saludable de `GET /health`.
2. Un log JSON generado por NestJS.
3. El endpoint `GET /metrics` funcionando.
4. Una consulta Prometheus de `nest_api_http_requests_total`.
5. Un panel Grafana.
6. Una traza en Jaeger.
7. Evidencia del endpoint `/observability/error`.
8. Evidencia del endpoint `/observability/slow`.
9. Breve análisis relacionando logs, métricas y trazas.

---

# 38. Preguntas de análisis

1. ¿Cuál es la diferencia entre telemetría y observabilidad?
2. ¿Qué información entrega un health check?
3. ¿Por qué `/health = 200` no garantiza que toda la aplicación funcione?
4. ¿Qué ventaja tiene un log JSON frente a texto libre?
5. ¿Qué datos sensibles no deberían aparecer en logs?
6. ¿Cuál es la diferencia entre Counter, Gauge e Histogram?
7. ¿Cuál es la función de Prometheus?
8. ¿Cuál es la función de Grafana?
9. ¿Cuál es la función de OpenTelemetry?
10. ¿Cuál es la función de Jaeger?
11. ¿Qué es un Trace ID?
12. ¿Qué es un Span?
13. ¿Qué señal usarías primero para investigar latencia?
14. ¿Qué señales combinarías para investigar un error 500?
15. ¿Por qué métricas, logs y trazas son complementarias?

---

# 39. Desafío adicional: PostgreSQL

Si el proyecto utiliza PostgreSQL con Prisma, extender el health check para incluir la base de datos.

La idea será:

```text
GET /health
   |
   +-- memoria
   |
   `-- PostgreSQL
```

De esta manera la readiness del backend será más representativa.

Investigar el uso de:

```text
PrismaHealthIndicator
```

---

# 40. Desafío adicional: métrica de negocio

Crear:

```text
products_created_total
```

Cada vez que se ejecute:

```text
POST /products
```

la métrica debe incrementarse.

Esto permite diferenciar:

```text
métricas técnicas
```

de:

```text
métricas de negocio
```

---

# 41. Síntesis

```text
NestJS
  |
  +-- Logger JSON
  |
  +-- Terminus
  |     `-- /health
  |
  +-- MetricsInterceptor
  |     `-- /metrics
  |
  +-- OpenTelemetry
  |     `-- trazas
  |
  +-- Prometheus
  |
  +-- Grafana
  |
  `-- Jaeger
```

La observabilidad surge cuando podemos combinar:

```text
logs
+
métricas
+
trazas
+
health checks
```

para responder preguntas sobre el comportamiento interno de la aplicación.

---

# 42. Referencias

- NestJS — Logger  
  https://docs.nestjs.com/application/logger

- NestJS — Health checks / Terminus  
  https://docs.nestjs.com/recipes/terminus

- NestJS — Deployment  
  https://docs.nestjs.com/deployment

- OpenTelemetry JavaScript  
  https://opentelemetry.io/docs/languages/js/

- OpenTelemetry Node.js  
  https://opentelemetry.io/docs/languages/js/getting-started/nodejs/

- Prometheus JavaScript Client  
  https://github.com/prometheus/client_js

- Grafana Prometheus datasource  
  https://grafana.com/docs/grafana/latest/datasources/prometheus/

- Jaeger  
  https://www.jaegertracing.io/docs/

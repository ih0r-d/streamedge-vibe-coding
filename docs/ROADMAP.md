# 🧭 StreamEdge Roadmap

**StreamEdge** is a modular microservice-based platform for real-time video view tracking and analytics.  
It blends Kafka (for events), gRPC (for internal service communication), WebFlux, Keycloak (auth), and modern observability tools.

---

## 📌 Phase 0 — Bootstrapping

> Goal: scaffold everything needed for dev + docs

- [x] Define technical stack and architectural direction
- [ ] C4 diagrams: System Context + Container
- [ ] C4 diagram tooling (PlantUML)
- [x] Project skeleton (services, Taskfile, Docker Compose, Gradle, configs)
- [x] Mongo/PostgreSQL init with auth
- [x] Prometheus + Grafana config with dashboards
- [x] Taskfile with dev automation
- [ ] gRPC toolchain + initial `.proto`
- [ ] Keycloak container with `streamedge` realm + test client

---

## 🚀 Phase 1 — Core Services (v0.1)

> Goal: get the minimal system running with real-time view processing, gRPC, and REST API gateway

### 🎛 `gateway-service`

- **Role**: Single entry point for all external API requests
- **Tech stack**: Java 24, Spring Boot 3.x, Spring Cloud Gateway, WebFlux, OpenAPI
- **Business logic**:
    - Forward requests to internal services
    - Handle JWT token validation (via Keycloak)
    - Basic rate limiting (optional)
- **To implement**:
    - `GET /videos`
    - `POST /views`
    - Token extraction & validation (JWT)
    - OpenAPI doc auto-generation
- **Communication**: REST → internal services, forward auth header

---

### 👤 `user-service`

- **Role**: User profile & identity provider integration
- **Tech stack**: Kotlin, Spring Boot, PostgreSQL 18, Liquibase, WebFlux
- **Business logic**:
    - User registration / profile management
    - Sync with Keycloak user info (optional)
- **To implement**:
    - Liquibase changelog (users table)
    - REST API: `GET /me`, `PUT /me`
    - gRPC server (optional: to expose user info to other services)

---

### 📼 `video-service`

- **Role**: Manage and expose video metadata
- **Tech stack**: Kotlin, Spring Boot, MongoDB 7, WebFlux, gRPC server
- **Business logic**:
    - Video CRUD: title, genre, duration, tags
    - Video enrichment from external public APIs
- **To implement**:
    - gRPC endpoint: `GetVideoMeta(video_id)`
    - REST: `GET /videos`, `POST /videos`
    - MongoDB document schema (video_id, title, tags, etc.)
    - WebClient integration to fetch data from:
        - [TMDb API](https://developer.themoviedb.org/)
        - [OMDb API](https://omdbapi.com/)
    - Enrichment strategy:
        - Fetch by keyword/title from TMDb
        - Cache result in local Mongo
        - Use when creating or editing video metadata
- **Communication**:
    - gRPC ← `analytics-service`
    - REST ← `gateway-service`

---

### 👁 `view-service`

- **Role**: Handle view tracking events, push to Kafka
- **Tech stack**: Java 24, Spring Boot, WebFlux, Kafka producer
- **Business logic**:
    - Accepts view events from users (auth-based)
    - Publishes structured event to Kafka topic: `view-events`
    - Can simulate synthetic traffic for testing/analytics
- **To implement**:
    - REST endpoint: `POST /views`
    - Kafka integration + producer config
    - Event model: videoId, userId, timestamp, userAgent
    - View simulation (for local/dev/demo use):
        - `task simulate:views` (shell script or Kotlin runner)
        - Optional `view-generator` module (Java app sending views to REST API)
        - Integration with static datasets (e.g. [Kaggle YouTube Trending](https://www.kaggle.com/datasets/datasnaek/youtube-new))
- **Communication**:
    - REST ← `gateway-service`
    - Kafka → `analytics-service`

---

### 📊 `analytics-service`

- **Role**: Consume view events and compute analytics
- **Tech stack**: Kotlin, Spring Boot, Kafka consumer, MongoDB 7, WebFlux, gRPC client
- **Business logic**:
    - Consume `view-events` from Kafka
    - Resolve video metadata via gRPC
    - Persist aggregate metrics
    - Provide analytics APIs (popular videos, time range, etc.)
- **To implement**:
    - Kafka consumer setup
    - gRPC client to `video-service`
    - MongoDB analytics collection
    - REST: `GET /analytics/top`
- **Communication**:
    - Kafka ← `view-service`
    - gRPC → `video-service`
    - REST ← `gateway-service`

---

## 🔒 Phase 2 — Authentication

- [ ] Integrate Keycloak (dockerized, Realm: `streamedge`)
- [ ] Secure Gateway with OAuth2 Resource Server (`Authorization: Bearer <token>`)
- [ ] Add `spring-security` config to internal services (read-only scopes)
- [ ] Add test Keycloak user for local dev

---

## 📈 Phase 3 — Observability

- [ ] Expose `/actuator/prometheus` from all services
- [ ] Grafana dashboard: Kafka throughput, top N videos, JVM metrics
- [ ] Optional: add distributed tracing (Jaeger/Zipkin)

---

## 🧪 Phase 4 — Testing & Docs

- [ ] Unit & integration tests (JUnit, Testcontainers)
- [ ] gRPC tests (`video-service`)
- [ ] API Docs via Swagger/OpenAPI
- [ ] GitHub Actions: build, test, format
- [ ] Full project README

---

## 🛠️ Phase 5 — Experimental & Infra

- [ ] Vault integration (secrets, token storage)
- [ ] Helm charts / K8s manifests
- [ ] Chaos testing with ToxiProxy
- [ ] Canary rollout demo via traffic splitting

---

## 📦 Service Overview

| Service             | Stack                                 | Key Interfaces        |
|---------------------|---------------------------------------|-----------------------|
| `gateway-service`   | Java, Spring Gateway, WebFlux         | REST, JWT             |
| `user-service`      | Kotlin, PostgreSQL, Liquibase         | REST, (optional gRPC) |
| `video-service`     | Kotlin, MongoDB, gRPC, WebFlux        | gRPC, REST            |
| `view-service`      | Java, Kafka producer, WebFlux         | REST, Kafka           |
| `analytics-service` | Kotlin, Kafka consumer, MongoDB, gRPC | REST, gRPC, Kafka     |

---

> This roadmap is actively evolving with the development process.

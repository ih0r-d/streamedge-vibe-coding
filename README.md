# 📺 StreamEdge — Platform for Real-Time Video Tracking and Analytics

StreamEdge is a high-performance, event-driven microservice platform built with the latest Java and Kotlin technologies.  
It simulates a real-world video streaming analytics backend — a clone-style project inspired by the needs of platforms like Megogo or Netflix.

## 🚀 Key Features

- ✅ Java 24 + Virtual Threads (Project Loom)
- ✅ Kotlin (for fast dev and analytics DSL)
- ✅ Microservice architecture with Kafka event backbone
- ✅ Reactive programming with RxJava3 / Reactor
- ✅ Real-time analytics from user view events
- ✅ PostgreSQL + MongoDB hybrid data model
- ✅ Prometheus + Spring Actuator monitoring
- ✅ Dockerized services with optional Kubernetes deployment
- ✅ 🛠 Taskfile runner for easy dev automation

---

## 🧰 Requirements

To run and develop StreamEdge locally, you will need:

### 📦 System

- **Java 24 SDK**
- **Kotlin 1.9+**
- **Docker + Docker Compose**
- **Taskfile.dev runner**  
  Install: `brew install go-task/tap/go-task` or [taskfile.dev](https://taskfile.dev/#/installation)

### 🗃 Dependencies (auto via Docker)

- **PostgreSQL 18** — for user-service
- **MongoDB 7+** — for video/analytics
- **Apache Kafka** — for event stream
- **Prometheus + Grafana** — for monitoring
- **Redis (optional)** — for caching

---
## 📁 Project Structure

```plaintext
streamedge/
│
├── gateway-service/          # API Gateway (Spring Cloud Gateway + WebFlux)
├── user-service/             # User management service (PostgreSQL, Liquibase)
├── video-service/            # Video catalog service (MongoDB, gRPC)
├── view-service/             # View ingestion service (Kafka producer)
├── analytics-service/        # Analytics processing (Kafka consumer, MongoDB, gRPC)
├── admin-ui/                 # Optional admin dashboard (UI)
│
├── config/                   # External service configurations
│   ├── mongo-init.js         # MongoDB initialization script
│   ├── prometheus.yml        # Prometheus config
│   └── grafana/              # Grafana config (dashboards + datasources)
│       ├── dashboards/
│       │   └── streamedge-overview.json
│       └── provisioning/
│           ├── dashboards/default.yaml
│           └── datasources/prometheus.yaml
│
├── docs/                     # Architecture docs & roadmap
│   ├── ROADMAP.md            # Project phases and service plans
│   └── architecture/         # C4 diagrams in PlantUML
│       ├── context.puml
│       └── architecture.puml
│
├── k8s/                      # Kubernetes manifests (optional)
├── Taskfile.yml              # Dev automation commands
├── docker-compose.yml        # Local orchestration of infrastructure
└── README.md                 # Project intro and usage
```

---

## ⚙️ Local Development

> Prerequisites: Docker + Java 24 SDK + Kafka + `task` runner

```bash
# Clone repo
git clone https://github.com/your-username/streamedge-vibe-coding.git
cd streamedge-vibe-coding

# Start dev environment
task dev

# Useful commands
task build          # Build all services
task kafka:reset    # Drop Kafka topic
task db:migrate     # Run DB migrations
task logs           # Tail logs
task stop           # Stop containers
```

---

## 🛠 Taskfile (local runner)

`Taskfile.yml` lets you run dev commands simply using `task`.

Install Task runner:  
```bash
brew install go-task/tap/go-task         # Mac
curl -sL https://taskfile.dev/install.sh | sh   # Linux
```

Example `Taskfile.yml`:
```yaml
version: '3'

tasks:
  dev:
    desc: Start local dev environment (docker-compose)
    cmds:
      - docker-compose up --build

  stop:
    desc: Stop docker-compose stack
    cmds:
      - docker-compose down

  build:
    desc: Build all services
    cmds:
      - ./mvnw clean install -DskipTests

  kafka:reset:
    desc: Reset Kafka topics
    cmds:
      - docker-compose exec kafka kafka-topics.sh --delete --topic view-events --bootstrap-server localhost:9092 || true

  logs:
    desc: Tail all logs
    cmds:
      - docker-compose logs -f
```

---

## 📊 Monitoring

- Each service exposes metrics via `/actuator/prometheus`
- Prometheus scrapes metrics
- Grafana dashboards for:
  - Request latency
  - Kafka throughput
  - Custom view-event metrics

---

## 🔀 Git Workflow & Commit Convention

We follow a lightweight Git flow:

### 📂 Branching

- `main` — stable builds
- `dev` — active development
- `feature/*` — new features
- `bugfix/*` — bug fixes
- `chore/*` — configs/tooling

### ✍️ Commit Format (Conventional Commits)

```
<type>(scope): short message
```

| Type      | Purpose                           |
|-----------|-----------------------------------|
| feat      | new feature                       |
| fix       | bug fix                           |
| chore     | non-code changes, tooling         |
| docs      | documentation updates             |
| refactor  | code restructuring                |
| test      | testing only                      |
| perf      | performance tweaks                |
| style     | formatting, linting               |

**Examples**:
```
feat(view-service): add Kafka producer
fix(user-service): null check on login
chore : add Taskfile commands
```

---

## 📌 Future Ideas

- WebSocket metrics dashboard
- Gatling load testing integration
- Service discovery with Consul
- GraphQL API layer
- Distributed tracing with Zipkin/Jaeger

---

## 🧠 Why This Project?

This project showcases modern Java and Kotlin development using production-grade tools and architecture.  
It reflects:

- System design skills
- Reactive and event-driven backend
- Real DevOps and observability patterns
- Learning by building — vibe coding, not just theory

---

## 📸 Architecture Diagrams

Diagrams available in [`/docs/architecture/`](./docs/architecture/)  
- `architecture.puml` — PlantUML base
- `context.puml` — C4 Level 1: System Context
- `container.puml` — C4 Level 2: Container diagram _(coming soon)_

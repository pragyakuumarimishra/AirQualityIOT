# Air Quality IoT

A **Hybrid AI-IoT Community-Driven Air Quality Monitoring and Forecasting System** built with Next.js, TypeScript, and PostgreSQL. The platform collects data from IoT sensor stations, mobile units, and citizen smartphones, then uses AI to forecast air quality and engage communities through gamification and health alerts.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

**System Flow:**

```
Data Sources (IoT Sensors, Mobile Units, Citizen Smartphones)
    ↓
Hybrid Data Acquisition Network
    ↓
AI-Powered Processing (AQI Calculation, Forecasting, Anomaly Detection)
    ↓
Web Application (Dashboard, Map, Forecasts, Health Alerts, Community)
    ↓
Policy Dashboard + Community Engagement + Gamification
```

**Application Pages:**

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/dashboard` | Real-time AQI per station, summary stats |
| Map | `/map` | Interactive Leaflet map with AQI-colored markers |
| Forecast | `/forecast` | 24-hour AI predictions + 7-day historical charts |
| Health Alerts | `/health` | Alert feed with group-specific recommendations |
| Community | `/community` | Posts feed, leaderboard, gamification badges |

---

## Features

### ✅ Implemented (MVP)
- **AQI Dashboard** – Real-time air quality index display with color-coded indicators (PM2.5, PM10, NO2, O3, CO, SO2)
- **Interactive Map** – Leaflet-based map with sensor station markers and AQI overlays
- **AI Forecast** – 24-hour predictions and 7-day historical trend charts (Chart.js)
- **Health Alerts** – Alerts and recommendations tailored to sensitive groups (children, elderly, etc.)
- **Community Feed** – User posts, leaderboard, and gamification badges
- **PWA / Offline Mode** – Service worker with cache-first strategy for offline access
- **REST API** – Mock data layer; no live database required to run locally

### 🔜 Planned
- Real IoT sensor integration (MQTT / CoAP)
- User authentication (NextAuth.js)
- Live PostgreSQL database with Prisma ORM
- WebSocket real-time updates
- Mobile app (React Native)
- UAV/drone swarm monitoring integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, TypeScript |
| Styling | Tailwind CSS, Headless UI, Heroicons |
| Maps | Leaflet, React-Leaflet |
| Charts | Chart.js, React-ChartJS-2 |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth.js |
| PWA | Service Worker (`public/sw.js`) |

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx      # AQI dashboard
│   ├── map/page.tsx            # Interactive sensor map
│   ├── forecast/page.tsx       # AI forecast charts
│   ├── health/page.tsx         # Health alerts
│   ├── community/page.tsx      # Community feed
│   └── layout.tsx              # Root layout with navigation
├── components/
│   ├── AQIDisplay.tsx          # AQI value + color indicator
│   ├── InteractiveMap.tsx      # Leaflet map (SSR disabled)
│   ├── ForecastChart.tsx       # Chart.js forecast (dynamic import)
│   ├── HealthAlerts.tsx        # Alert feed component
│   ├── CommunityFeed.tsx       # Posts + leaderboard
│   └── Navigation.tsx          # Top navigation bar
├── lib/
│   ├── api.ts                  # API client helpers
│   ├── database.ts             # Prisma client singleton
│   └── utils.ts                # getAQIInfo(aqi) and helpers
└── types/
    └── index.ts                # Shared TypeScript types
app/api/
├── sensors/current/route.ts    # GET current sensor readings
├── sensors/historical/route.ts # GET historical data
├── forecast/predict/route.ts   # GET AI predictions
├── health/alerts/route.ts      # GET health alerts
└── community/posts/route.ts    # GET|POST community posts
prisma/
└── schema.prisma               # Database schema
public/
├── manifest.json               # PWA manifest
└── sw.js                       # Service worker
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** or **yarn**
- **PostgreSQL** (only needed for live data; mock data works without it)

### Installation

```bash
# Clone the repository
git clone https://github.com/pragyakuumarimishra/AirQualityIOT.git
cd AirQualityIOT

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database (required for live data; skip for mock data)
DATABASE_URL="postgresql://user:password@localhost:5432/airqualityiot"

# NextAuth (required for authentication)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup (optional)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app starts with mock data so no database is required.

---

## API Reference

All endpoints return JSON. The current implementation uses mock data.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sensors/current` | Current readings from all stations |
| `GET` | `/api/sensors/historical` | Historical data (last 7 days) |
| `GET` | `/api/forecast/predict` | 24-hour AQI forecast |
| `GET` | `/api/health/alerts` | Active health alerts |
| `GET` | `/api/community/posts` | Community posts feed |
| `POST` | `/api/community/posts` | Submit a new community post |

### AQI Level Reference

| AQI Range | Level | Color | Health Impact |
|-----------|-------|-------|---------------|
| 0–50 | Good | 🟢 Green | No health concern |
| 51–100 | Moderate | 🟡 Yellow | Unusually sensitive people |
| 101–150 | Unhealthy for Sensitive Groups | 🟠 Orange | Sensitive groups affected |
| 151–200 | Unhealthy | 🔴 Red | Everyone may be affected |
| 201–300 | Very Unhealthy | 🟣 Purple | Health alert for all |
| 301+ | Hazardous | 🟤 Maroon | Emergency conditions |

---

## Database Schema

```sql
CREATE TABLE sensor_stations (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  latitude  DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status    VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE air_quality_data (
  id         SERIAL PRIMARY KEY,
  station_id INTEGER REFERENCES sensor_stations(id),
  timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pm25       DECIMAL(8, 2),
  pm10       DECIMAL(8, 2),
  no2        DECIMAL(8, 2),
  o3         DECIMAL(8, 2),
  co         DECIMAL(8, 2),
  so2        DECIMAL(8, 2),
  aqi        INTEGER
);

CREATE TABLE forecasts (
  id            SERIAL PRIMARY KEY,
  station_id    INTEGER REFERENCES sensor_stations(id),
  forecast_time TIMESTAMP,
  predicted_aqi INTEGER,
  confidence    DECIMAL(5, 2)
);

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  username   VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_posts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_alerts (
  id          SERIAL PRIMARY KEY,
  station_id  INTEGER REFERENCES sensor_stations(id),
  alert_level VARCHAR(50),
  message     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Roadmap

### Phase 1 – MVP ✅
- [x] Next.js project with TypeScript and Tailwind CSS
- [x] AQI Dashboard with real-time display
- [x] Interactive Leaflet map
- [x] Forecast charts (Chart.js)
- [x] Health alert system
- [x] Community feed with gamification
- [x] PWA / offline mode (service worker)
- [x] REST API with mock data layer
- [x] Prisma database schema

### Phase 2 – Live Data & Auth 🔜
- [ ] Connect PostgreSQL database (replace mock data)
- [ ] Implement NextAuth.js user authentication
- [ ] Add real IoT sensor data ingestion (MQTT broker)
- [ ] WebSocket / Server-Sent Events for live updates
- [ ] Automated data refresh every 30 seconds

### Phase 3 – Advanced Features 🔜
- [ ] Machine learning model for AQI forecasting
- [ ] UAV / drone swarm data integration
- [ ] Mobile app (React Native)
- [ ] Push notifications for health alerts
- [ ] Admin / policy dashboard
- [ ] CI/CD pipeline and automated tests

---

## Contributing

### Submitting a Pull Request

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request against the `main` branch on GitHub

### How to Review and Accept (Merge) a Pull Request

Once a pull request has been opened, the repository owner or a collaborator can review and merge it:

#### On GitHub (recommended)

1. Go to the repository on GitHub: `https://github.com/pragyakuumarimishra/AirQualityIOT`
2. Click the **"Pull requests"** tab at the top of the page
3. Click the pull request you want to review
4. Review the **Files changed** tab to see what was changed
5. Optionally leave review comments or approve the changes:
   - Click **"Review changes"** → select **"Approve"** → click **"Submit review"**
6. Scroll down to the bottom of the PR page
7. Click **"Merge pull request"** → then **"Confirm merge"**
8. Optionally click **"Delete branch"** to clean up the feature branch

> **Tip:** If the PR is marked as a **Draft**, click **"Ready for review"** first before merging.

#### Merge Options

| Option | When to use |
|--------|-------------|
| **Merge commit** | Keeps full history; creates a merge commit |
| **Squash and merge** | Combines all commits into one; cleaner history |
| **Rebase and merge** | Replays commits on top of `main`; linear history |

#### Using the GitHub CLI

```bash
# Install GitHub CLI: https://cli.github.com
gh pr list                        # List open pull requests
gh pr view <PR-number>            # View PR details
gh pr review <PR-number> --approve
gh pr merge <PR-number> --merge   # or --squash / --rebase
```

---

## License

This project is open source. See [LICENSE](LICENSE) for details.

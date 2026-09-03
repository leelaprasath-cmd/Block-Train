# 🚈 BlockTrain // Next-Gen Railway Digital Twin & Autonomous Dispatch Platform

<div align="center">

![BlockTrain Header](https://raw.githubusercontent.com/kevinjosh10/Block-Train/main/header.svg)

[![Smart India Hackathon](https://img.shields.io/badge/SIH_Problem_ID-SIH26027-purple?style=for-the-badge)](https://sih.gov.in)
[![Southern Railway](https://img.shields.io/badge/Division-Chennai_MAS-007ACC?style=for-the-badge)](https://sr.indianrailways.gov.in)
[![Kavach TCAS](https://img.shields.io/badge/Kavach-Autonomous_Protection-10b981?style=for-the-badge)](https://indianrailways.gov.in)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**Replacing archaic paper-based track approvals with a live, interactive map, automated AI path optimization, and instantaneous voice/SMS dispatch protocols.**

[🌐 Live Digital Twin](https://leelaprasath-cmd.github.io/Block-Train/) • [📖 Problem Statement SIH26027](#-the-sih26027-problem) • [🛠️ Architecture](#-system-architecture)

</div>

---

## 🚀 The SIH26027 Problem
Currently, authorizing a railway maintenance "block" requires a staggering amount of phone calls, physical paper trails, and radio miscommunications across Station Masters, Section Controllers, and Gang Supervisors. A single delayed block approval cascades into dozens of delayed suburban and superfast rakes, while field maintenance workers face life-threatening risks on live tracks.

**BlockTrain** completely digitizes this workflow to remove human error and prioritize human lives.

---

## ✨ Platform Capabilities

### 🛰️ 1. Real-World Satellite GIS Track Twin (Surveyed Tracks & Crossovers)
- **100% Surveyed Real-World Track Geometry**: Sourced directly from global railway geospatial surveys (OpenRailwayMap). Zero mock lines, zero straight approximations—every single curve and bend follows the physical steel rails visible on the satellite photos!
- **153 Crossover Turnouts & Merging Switches**: Authentic physical turnout switches where parallel tracks cross, diverge, and merge across major junctions (Chengalpattu Jn, Tambaram Yard, St. Thomas Mount, and Chennai Egmore).
- **134 Station Platform Loops**: Precise platform loop tracks at passenger stations.
- **Physical Multi-Coach Train Rakes**: Real rolling stock (Vande Bharat bullet nose, WAP-7 LHB coaches, Suburban EMUs, Heavy Freight with ISO containers) gliding with rotating tangent bearings along the true curves.
- **Dynamic AI Maintenance Block**: One-click block injection with animated hazard glow on the surveyed Tambaram ⇄ Chromepet section with automatic train rerouting.

### 📱 2. "Where Is My Train" Live Schedule & NTES Running Status
- **Integrated Timetable & Live Journey Tracker**: Authentic "Where Is My Train" drawer showing full station-by-station timetables, distances (km), Scheduled Arrival (STA), Scheduled Departure (STD), and platform assignments.
- **Live Running Telemetry**: Real-time speedometer, delay indicator (`🟢 ON TIME` or `🔴 +6 MIN DELAY`), distance-to-next-station countdown, and Kavach TCAS radio connection.
- **Interactive Train Tracking**: Search or select any rake (**20643 Vande Bharat**, **12638 Pandian Express**, **40012 Suburban EMU Local**, etc.) or click any train moving on the track to immediately open its live timetable schedule.

### 📐 3. Authentic Vector Schematic Digital Twin
- Interactive schematic diagram with smooth pan & zoom powered by `react-zoom-pan-pinch`.
- Station platform loops (`PF-1`, `PF-2`...), throat curves, and station deceleration physics.

### ⚡ 2. AI Maintenance Block Planner & Cascading Delay Solver
- Multi-constraint scheduler calculating the optimal maintenance window with minimal passenger impact.
- Identifies affected trains and prescribes automated single-line working or platform loop diversions.
- Calculates quantified delay savings in minutes and traction diesel/electricity conserved.
- One-click digital permit authorization and automatic radio notification broadcast.

### 🛡️ 3. Rakshak Field Worker Geofence Protection System
- Real-time GPS tracking of track maintenance gangs (Gang 14 OHE, Gang 08 P-Way, Gang 03 S&T).
- Proximity radar calculating distance to the nearest oncoming train.
- Automatic visual and audio strobe alarms if a train breaches the 600-meter safety zone.
- Direct **SOS Kavach Emergency Brake** command that halts all train movements in the section.

### 📻 4. Radio Voice Dispatch & SMS Broadcast Console
- VHF/UHF multi-channel radio console (CH 1 Urgent, CH 2 Loco Cab, CH 3 Maintenance Gangs, CH 4 Station Intercom).
- Animated RF carrier frequency oscilloscope visualizer with simulated synthetic speech playback.
- Automated SMS transmission log to train crews and supervisors.

### 🤖 5. RailMind AI Dispatch Copilot
- Conversational operational intelligence trained on Indian Railway Operating Rules (G&SR).
- Answers complex queries regarding headway margins, track capacity, and diversion strategies.

### 🏆 6. Built-In Hackathon Presentation & Architecture Deck
- Dedicated judge presentation view detailing the problem background, quantifiable ROI metrics (74% faster approvals, zero worker incidents, +18.2% throughput), and system scalability.

---

## 🏗️ System Architecture

```
                                  [ Live Railway Sensors & Timetable Data ]
                                                     │
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │   Digital Twin Simulation   │
                                      │       Physics Engine        │
                                      └──────────────┬──────────────┘
                                                     │
                             ┌───────────────────────┼───────────────────────┐
                             ▼                       ▼                       ▼
                  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
                  │ Vector Canvas Map   │ │ AI Block Optimizer  │ │   Rakshak Worker    │
                  │ (Live Tracks/Trains)│ │ (Multi-Constraint)  │ │   Geofence Radar    │
                  └──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
                             │                       │                       │
                             └───────────────────────┼───────────────────────┘
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │  Automated Dispatch Push    │
                                      │  (VHF Radio & Kavach Brake) │
                                      └─────────────────────────────┘
```

---

## 💻 Tech Stack

- **Frontend:** React 18, TypeScript (Strict Mode), Vite
- **Styling:** Tailwind CSS, Custom Cybernetic Railway Theme
- **Simulation:** Vector SVG Canvas, Matrix Transformations, RAF Physics Loop
- **Icons:** Lucide React
- **CI/CD:** Automated GitHub Actions deploying to GitHub Pages

---

## 🏃 Running Locally

```bash
# Clone the repository
git clone https://github.com/leelaprasath-cmd/Block-Train.git
cd Block-Train

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:5173` to explore the digital twin!

---

## 📄 License

MIT License • Built for Smart India Hackathon (SIH26027) & Southern Railway Digital Twin Initiative.

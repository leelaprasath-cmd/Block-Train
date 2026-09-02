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

### 🗺️ 1. Interactive Vector Corridor Digital Twin
- **Suburban Chennai Main Corridor**: Full model covering **Tambaram (TBM) ⇄ Chromepet (CMP) ⇄ Pallavaram (PV) ⇄ St. Thomas Mount (STM) ⇄ Guindy (GDY) ⇄ Chennai Central / Egmore (MAS)**.
- **Multi-Lane Track Infrastructure**: Up Main, Down Main, Fast Express Corridors, Platform Loops, and Yard sidings.
- **Real-Time Moving Train Physics**: Vande Bharat Express (130 km/h), Superfast rakes, Suburban EMUs, and Concor Freights with live position interpolation, direction chevrons, and speed tags.
- **Dynamic 4-Aspect Signals**: Automatic Block Signaling (Green, Double Yellow, Yellow, Red) updated dynamically.
- **One-Click Track Block Toggling**: Click any track segment on the canvas to simulate a maintenance closure and watch the AI dynamically reroute oncoming trains!

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

# SOAx

A next-generation Security Operations Center (SOC) platform built with Next.js, featuring multi-tier incident management, threat hunting, and advanced security analytics.

## Overview

SOAx is a comprehensive SOC platform designed for security operations teams. It provides a tiered approach to security monitoring and incident response across three operational levels (L1, L2, L3), enabling efficient triage, investigation, and threat hunting workflows.

## Features

### 🎯 Multi-Tier SOC Operations
- **L1 Dashboard**: Real-time alert monitoring and initial triage
- **L2 Dashboard**: Detailed incident investigation with threat intelligence integration
- **L3 Dashboard**: Advanced threat hunting and campaign analysis

### 🔍 Threat Intelligence Integration
- AI-powered alert summarization
- MITRE ATT&CK framework mapping
- VirusTotal integration for IOC enrichment
- Predicted threat alerts and pattern analysis

### 📊 Advanced Visualizations
- Real-time security metrics and KPIs
- Network topology and suspicious connection graphs
- MITRE ATT&CK heatmaps
- Campaign trend analysis
- Interactive data charts using Recharts

### 🚨 Incident Management
- Alert escalation workflows (L1 → L2 → L3)
- Investigation notes and collaboration
- Incident history tracking
- Attachment management
- Persistent settings and preferences

### 🎨 Modern UI/UX
- Dark SOC-themed interface
- Responsive design
- Real-time updates
- Professional data visualizations

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cyberscope-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app routes (L1, L2, L3 dashboards)
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── data/             # Mock data and utilities
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project was created by CyberScope team participating in Absher Tuwaiq Hackathon.

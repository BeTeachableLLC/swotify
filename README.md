# Swotify 

A **Next.js** web app that guides users through a business **SWOT-style questionnaire** (strengths, weaknesses, opportunities, threats). Answers are scored into quadrants, shown with charts, and can be exported to **PDF**. Optional **GoHighLevel (Lead Connector)** API routes sync contacts, attach files, and trigger workflows.

## Overview

The home experience is a multi-step assessment: users answer structured questions, see **Results** with quadrant breakdowns and narrative feedback, and can download a report. Server routes under `/api/ghl/*` integrate with GoHighLevel when environment variables are configured.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, [MUI](https://mui.com/), [Emotion](https://emotion.sh/) |
| Forms | [react-hook-form](https://react-hook-form.com/) |
| Charts | [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) |
| PDF | [jsPDF](https://github.com/parallax/jsPDF), [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable), [html2canvas](https://html2canvas.hertzen.com/) |
| HTTP | [axios](https://axios-http.com/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |

Dev server runs on **port 3002** (`npm run dev`).

## Project structure

```
swotify/
├── next.config.js          # Next.js config (strict mode, tracing root)
├── package.json
├── src/
│   ├── app/                # App Router
│   │   ├── layout.jsx      # Root layout, global CSS, toast host
│   │   ├── page.jsx        # Home → NewSwotPage
│   │   ├── ClientBodyClass.jsx
│   │   └── api/ghl/        # GoHighLevel proxy routes (Node runtime)
│   │       ├── upsert-contact/route.js
│   │       ├── contact-file-upload/route.js
│   │       └── trigger-workflow/route.js
│   ├── Components/         # Page shells and chrome
│   │   ├── NewSwotPage.jsx # Main questionnaire shell
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Table.js
│   │   └── DiscPage.jsx    # DISC-related UI (legacy / alternate flows)
│   ├── ui/                 # Questionnaire, results, PDF handlers, styles
│   │   ├── Questionnaire.jsx
│   │   ├── Question.jsx
│   │   ├── Results.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── handleDownloadPdf.jsx
│   │   ├── handleDownloadPdfBW.jsx
│   │   ├── data.js
│   │   └── *.css
│   ├── lib/                # Pure helpers
│   │   ├── swotQuadrant.js
│   │   └── generateSwotNarrativeFeedbacks.js
│   ├── views/              # PDF / view helpers (e.g. newpdf, DiscPage.js)
│   ├── fonts/              # Licensed font files
│   ├── App.css
│   ├── Swot.css
│   └── index.css
```

## Getting started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (or compatible package manager)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

### Production build

```bash
npm run build
npm start
```

`start` also serves on port **3002**.

## Environment variables (GoHighLevel)

Create `.env.local` in the project root (Next.js loads it automatically). These power the `/api/ghl/*` routes only; the questionnaire UI can run without them if you do not call those APIs.

| Variable | Purpose |
|----------|---------|
| `GHL_PRIVATE_INTEGRATION_TOKEN` | Private integration token for Lead Connector API |
| `GHL_LOCATION_ID` | Sub-account / location ID |
| `GHL_API_BASE_URL` | Optional. Defaults to `https://services.leadconnectorhq.com` |
| `GHL_SWOTIFY_RESULTS_FIELD_ID` | Custom field ID for storing SWOT / results text on upsert |
| `GHL_FILE_UPLOAD_CUSTOM_FIELD_ID` | Custom field used when uploading a file for a contact |
| `GHL_WORKFLOW_WEBHOOK_URL` | Webhook URL to trigger a GHL workflow (POST JSON body) |

Never commit real tokens. `.env*.local` is ignored by git in this repo.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server on port 3002 (webpack) |
| `npm run build` | Production build |
| `npm start` | Production server on port 3002 |

## License and assets

Font files under `src/fonts/` include their own license files (e.g. OFL / SIL). Respect those terms when redistributing.

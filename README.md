# Ph0enixOS

Tech Stack:

- React (Vite)
- Tailwind CSS v3
- Google Sheets as backend
- Nix Flake development environments

## **⚡ Quick Start (Dev)**

Follow these steps to get a developer environment running locally.

1. Environment setup

```bash
nix develop
npm install
```

2. Create a `.env` file:

```dotenv
VITE_OWNER_NAME="Your Name"
VITE_GOOGLE_SCRIPT_URL="https://script.google.com/your-apps-script-url"
VITE_GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
```

3. Run locally

```bash
npm run dev
```

## **🚀 Deployment (Vercel)**

1. Push your repo to GitHub.
2. Import the repo into vercel.
3. Add env vars in vercel.
4. Deploy & build.

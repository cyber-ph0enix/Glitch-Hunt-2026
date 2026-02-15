# **Ph0enixOS // Glitch Hunt 2026**

An immersive, "fake OS" web application for hosting CTF/OSINT events. Features a functional terminal, simulated browser, and real-time "whistleblower" leak system via Google Sheets.  
**Tech Stack:** React (Vite), Tailwind CSS v3, Google Sheets (Backend), Nix/Flakes.

## **⚡ Quick Start (Dev)**

**1\. Environment Setup**  
Ensure you have [Nix](https://nixos.org/download.html) installed.  
nix develop \# Enters the reproducible Node.js environment  
npm install \# Installs dependencies

**2\. Configure Secrets**  
Create a .env file in the root directory:  
OWNER_NAME="Your Club Name"  
GOOGLE_SCRIPT_URL="\<Your_Apps_Script_Web_App_URL\>"  
GOOGLE_SHEET_CSV_URL="\<Your_Google_Sheet_Published_CSV_URL\>"

**3\. Run**  
npm run dev

## **🚀 Deployment (Vercel)**

1. Push code to GitHub (ensure .env is **not** included).
2. Import project to **Vercel**.
3. Add the **Environment Variables** (from .env) in Vercel Project Settings.
4. Deploy.


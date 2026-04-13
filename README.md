# KTPBA Teams Marathon 2026

Official web application for the **Kenya Ten Pin Bowling Association (KTPBA) Teams Marathon 2026**.

## 🎳 Tournament Overview
- **Venue**: Village Bowl, Village Market, Nairobi
- **Schedule**: Mondays & Tuesdays, 6:45 PM – 11:00 PM
- **Duration**: 13 Weeks (April 13, 2026 – July 8, 2026)
- **Format**: 20 Teams competing in Singles, Doubles, and Teams formats.

## ⚙️ Match Format & Scoring
- **Singles**: Best of 3 games. Team players can interchange between games (each must play a full 10 frames).
- **Doubles**: Best of 3 games, played in **Baker's Style**.
- **Teams**: Best of 5 games, played in **Baker's Style**.
- **Points**: Winning a format series earns the team **1 standings point**. Max 3 points per matchday.
- **Tie-Breaker**: Identical pinfall results in an immediate **roll-off game** to determine the game winner.

## 🚀 Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom KTPBA Brand Theme)
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)
- **Database**: Supabase (Integration ready)
- **AI**: Gemini 1.5 Flash (Match summary generation)

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-username]/KTPBA.git
   cd KTPBA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔐 Admin Access
The admin dashboard is located at `/admin/login`. Access requires the tournament-specific authorization code.

## 📜 License
© 2026 Kenya Ten Pin Bowling Association. All Rights Reserved.

# ✨ Mockup-AI: Turn Your Ideas into Stunning UI Designs

Mockup-AI is a powerful, AI-driven platform designed to transform your creative concepts into high-fidelity Website and Mobile App mockups in seconds. Whether you're a founder, designer, or developer, Mockup-AI helps you bridge the gap between imagination and reality using state-of-the-art Generative AI.

![Hero Section](public/preview.png)

## 🚀 Key Features

- **🤖 AI-Powered Generation**: Simply describe your project, and watch as our AI generates full-page designs with relevant components, themes, and layouts.
- **📱 Multi-Device Support**: Tailor your designs specifically for Web or Mobile platforms.
- **🎨 Intelligent Theming**: Choose from a variety of curated themes (Modern, Minimalist, Corporate, etc.) to match your brand identity.
- **✍️ Live Editor**: Refine and edit generated screens using an intuitive interface. Drag, drop, and resize elements to perfection.
- **📂 Project Management**: Keep all your designs organized. Save, retrieve, and iterate on multiple projects from your personal dashboard.
- **✨ Premium UI/UX**: Built with a focus on modern aesthetics—featuring glassmorphism, smooth animations, and a sleek dark mode.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & ORM**: [Neon DB](https://neon.tech/) (PostgreSQL) + [Drizzle ORM](https://orm.drizzle.team/)
- **AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Utilities**: `html2canvas` (Exporting), `react-rnd` (Resizing/Dragging), `recharts` (Data Viz)

## 🏗️ Architecture & Code Modularization

The codebase follows a highly modular, decoupled architecture following **SOLID** principles:

### 1. Routing Layer (`app/api/`)
Handles HTTP concerns exclusively. Route handlers in the `route.ts` files parse parameters, authenticate Clerk sessions, and return responses. They do **not** run database queries or directly invoke AI logic.

### 2. Controller Layer (`controllers/`)
Encapsulates all database operations, transaction handling, and third-party AI APIs. Divided according to business domains:
- **[user.controller.ts](file:///d:/uiux-mockup-ai/controllers/user.controller.ts)**: Handles user synchronizations.
- **[project.controller.ts](file:///d:/uiux-mockup-ai/controllers/project.controller.ts)**: Handles project creation, retrieval, updates, and deletion.
- **[ai.controller.ts](file:///d:/uiux-mockup-ai/controllers/ai.controller.ts)**: Manages Gemini system instruction setups, config outlines, UI generations, edits, and additional screen appending.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Neon PostgreSQL database instance
- A Clerk account for authentication
- API Key for Google Gemini

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/uiux-mockup-ai.git
   cd uiux-mockup-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   DATABASE_URL=your_neon_db_url

   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run database migrations**:
   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API route handlers.
- `controllers/`: Modular controllers containing core business, database, and AI logic.
- `components/`: Reusable UI components (shadcn/ui and custom).
- `_shared/`: Shared layout components (Header, Hero, Canvas, etc.).
- `config/`: Database connection and Gemini client setup.
- `context/`: Strongly typed React context providers.
- `data/`: Curated themes, prompts, and static constants.
- `types/`: Custom TypeScript type definitions.

---

Built with ❤️ by Agrim Gupta

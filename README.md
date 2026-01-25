# ✨ Mockup-AI: Turn Your Ideas into Stunning UI Designs

Mockup-AI is a powerful, AI-driven platform designed to transform your creative concepts into high-fidelity Website and Mobile App mockups in seconds. Whether you're a founder, designer, or developer, Mockup-AI helps you bridge the gap between imagination and reality using state-of-the-art Generative AI.

![Hero Section](public/preview.png)

## 🚀 Key Features

-   **🤖 AI-Powered Generation**: Simply describe your project, and watch as our AI generates full-page designs with relevant components, themes, and layouts.
-   **📱 Multi-Device Support**: Tailor your designs specifically for Web or Mobile platforms.
-   **🎨 Intelligent Theming**: Choose from a variety of curated themes (Modern, Minimalist, Corporate, etc.) to match your brand identity.
-   **✍️ Live Editor**: Refine and edit generated screens using an intuitive interface. Drag, drop, and resize elements to perfection.
-   **📂 Project Management**: Keep all your designs organized. Save, retrieve, and iterate on multiple projects from your personal dashboard.
-   **✨ Premium UI/UX**: Built with a focus on modern aesthetics—featuring glassmorphism, smooth animations, and a sleek dark mode.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Database**: [Neon DB](https://neon.tech/) (PostgreSQL)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **AI Engines**: [Google Gemini 2.0 Flash](https://ai.google.dev/) & [OpenRouter](https://openrouter.ai/)
-   **Utilities**: `html2canvas` (Exporting), `react-rnd` (Resizing/Dragging), `recharts` (Data Viz)

## ⚙️ Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   A Neon PostgreSQL database instance
-   A Clerk account for authentication
-   API Keys for Google Gemini or OpenRouter

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/uiux-mockup-ai.git
    cd uiux-mockup-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    DATABASE_URL=your_neon_db_url

    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```

4.  **Run database migrations**:
    ```bash
    npx drizzle-kit push
    ```

5.  **Start the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `app/`: Next.js App Router pages and API routes.
-   `components/`: Reusable UI components (shadcn/ui and custom).
-   `_shared/`: Shared components used across the app (Header, Hero, etc.).
-   `config/`: Database and AI configuration files.
-   `context/`: React context providers for global state.
-   `data/`: Static constants and theme definitions.
-   `drizzle/`: Database schema and migrations.
-   `hooks/`: Custom React hooks.
-   `types/`: TypeScript type definitions.

---

Built with ❤️ by Agrim Gupta

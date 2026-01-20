# AI Journey Blog

A modern, minimalist blog and learning tracker for documenting your journey into AI. Built with Next.js 14, Tailwind CSS, and Framer Motion.
https://ai-journey-blog-iota.vercel.app/

## Features

- **Blog System** - Write posts in Markdown, organize by tags, search functionality
- **Learning Tracker** - Catalog topics you've learned, track mastery
- **Flashcard Quiz** - Spaced repetition system (SM-2 algorithm) for self-testing
- **Dark Mode** - System-aware with manual toggle
- **Responsive Design** - Works great on mobile and desktop
- **Fast & SEO-friendly** - Static generation, optimized metadata

## Quick Start

### Prerequisites

- Node.js 18+ installed on your computer
- A code editor (VS Code recommended)
- A terminal/command prompt

### Installation

1. **Open your terminal** and navigate to the project folder:
   ```bash
   cd "C:\Users\epoll\Documents\Projects\Claude Blog\ai-journey-blog"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ai-journey-blog/
├── app/                    # Pages and routes (Next.js App Router)
│   ├── page.tsx           # Homepage
│   ├── blog/              # Blog pages
│   │   ├── page.tsx       # Blog listing
│   │   └── [slug]/        # Individual post pages
│   ├── learn/             # Learning tracker
│   └── about/             # About page
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Top navigation bar
│   ├── Footer.tsx         # Site footer
│   ├── ThemeProvider.tsx  # Dark mode management
│   ├── BlogList.tsx       # Blog post cards
│   ├── MDXContent.tsx     # Markdown renderer
│   ├── LearningTracker.tsx # Topics display
│   ├── FlashcardQuiz.tsx  # Quiz component
│   └── ...modals
├── content/               # Your content lives here!
│   └── blog/              # Markdown blog posts
├── lib/                   # Utility functions
│   ├── blog.ts            # Blog post utilities
│   └── learning.ts        # Learning/quiz utilities
└── public/                # Static files (images, etc.)
```

## Adding Blog Posts

### Creating a New Post

1. Create a new `.md` file in `content/blog/`:
   ```
   content/blog/my-new-post.md
   ```

2. Add frontmatter (metadata) at the top:
   ```markdown
   ---
   title: "Your Post Title"
   description: "A brief description for previews"
   date: "2024-01-20"
   tags: ["Machine Learning", "Python"]
   ---

   # Your content starts here

   Write your post in Markdown...
   ```

3. Save the file - it will appear on your blog automatically!

### Markdown Features Supported

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold/Italic**: `**bold**`, `*italic*`
- **Links**: `[text](url)`
- **Images**: `![alt](path)`
- **Code blocks**: Use triple backticks with language
- **Lists**: Bulleted (`-`) and numbered (`1.`)
- **Blockquotes**: `> quoted text`

### Obsidian Integration

Your markdown files are compatible with Obsidian! You can:

1. Point Obsidian to the `content/blog/` folder as a vault
2. Write posts in Obsidian
3. They'll automatically appear on your blog

Note: Obsidian-specific features like `[[wiki links]]` aren't supported yet, but standard markdown works perfectly.

## Using the Learning Tracker

### Adding Topics

1. Go to the **Learn** page
2. Click **Add Topic**
3. Fill in the title, description, and category
4. Set your current mastery level (0-100%)

### Creating Flashcards

1. On a topic, click **Add Card**
2. Write a question and answer
3. Cards are immediately available for quizzing

### Quiz System

The quiz uses **spaced repetition** (SM-2 algorithm):

- Cards you know well are shown less frequently
- Cards you struggle with appear more often
- Rate each card: Again, Hard, Good, or Easy
- The system schedules optimal review times

## Customization

### Updating Your Info

1. **Footer social links**: Edit `components/Footer.tsx`
2. **About page**: Edit `app/about/page.tsx`
3. **Site metadata**: Edit `app/layout.tsx`

### Changing Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: {
    500: "#3b82f6", // Main brand color
    // ... other shades
  },
  accent: {
    500: "#f97316", // Secondary accent
  },
}
```

### Adding New Pages

1. Create a folder in `app/` (e.g., `app/projects/`)
2. Add a `page.tsx` file inside it
3. The route is automatically created (`/projects`)

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest option - it's made by the Next.js team and has a generous free tier.

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-journey-blog.git
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

3. **Click "New Project"** and import your repository

4. **Click Deploy** - that's it!

Your site will be live at `your-project.vercel.app`. You can add a custom domain in the Vercel dashboard.

### Deploy to Netlify

1. Build the static site:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)

3. Drag and drop the `.next` folder (or connect your GitHub repo)

### Other Hosting Options

The project can be deployed anywhere that supports Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Troubleshooting

### "Module not found" errors
Run `npm install` to ensure all dependencies are installed.

### Posts not showing up
- Check that the file is in `content/blog/`
- Ensure the frontmatter is valid YAML (no tabs, proper quotes)
- File must end in `.md` or `.mdx`

### Dark mode not working
Clear your browser's localStorage and refresh.

### Learning data lost
Data is stored in localStorage. Clearing browser data will reset it. For persistence across devices, you'd need to add a database.

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[MDX](https://mdxjs.com/)** - Markdown with React components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons

## License

MIT - Feel free to use this for your own blog!

---

Built with curiosity and code. Happy learning!

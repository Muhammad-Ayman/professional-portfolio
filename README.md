# Professional Portfolio - Split Architecture

A modern, full-stack professional portfolio application split into two independently deployable projects for flexible hosting and scaling.

## 🎯 Quick Overview

This portfolio has been architected as **two separate applications**:

| Project | Description | Tech Stack | Deploy To |
|---------|-------------|------------|-----------|
| **[Frontend](./frontend)** | Public portfolio website | React + Vite + Tailwind | Netlify, Vercel, Cloudflare Pages |
| **[CMS Backend](./cms-backend)** | Admin CMS + REST API | Next.js + Express + Prisma | Railway, Render, Vercel |

## 🚀 Why Split Architecture?

✅ **Independent Scaling** - Scale frontend and backend separately  
✅ **Optimized Hosting** - Use CDN for frontend, server for backend  
✅ **Better Security** - Keep admin panel separate from public site  
✅ **Cost Efficient** - Choose best hosting for each component  
✅ **Flexible Updates** - Update without affecting the other part  

## 📦 What's Included

### Frontend Features
- 🎨 Modern, responsive design with Tailwind CSS
- 🌙 Dark mode support
- 📱 Mobile-first approach
- ⚡ Lightning-fast with Vite
- 🔍 SEO optimized
- 📊 Performance optimized
- ♿ Accessible UI components

### CMS Backend Features
- 🔐 Secure token-based authentication
- 📝 Full CRUD for all content types:
  - Profile information
  - Case studies
  - Blog insights
  - FAQs
- 🖼️ Image upload support
- 📧 Contact form with email integration
- 🗄️ SQLite database (easily switchable to PostgreSQL)
- 🔄 RESTful API

## 🎬 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd professional-portfolio

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../cms-backend
pnpm install
```

### 2. Setup Environment Variables

#### Frontend (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

#### Backend (`.env.local`)
```bash
DATABASE_URL="file:./dev.db"
CMS_ADMIN_TOKEN=your_secure_token_here
NEXT_PUBLIC_API_URL=http://localhost:4000/api
RESEND_API_KEY=your_resend_key  # Optional
```

Generate a secure token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Database

```bash
cd cms-backend
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed
```

### 4. Run Development Servers

#### Terminal 1 - Backend API:
```bash
cd cms-backend
node server.js
```
API runs on http://localhost:4000

#### Terminal 2 - CMS Frontend:
```bash
cd cms-backend
pnpm dev
```
CMS runs on http://localhost:3000

#### Terminal 3 - Public Frontend:
```bash
cd frontend
pnpm dev
```
Portfolio runs on http://localhost:3000 (different port will be chosen)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Detailed architecture and project organization |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Complete deployment instructions for various platforms |
| **[frontend/README.md](./frontend/README.md)** | Frontend-specific documentation |
| **[cms-backend/README.md](./cms-backend/README.md)** | Backend-specific documentation |

## 🚀 Deployment

### Quick Deploy (Recommended)

**Frontend → Netlify**
```bash
cd frontend
pnpm build
# Upload dist/ to Netlify
```

**Backend → Railway**
```bash
cd cms-backend
# Connect to Railway and deploy
# Set environment variables
# Run migrations
```

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed deployment instructions for:
- Netlify + Railway
- Vercel (both)
- Single VPS
- Other platforms

## 🗂️ Project Structure

```
professional-portfolio/
│
├── frontend/                    # React Portfolio (Public)
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── api/                # API client
│   │   └── ...
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── cms-backend/                 # Next.js CMS + Express API (Private)
│   ├── src/
│   │   ├── app/                # Next.js pages (CMS)
│   │   ├── components/         # React components
│   │   └── lib/                # Utilities
│   ├── server/                 # Express API
│   │   ├── routes/             # API endpoints
│   │   └── index.ts
│   ├── prisma/                 # Database schema & migrations
│   ├── scripts/                # Utility scripts
│   ├── package.json
│   ├── next.config.mjs
│   ├── server.js               # API server entry
│   └── README.md
│
├── PROJECT_STRUCTURE.md         # Architecture documentation
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
└── README.md                    # This file
```

## 🔒 Security

- ✅ Token-based authentication for CMS
- ✅ Environment variables for sensitive data
- ✅ CORS configured properly
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma
- ✅ Rate limiting ready (can be added)

**Important:**
- Never commit `.env` files
- Use strong `CMS_ADMIN_TOKEN` in production
- Keep CMS URL private
- Always use HTTPS in production

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **Radix UI** - Accessible components

### CMS Backend
- **Next.js 15** - CMS framework
- **React 19** - UI library
- **Express.js** - API server
- **Prisma** - Database ORM
- **SQLite** - Database (dev)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Resend** - Email service

## 📖 Usage

### Accessing the CMS
1. Go to your deployed CMS URL (e.g., `https://cms.yourdomain.com`)
2. Enter your `CMS_ADMIN_TOKEN`
3. Manage your content:
   - Update profile information
   - Add/edit/delete case studies
   - Write blog insights
   - Manage FAQs

### Updating Content
All changes made in the CMS are immediately reflected on the public portfolio website via the API.

## 🔄 Development Workflow

1. **Update content** → Use CMS
2. **Update design/features** → Edit frontend code → Deploy
3. **Update API/database** → Edit backend code → Deploy → Run migrations
4. **Add new content type** → Update Prisma schema → Migrate → Update API → Update CMS → Update frontend

## 🧪 Testing

```bash
# Frontend
cd frontend
pnpm check  # Type checking

# Backend
cd cms-backend
pnpm check          # Type checking
pnpm test:db        # Test database connection
```

## 📊 Database Management

```bash
cd cms-backend

# View/edit database with GUI
pnpm prisma studio

# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Apply migrations
pnpm prisma migrate deploy

# Backup database
pnpm backup
```

## 🌐 Environment Variables

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.yoursite.com/api` |

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection | `file:./prod.db` or PostgreSQL URL |
| `CMS_ADMIN_TOKEN` | Admin authentication | `32-character-hex-string` |
| `NEXT_PUBLIC_API_URL` | API URL for CMS | `https://api.yoursite.com/api` |
| `RESEND_API_KEY` | Email service key | `re_xxxxx` (optional) |
| `PORT` | API server port | `4000` |

## 📝 License

MIT

## 🤝 Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use!

## 📬 Support

- Check the detailed README files in each project directory
- Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help

---

**Built with ❤️ using modern web technologies**

**Ready to deploy?** → See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)


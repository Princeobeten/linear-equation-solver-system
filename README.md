# ➗ Linear Equation Solver System

A web-based system that allows users to input, solve, and view solutions to systems of linear equations using standard algorithms (Gaussian Elimination and Matrix Inversion). Built with Next.js 14 and MongoDB.

## 🚀 Features

- **User-friendly interface** for entering linear equations
- **Real-time solving** with choice of methods
- **Input validation** and error handling
- **Clear visualization** of solutions
- **User authentication** to save and view equation history
- **Responsive design** that works on mobile and desktop

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **Deployment**: Ready for Vercel deployment

## 📂 Project Structure

```
/etoma-linear-equation-solver-system
│── /app                         # App Router structure
│   ├── page.tsx                 # Home page with solver
│   ├── layout.tsx               # Root layout with SessionProvider
│   ├── login/                   # Authentication pages
│   │   └── page.tsx
│   ├── history/                 # Saved equations history
│   │   └── page.tsx
│   ├── api/                     # API endpoints
│   │   ├── solve/route.ts       # Equation solving endpoint
│   │   ├── history/route.ts     # Get equation history
│   │   └── auth/                # Authentication endpoints
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── EquationInput.tsx
│   │   └── SolutionDisplay.tsx
│   ├── models/                  # Database models
│   │   ├── User.ts
│   │   └── Equation.ts
│   ├── lib/                     # Utility functions
│   │   ├── dbConnect.ts         # MongoDB connection
│   │   └── equationSolver.ts    # Core solving algorithms
│   └── providers/               # React context providers
│       └── SessionProvider.tsx  # NextAuth session provider
├── .env.local                   # Environment variables
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
└── tailwind.config.ts          # Tailwind CSS config
```

🗄️ Database Models
User
{
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}

Equation
{
  userId: ObjectId (User),
  equations: [String], // e.g. ["2x+3y=6", "x-y=1"]
  method: String, // e.g. "Gaussian Elimination"
  solution: Object, // e.g. {x: 1, y: 2}
  createdAt: Date
}

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/etoma-linear-equation-solver-system.git
cd etoma-linear-equation-solver-system
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

#### Option 1: Using the Setup Script (Recommended)

Run the provided setup script which will guide you through the configuration process:

```bash
node scripts/setup-env.js
```

This script will ask for your MongoDB connection string and automatically generate a secure secret for NextAuth.

#### Option 2: Manual Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Connection (required)
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration (required for authentication)
NEXTAUTH_SECRET=your_random_secret_at_least_32_chars
NEXTAUTH_URL=http://localhost:3000
```

**Notes:**
- For MongoDB, you can use a local MongoDB instance or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Generate a secure random string for NEXTAUTH_SECRET (e.g., using `openssl rand -base64 32`)

### 4️⃣ Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

## 📝 User Flows

### Solving Equations (Unauthenticated User)

1. Visit the home page
2. Select the number of equations to solve (2-6)
3. Enter the linear equations in the form `ax + by + cz = d`
4. Choose a solving method (Gaussian Elimination or Matrix Inversion)
5. Click "Solve System" to see the results

### Authenticated User Features

1. Register for an account or log in
2. Solve equations as above
3. Save solutions to your account
4. View your equation history in the History page

## 💯 Features Implemented

- [x] Complete equation solving algorithms
- [x] User-friendly input interface
- [x] Real-time equation solving
- [x] User authentication system
- [x] Solution history storage
- [x] Responsive design

## 📷 Screenshots

Add screenshots of your application here after deployment!

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

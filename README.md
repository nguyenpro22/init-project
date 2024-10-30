# Next.js Project Template

A modern web application built with Next.js 15, Redux Toolkit, and TypeScript.

## 📑 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Getting Started](#-getting-started)
3. [Project Structure](#-project-structure)
4. [Development Guide](#-development-guide)
   - [Features Development](#features-development)
   - [API Integration](#api-integration)
   - [Components](#components)
   - [State Management](#state-management)
   - [Middleware](#middleware)
   - [HOC (Higher-Order Components)](#hoc)
   - [Context](#context)
5. [Best Practices](#-best-practices)
6. [Deployment](#-deployment)

## 🚀 Tech Stack

- **Core:**

  - Next.js 15
  - TypeScript
  - Redux Toolkit
  - RTK Query

- **Styling:**

  - Tailwind CSS
  - shadcn/ui
  - Framer Motion

- **Development Tools:**
  - ESLint
  - Jest
  - React Testing Library

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Start development server

```bash
npm run dev
# or
yarn dev
```

### Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_AUTH_SECRET=your_auth_secret
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── (auth)/         # Auth group routes
│   ├── (main)/         # Main group routes
│   └── layout.tsx      # Root layout
│
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── features/      # Feature-specific components
│   ├── layout/        # Layout components
│   ├── HOC/           # Higher-order components
│   └── Provider/      # Context providers
│
├── features/          # Feature modules
│   ├── auth/         # Authentication feature
│   │   ├── api.ts    # RTK Query endpoints
│   │   ├── slice.ts  # Redux slice
│   │   └── types.ts  # TypeScript types
│   └── [feature]/    # Other features
│
├── lib/              # Core utilities
│   ├── api/          # API configuration
│   └── utils/        # Utility functions
│
└── store/            # Redux store setup
    └── index.ts      # Store configuration
```

## 🛠 Development Guide

### Features Development

1. **Create Feature Structure**

```
src/features/[feature-name]/
├── api.ts          # RTK Query API definitions
├── types.ts        # TypeScript interfaces
├── slice.ts        # Redux slice
└── index.ts        # Public API
```

2. **Example Feature Implementation**

```typescript
// features/products/types.ts
interface Product {
  id: string;
  name: string;
  price: number;
}

// features/products/api.ts
import { baseApi } from "@/lib/api/baseQuery";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
    }),
  }),
});
```

### API Integration

1. **Base Query Setup**

```typescript
// lib/api/baseQuery.ts
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
```

2. **API Error Handling**

```typescript
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // Handle token refresh
  }
  return result;
};
```

### Components

1. **UI Components**

```typescript
// components/ui/Button/index.tsx
export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className="btn" {...props}>
      {children}
    </button>
  );
};
```

2. **Feature Components**

```typescript
// components/features/ProductList/index.tsx
export const ProductList = () => {
  const { data: products } = useGetProductsQuery();
  return (
    <div>
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### HOC (Higher-Order Components)

1. **Auth HOC**

```typescript
// components/HOC/withAuth.tsx
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Redirect to="/login" />;
    return <WrappedComponent {...props} />;
  };
};
```

### Context

1. **Creating Context**

```typescript
// contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType>({});

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 💡 Best Practices

### Code Organization

- One component per file
- Feature-based folder structure
- Clear naming conventions

### TypeScript

- Use strict mode
- Define interfaces for all props
- Use proper type imports/exports

### State Management

- Use Redux for global state
- Context for UI state
- Local state for component-specific data

### Testing

- Write unit tests for utilities
- Component testing with React Testing Library
- Integration tests for features

## 🚀 Deployment

1. **Build the application**

```bash
npm run build
```

2. **Deploy to Vercel**

```bash
vercel deploy
```

## 📝 License

This project is licensed under the MIT License.

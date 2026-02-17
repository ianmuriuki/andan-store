                                       # Andan Grocery E-Commerce System

A modern, full-stack grocery e-commerce platform built with the MERN stack, featuring M-Pesa integration and sophisticated UI/UX design.

##  Features

### Client Features
- **Modern UI/UX**: Sleek design with Inter/Playfair Display typography
- **User Authentication**: JWT + Google OAuth integration
- **Product Catalog**: Advanced search, filtering, and categorization
- **Shopping Cart**: Persistent cart with real-time updates
- **M-Pesa Integration**: Secure mobile money payments
- **Order Management**: Real-time order tracking and history
- **Responsive Design**: Mobile-first approach with WCAG compliance

### Admin Features
- **Dashboard Analytics**: Sales metrics and user insights
- **Product Management**: CRUD operations with inventory tracking
- **Order Processing**: Status updates and fulfillment management
- **User Management**: Customer support and account administration
- **Promotion Tools**: Discount codes and flash sales management

##  Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js, Google OAuth 2.0
- **Payments**: M-Pesa Daraja API
- **State Management**: React Query, Context API
- **Validation**: Zod, React Hook Form

##  Project Structure

```
andan-grocery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Server utilities
│   └── uploads/           # File uploads
└── shared/                # Shared types and utilities
```

##  Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- M-Pesa Developer Account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/andan-grocery.git
cd andan-grocery
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

4. **Start development servers**
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start server
cd server
npm run dev

# Terminal 3 - Start client
cd client
npm run dev
```

##  Design System

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body Text**: Inter (modern sans-serif)
- **Code**: JetBrains Mono

### Color Palette
- **Primary**: #27AE60 (Signature Green)
- **Background**: #FFFFFF (Pure White)
- **Neutrals**: #F6F9FC, #E5E7EB
- **Accents**: Blue, Orange, Red variants

### Spacing
- **Grid System**: 8pt base unit
- **Container**: 1140px max-width
- **Padding**: 24px standard

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/google       # Google OAuth
GET  /api/auth/me          # Get current user
POST /api/auth/refresh     # Refresh token
```

### Product Endpoints
```
GET    /api/products        # Get all products
GET    /api/products/:id    # Get single product
POST   /api/products        # Create product (admin)
PUT    /api/products/:id    # Update product (admin)
DELETE /api/products/:id    # Delete product (admin)
```

### Order Endpoints
```
GET  /api/orders           # Get user orders
POST /api/orders           # Create order
GET  /api/orders/:id       # Get single order
PUT  /api/orders/:id       # Update order status
```

##  M-Pesa Integration

The system integrates with Safaricom's M-Pesa Daraja API for secure mobile payments:

1. **STK Push**: Initiates payment request
2. **Callback Handling**: Processes payment confirmations
3. **Transaction Verification**: Validates payment status
4. **Receipt Generation**: Creates digital receipts

##  Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers

##  Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test

# Run e2e tests
npm run test:e2e
```

##  Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Build server
cd server
npm run build
```

### Environment Variables
See `.env.example` files for required environment variables.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email muriuki.dev@gmail.com or join our Slack channel.

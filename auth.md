# Andan Grocery E-Commerce Authentication Setup

## Overview
This document provides comprehensive setup instructions for authentication in the Andan Grocery E-Commerce system, including JWT authentication, Google OAuth integration, and security best practices.

## Authentication Flow

### 1. JWT Authentication
The system uses JSON Web Tokens (JWT) for stateless authentication with refresh token support.

#### Token Structure
```javascript
// Access Token (7 days)
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}

// Refresh Token (30 days)
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### Environment Variables Setup
Create `.env` file in the server directory:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-64-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-here-different-from-jwt-secret
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your-session-secret-here

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### 2. Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API

#### Step 2: Configure OAuth Consent Screen
1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in application information:
   - App name: "Andan Grocery"
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if in development

#### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - Name: "Andan Grocery Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/google/callback` (development)
     - `https://yourdomain.com/auth/google/callback` (production)

#### Step 4: Environment Configuration
Add to server `.env`:
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Add to client `.env`:
```bash
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Implementation Details

### Server-Side Authentication

#### 1. Password Hashing
```javascript
// In User model pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});
```

#### 2. JWT Token Generation
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};
```

#### 3. Authentication Middleware
```javascript
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
```

### Client-Side Authentication

#### 1. Axios Configuration
```javascript
// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 2. Auth Context Implementation
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      Cookies.set('token', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      setUser(user);
      toast.success(`Welcome back, ${user.firstName}!`);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  // ... other auth methods
};
```

## Security Best Practices

### 1. Password Requirements
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Hashed with bcrypt (12 rounds)
- No password in API responses

### 2. Token Security
- JWT secrets should be long and random (64+ characters)
- Different secrets for access and refresh tokens
- Secure cookie settings in production
- Token expiration times appropriate for use case

### 3. Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', limiter);
```

### 4. Input Validation
```javascript
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
```

### 5. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
POST /api/auth/refresh     # Refresh token
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/change-password  # Change password
POST /api/auth/forgot-password  # Forgot password
POST /api/auth/reset-password   # Reset password
```

### Google OAuth Endpoints
```
GET  /api/auth/google       # Initiate Google OAuth
GET  /api/auth/google/callback  # Google OAuth callback
```

## Frontend Integration

### 1. Protected Routes
```javascript
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  return children;
};
```

### 2. Admin Routes
```javascript
const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

### 3. Login Form with Validation
```javascript
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error handled by AuthContext
    }
  };

  // ... form JSX
};
```

## Testing Authentication

### 1. Test User Accounts
Create test accounts for different roles:

```javascript
// Admin user
{
  email: "admin@andangrocery.com",
  password: "Admin123!",
  role: "admin"
}

// Regular user
{
  email: "user@example.com",
  password: "User123!",
  role: "user"
}
```

### 2. Testing Checklist
- [ ] User registration with validation
- [ ] User login with correct credentials
- [ ] Login failure with incorrect credentials
- [ ] Token refresh functionality
- [ ] Protected route access
- [ ] Admin route restrictions
- [ ] Logout functionality
- [ ] Password change
- [ ] Google OAuth flow
- [ ] Rate limiting on auth endpoints

## Troubleshooting

### Common Issues

1. **JWT Token Invalid**
   - Check JWT_SECRET in environment
   - Verify token expiration
   - Ensure consistent secret across restarts

2. **Google OAuth Errors**
   - Verify client ID and secret
   - Check authorized domains
   - Ensure OAuth consent screen is configured

3. **CORS Issues**
   - Check CLIENT_URL in server environment
   - Verify credentials: true in CORS config
   - Ensure proper headers in requests

4. **Cookie Issues**
   - Check secure flag in production
   - Verify sameSite settings
   - Ensure domain matches

### Debug Mode
Enable debug logging:
```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Auth Debug:', { token, user: req.user });
}
```

This authentication setup provides a secure, scalable foundation for the Andan Grocery E-Commerce system with proper token management, OAuth integration, and security best practices.
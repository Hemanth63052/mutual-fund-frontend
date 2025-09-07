# Mutual Fund Frontend

A modern React application for managing and tracking mutual fund investments with a clean, responsive user interface.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Portfolio Management**: Track and manage your mutual fund investments
- **Real-time Data**: View current NAV and performance metrics
- **Interactive Dashboard**: Visual charts and analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and user management
- **Investment Tracking**: Monitor gains, losses, and portfolio performance

## 🛠 Tech Stack

- **Frontend Framework**: React.js
- **Build Tool**: Create React App
- **Styling**: CSS
- **HTTP Client**: Axios
- **Containerization**: Docker

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**
- **Docker** (optional, for containerized deployment)
- **Git**

## 🚀 Installation

### Method 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mutual-fund-frontend
   cd mutual-fund
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration settings.

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Method 2: Docker Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mutual-fund-frontend
   cd mutual-fund
   ```

2. **Build and run with Docker**
   ```bash
   docker build -t mutual-fund-frontend .
   docker run -p 3000:3000 mutual-fund-frontend
   ```

3. **Using Docker Compose (if available)**
   ```bash
   docker-compose up --build
   ```

## 📁 Project Structure

```
mutual-fund-frontend/
|__mutual-fund
    ├── public/                 # Static assets
    ├── src/                   # Source code
    │   ├── components/        # Reusable UI components
    │   ├── pages/            # Page components
    │   ├── hooks/            # Custom React hooks
    │   ├── services/         # API services
    │   ├── utils/            # Utility functions
    │   ├── styles/           # Global styles
    │   ├── assets/           # Images, fonts, etc.
    │   └── App.js            # Main application component
    ├── node_modules/         # Dependencies
    ├── .env                  # Environment variables
    ├── .gitignore           # Git ignore rules
    ├── Dockerfile           # Docker configuration
    ├── nginx.conf           # Nginx configuration
    ├── package.json         # Project dependencies and scripts
    ├── package-lock.json    # Lock file for dependencies
    └── README.md           # Project documentation
```

## 📜 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

## 🏗 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure
```jsx
// components/ComponentName/index.js
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## 🚢 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t mutual-fund-frontend:latest .
docker run -p 80:80 mutual-fund-frontend:latest
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Happy Investing! 📈**
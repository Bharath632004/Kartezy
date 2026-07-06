#!/bin/bash

# Script to generate a React app skeleton

APP_NAME=$1
APP_PATH="apps/$APP_NAME"

if [ -z "$APP_NAME" ]; then
    echo "Usage: $0 <app-name>"
    exit 1
fi

# Create directory structure
mkdir -p "$APP_PATH/public"
mkdir -p "$APP_PATH/src"

# Create package.json
cat > "$APP_PATH/package.json" <<EOF
{
  "name": "$APP_NAME",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create public/index.html
cat > "$APP_PATH/public/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>$APP_NAME</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

# Create src/index.js
cat > "$APP_PATH/src/index.js" <<EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create src/App.js
cat > "$APP_PATH/src/App.js" <<EOF
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to $APP_NAME
        </p>
      </header>
    </div>
  );
}

export default App;
EOF

# Create src/App.css
cat > "$APP_PATH/src/App.css" <<EOF
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
EOF

# Create src/index.css
cat > "$APP_PATH/src/index.css" <<EOF
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

echo "Generated React app: $APP_NAME"
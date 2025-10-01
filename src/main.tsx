// main.tsx — Application Bootstrap
// This is the entry point of the React application.
// - Creates a React root and mounts the app into the HTML <div id="root">.
// - Wraps the app in <StrictMode> to highlight potential issues in development.
// - Imports global CSS (Leaflet map styles, project-wide styles).
// - Wraps the app in <AppProvider> to enable global state management.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './store/AppStore.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)

/**
 * Resumate - AI-Powered Resume Builder
 * 
 * PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED
 * Copyright © 2025 Resumate. All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * License required for use. Contact: licensing@resumate.com
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { displayLicenseWarning } from './utils/license'

// Display license warning in console
displayLicenseWarning();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

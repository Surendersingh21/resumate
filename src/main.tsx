/**
 * Resumate - AI-Powered Resume Builder
 * 
 * PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED
 * Copyright © 2025 Resumate. All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Source-available software - Free for non-commercial use.
 * Commercial license required for business use. Contact: etherjoon@gmail.com
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

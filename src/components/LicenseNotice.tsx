/**
 * SOURCE-AVAILABLE SOFTWARE - NON-COMMERCIAL LICENSE NOTICE
 * 
 * Copyright © 2025 Resumate. All Rights Reserved.
 * 
 * Free for non-commercial use. Commercial license required for business use.
 * See LICENSE.md for details.
 */

import { Shield, Heart, Briefcase } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function LicenseNotice() {
  return (
    <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex gap-2">
            <Heart className="h-5 w-5 text-blue-600" />
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              📖 Free for Non-Commercial Use
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              This software is <strong>free for personal, educational, and non-commercial use</strong>. 
              Feel free to use, learn, and build! 
              <span className="inline-flex items-center gap-1 ml-1">
                Commercial use <Briefcase className="h-3 w-3 inline" /> requires a license.
              </span>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              © 2025 Resumate. 
              <a 
                href="mailto:etherjoon@gmail.com" 
                className="ml-2 underline hover:text-blue-900 dark:hover:text-blue-100"
              >
                Contact for Commercial License
              </a>
              {' • '}
              <a 
                href="https://github.com/DecoderX108/resumate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 dark:hover:text-blue-100"
              >
                View Source
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

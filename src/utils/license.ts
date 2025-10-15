/**
 * SOURCE-AVAILABLE SOFTWARE - NON-COMMERCIAL LICENSE NOTICE
 * 
 * Copyright © 2025 Resumate. All Rights Reserved.
 * 
 * Free for non-commercial use. Commercial license required for business use.
 */

export const LICENSE_INFO = {
  company: 'Resumate',
  copyright: `Copyright © ${new Date().getFullYear()} Resumate. All Rights Reserved.`,
  type: 'SOURCE-AVAILABLE - NON-COMMERCIAL',
  contact: {
    email: 'etherjoon@gmail.com',
    github: 'https://github.com/DecoderX108/resumate',
    repository: 'https://github.com/DecoderX108/resumate'
  },
  notice: 'Free for personal, educational, and non-commercial use. Commercial license required for business/revenue-generating use.',
  nonCommercialUse: '✅ Allowed: Personal projects, learning, education, research, portfolios',
  commercialUse: '💰 Requires License: Selling services, SaaS, client work, revenue generation',
};

export const displayLicenseWarning = () => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log(
      `%c📖 Source-Available Software - Free for Non-Commercial Use`,
      'color: #3b82f6; font-size: 16px; font-weight: bold; padding: 10px; border: 2px solid #3b82f6; border-radius: 5px;'
    );
    console.log(
      `%c${LICENSE_INFO.copyright}\n\n✅ FREE for non-commercial use:\n${LICENSE_INFO.nonCommercialUse}\n\n💰 Commercial license required:\n${LICENSE_INFO.commercialUse}\n\nContact: ${LICENSE_INFO.contact.email}\nGitHub: ${LICENSE_INFO.contact.github}`,
      'color: #666; font-size: 12px; line-height: 1.5;'
    );
    console.log(
      `%c❤️  Enjoying Resumate? Star us on GitHub and share with others!`,
      'color: #10b981; font-size: 12px; font-weight: bold;'
    );
  }
};

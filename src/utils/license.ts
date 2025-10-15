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
    licensing: 'licensing@resumate.com',
    support: 'support@resumate.com',
    website: 'https://resumate.com',
    licensingUrl: 'https://resumate.com/licensing',
    repository: 'https://github.com/resumate/resumate'
  },
  notice: 'Free for personal, educational, and non-commercial use. Commercial license required for business/revenue-generating use.',
  nonCommercialUse: '✅ Allowed: Personal projects, learning, education, research, portfolios',
  commercialUse: '💰 Requires License: Selling services, SaaS, client work, revenue generation',
  pricing: {
    freelancer: '$99/year',
    business: '$499/year',
    enterprise: 'Custom pricing'
  }
};

export const displayLicenseWarning = () => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log(
      `%c📖 Source-Available Software - Free for Non-Commercial Use`,
      'color: #3b82f6; font-size: 16px; font-weight: bold; padding: 10px; border: 2px solid #3b82f6; border-radius: 5px;'
    );
    console.log(
      `%c${LICENSE_INFO.copyright}\n\n✅ FREE for non-commercial use:\n${LICENSE_INFO.nonCommercialUse}\n\n💰 Commercial license required:\n${LICENSE_INFO.commercialUse}\n\nPricing:\n- Freelancer: ${LICENSE_INFO.pricing.freelancer}\n- Business: ${LICENSE_INFO.pricing.business}\n- Enterprise: ${LICENSE_INFO.pricing.enterprise}\n\nCommercial licensing: ${LICENSE_INFO.contact.licensingUrl}\nSource code: ${LICENSE_INFO.contact.repository}`,
      'color: #666; font-size: 12px; line-height: 1.5;'
    );
    console.log(
      `%c❤️  Enjoying Resumate? Star us on GitHub and share with others!`,
      'color: #10b981; font-size: 12px; font-weight: bold;'
    );
  }
};

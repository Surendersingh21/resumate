import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  FileText, 
  Mail, 
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen gradient-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-bounce">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Privacy Policy</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-6 animate-slide-in-left">
            Your Privacy Matters
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in-right">
            We are committed to protecting your personal information and being transparent 
            about how we collect, use, and secure your data.
          </p>
          
          <div className="mt-6 text-sm text-muted-foreground animate-fade-in">
            <strong>Last Updated:</strong> October 1, 2025
          </div>
        </div>

        {/* Quick Overview */}
        <Card className="gradient-card shadow-glow mb-8 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <CheckCircle className="h-6 w-6" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Lock className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-600 mb-1">Data Encryption</h4>
                  <p className="text-sm text-muted-foreground">All your data is encrypted in transit and at rest</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Eye className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-600 mb-1">No Data Selling</h4>
                  <p className="text-sm text-muted-foreground">We never sell your personal information to third parties</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-purple-600 mb-1">Limited Access</h4>
                  <p className="text-sm text-muted-foreground">Only authorized personnel can access your data</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-orange-600 mb-1">Your Control</h4>
                  <p className="text-sm text-muted-foreground">You can delete your data anytime</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card className="gradient-card hover:shadow-glow transition-all duration-300 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <FileText className="h-6 w-6" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>Name, email address, and contact information you provide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>Resume content including work experience, education, and skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>Account preferences and settings</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Usage Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>How you interact with our services and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>Device information and IP address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span>Browser type and operating system</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="gradient-card hover:shadow-glow transition-all duration-300 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <Globe className="h-6 w-6" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Service Delivery:</strong> To provide and improve our resume building services</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>AI Enhancement:</strong> To provide personalized suggestions and content optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Communication:</strong> To send you important updates and support messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Security:</strong> To protect our services and prevent fraudulent activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Analytics:</strong> To understand usage patterns and improve user experience</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="gradient-card hover:shadow-glow transition-all duration-300 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <Lock className="h-6 w-6" />
                3. Data Security & Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    Technical Safeguards
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• End-to-end encryption</li>
                    <li>• Secure data centers</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Organizational Measures
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Staff training on data protection</li>
                    <li>• Limited access on need-to-know basis</li>
                    <li>• Regular privacy assessments</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="gradient-card hover:shadow-glow transition-all duration-300 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <Eye className="h-6 w-6" />
                4. Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100  flex items-center justify-center">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Access & Portability</h4>
                      <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100  flex items-center justify-center">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Correction</h4>
                      <p className="text-sm text-muted-foreground">Update or correct your information</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100  flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Deletion</h4>
                      <p className="text-sm text-muted-foreground">Request deletion of your account and data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100  flex items-center justify-center">
                      <Lock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Restriction</h4>
                      <p className="text-sm text-muted-foreground">Limit how we process your data</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies & Tracking */}
          <Card className="gradient-card hover:shadow-glow transition-all duration-300 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <Globe className="h-6 w-6" />
                5. Cookies & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your experience, remember your preferences, 
                and analyze our traffic. You can control cookie settings through your browser.
              </p>
              
              <div className="bg-red-50  p-4 rounded-lg border border-red-200 ">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800  mb-1">Cookie Types</h4>
                    <p className="text-sm text-orange-700 ">
                      Essential cookies (required for functionality), Analytics cookies (usage statistics), 
                      and Preference cookies (your settings and choices).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="gradient-card shadow-glow animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient">
                <Mail className="h-6 w-6" />
                6. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or want to exercise your privacy rights, 
                please contact us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-foreground">etherjoon@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-foreground">https://github.com/DecoderX108/resumate</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 48 hours 
                  and will resolve requests within 30 days as required by applicable law.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

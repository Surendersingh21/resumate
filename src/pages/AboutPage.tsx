import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  Target, 
  Sparkles, 
  Heart, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center animate-fade-in-up">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-bounce">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">About Resumate</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-6 animate-slide-in-left">
            Building Careers,
            <br />
            One Resume at a Time
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in-right">
            We believe everyone deserves a professional resume that showcases their unique talents. 
            That's why we created Resumate - to make professional resume creation accessible to all.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/builder">
              <Button className="gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300">
                Start Building Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-6 animate-slide-in-up">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              To democratize professional resume creation by providing AI-powered tools 
              that help job seekers present their best selves to potential employers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="gradient-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in-left">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making professional resume creation accessible to everyone, 
                  regardless of their design skills or experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in delay-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Innovation</h3>
                <p className="text-muted-foreground">
                  Leveraging AI and modern technology to provide intelligent 
                  suggestions and optimize resume content.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in-right delay-400">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Empowerment</h3>
                <p className="text-muted-foreground">
                  Empowering job seekers with the tools and confidence 
                  they need to land their dream jobs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-6 animate-slide-in-up">
              Why Choose Resumate?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              We've built the most comprehensive and user-friendly resume builder 
              to help you stand out in today's competitive job market.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gradient">AI-Powered Content</h3>
                  <p className="text-muted-foreground">
                    Get intelligent suggestions for job descriptions, skills, and achievements 
                    tailored to your industry and experience level.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gradient">Professional Templates</h3>
                  <p className="text-muted-foreground">
                    Choose from our collection of ATS-friendly templates designed 
                    by professional resume writers and HR experts.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gradient">Real-time Optimization</h3>
                  <p className="text-muted-foreground">
                    Get instant feedback and suggestions to improve your resume's 
                    impact and ensure it passes ATS systems.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gradient">Export Flexibility</h3>
                  <p className="text-muted-foreground">
                    Download your resume in multiple formats including PDF, Word, 
                    and get optimized versions for different job applications.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <Card className="gradient-card shadow-glow">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gradient mb-4">Trusted by Thousands</h3>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of professionals who have successfully landed 
                      their dream jobs using Resumate.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gradient">10K+</div>
                        <div className="text-sm text-muted-foreground">Resumes Created</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gradient">95%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gradient">24/7</div>
                        <div className="text-sm text-muted-foreground">Support</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-6 animate-slide-in-up">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              We're a passionate team of developers, designers, and career experts 
              dedicated to helping you succeed in your job search.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl gradient-card shadow-glow animate-bounce">
              <Users className="h-6 w-6 text-primary" />
              <span className="font-semibold text-gradient">
                Built with ❤️ by career enthusiasts for job seekers worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-6 animate-slide-in-up">
            Ready to Build Your Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
            Join thousands of professionals who have transformed their careers with Resumate. 
            Start building your professional resume today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/builder">
              <Button className="gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                <FileText className="mr-2 h-5 w-5" />
                Create Your Resume Now
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="hover:gradient-card hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

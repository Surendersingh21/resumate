import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border animate-fade-in-up">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 animate-slide-in-left">
            <Link to="/" className="flex items-center space-x-2 mb-4 group hover:scale-105 transition-transform duration-300">
              <FileText className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold text-foreground">Resumate</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Create professional resumes with AI-powered suggestions and beautiful templates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-12">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-12">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-12">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="animate-scale-in delay-200">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Export Options
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-scale-in delay-400">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@resumate.com" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:feedback@resumate.com" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="animate-slide-in-right delay-500">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 animate-fade-in-up delay-700">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">📖 Source-Available Software</strong> - Copyright © {new Date().getFullYear()} Resumate. All Rights Reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Free for personal & educational use. Commercial use requires a license. 
              <a 
                href="mailto:etherjoon@gmail.com" 
                className="ml-2 text-primary hover:underline"
              >
                Contact for Commercial License
              </a>
              {' • '}
              <a 
                href="https://github.com/DecoderX108/resumate" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Source
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

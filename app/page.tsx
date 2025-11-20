'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Zap, Shield, Clock, Brain, ArrowRight, FileText, CheckCircle2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze contract');
      }

      const analysis = await response.json();
      
      // Store the analysis in sessionStorage to pass to the analysis page
      sessionStorage.setItem('contractAnalysis', JSON.stringify(analysis));
      
      // Navigate to analysis page
      router.push('/analysis');
    } catch (err) {
      console.error('Error analyzing contract:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById('falling-pages-container');
    if (!container) {
      return;
    }

    const createFallingPage = () => {
      const page = document.createElement('div');
      const left = Math.random() * 90 + 5;
      const delay = Math.random() * 3;
      const duration = 8 + Math.random() * 4;
      const rotation = Math.random() * 60 - 30;

      page.className = 'absolute pointer-events-none';
      page.style.left = `${left}%`;
      page.style.top = '0';
      page.style.animation = `fall ${duration}s linear ${delay}s forwards`;
      page.style.willChange = 'transform';

      page.innerHTML = `
        <svg width="100" height="130" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg);">
          <rect x="8" y="8" width="64" height="84" rx="4" fill="#daa520" stroke="#b8860b" strokeWidth="2"/>
          <line x1="16" y1="24" x2="64" y2="24" stroke="#b8860b" strokeWidth="1.5"/>
          <line x1="16" y1="36" x2="64" y2="36" stroke="#b8860b" strokeWidth="1.5"/>
          <line x1="16" y1="48" x2="56" y2="48" stroke="#b8860b" strokeWidth="1.5"/>
          <line x1="16" y1="60" x2="64" y2="60" stroke="#b8860b" strokeWidth="1.5"/>
          <line x1="16" y1="72" x2="48" y2="72" stroke="#b8860b" strokeWidth="1.5"/>
        </svg>
      `;

      container.appendChild(page);

      setTimeout(() => {
        page.remove();
      }, (duration + delay) * 1000);
    };

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFallingPage(), i * 300);
    }

    const interval = setInterval(() => {
      createFallingPage();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Contractual</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition">Why It Works</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How It Works</a>
          </nav>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div id="falling-pages-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
        </div>

        <div className="w-full max-w-3xl relative z-10">
          <div className="text-center mb-12 fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
              Stop reading <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">endless contracts</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Upload any contract, agreement, or terms of service and get instant summaries of what actually matters to you. No fluff, just facts.
            </p>
          </div>

          <div className="w-full">
            {!uploadedFile ? (
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full p-12 sm:p-16 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border bg-card hover:border-primary hover:bg-primary/2'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {isDragging ? 'Drop it here!' : 'Drop your contract here'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    or <span className="text-primary font-semibold">click to browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, DOCX, and TXT files
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full p-8 bg-card border border-primary/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isAnalyzing ? 'Analyzing...' : 'Ready to analyze'}
                      </p>
                    </div>
                  </div>
                  {!isAnalyzing && (
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setError(null);
                      }}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full mt-4 rounded-lg" 
                  size="lg"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>Analyzing Contract...</>
                  ) : (
                    <>Analyze Contract <Zap className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have a contract? Try one of our examples:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/examples/saas-service-agreement.txt"
                download="SaaS-Service-Agreement.txt"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                SaaS Agreement
              </a>
              <a
                href="/examples/employment-contract.txt"
                download="Employment-Contract.txt"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Employment Contract
              </a>
              <a
                href="/examples/residential-lease-agreement.txt"
                download="Residential-Lease-Agreement.txt"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Lease Agreement
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span>AI-powered analysis</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              What Contractual Does
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get intelligent summaries that highlight the critical points you need to know
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Key Obligations</h3>
              <p className="text-muted-foreground">
                Instantly identifies what you're agreeing to do, pay, or provide. No hidden clauses slip through.
              </p>
            </Card>

            <Card className="p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Risk Flags</h3>
              <p className="text-muted-foreground">
                Highlights potential risks, liability clauses, and terms that might work against you.
              </p>
            </Card>

            <Card className="p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Deadlines & Dates</h3>
              <p className="text-muted-foreground">
                Extracts all important dates, renewal periods, and deadlines so you never miss a critical moment.
              </p>
            </Card>

            <Card className="p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Plain English Summary</h3>
              <p className="text-muted-foreground">
                Every contract section explained in simple, understandable language anyone can grasp instantly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">
                Save hours reading contracts
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Understand in minutes</h3>
                    <p className="text-muted-foreground">Get the full picture without reading pages of legal jargon</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Spot risks early</h3>
                    <p className="text-muted-foreground">Never miss dangerous clauses or unfavorable terms again</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Make confident decisions</h3>
                    <p className="text-muted-foreground">Know exactly what you're signing before you sign it</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <div className="space-y-6">
                  <div className="text-sm font-semibold text-primary uppercase">Average Time Saved</div>
                  <div className="text-5xl font-bold text-foreground">2.5 hours</div>
                  <p className="text-muted-foreground">Per contract analyzed</p>
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Used by professionals in:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Real Estate</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Business</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Freelance</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Legal</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Three steps to clarity
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From upload to insight in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Upload',
                description: 'Drop your contract in any format. PDF, Word, text—we handle it all.',
                icon: Upload,
              },
              {
                number: '2',
                title: 'Analyze',
                description: 'Our AI breaks down every section and extracts what matters most to you.',
                icon: Brain,
              },
              {
                number: '3',
                title: 'Understand',
                description: 'Get a clear, actionable summary with highlighted risks and key points.',
                icon: CheckCircle2,
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary text-primary-foreground rounded-full items-center justify-center mb-6 font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-8 -right-8 items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to decode your contracts?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start analyzing contracts in seconds.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-foreground">Contractual</span>
              </div>
              <p className="text-sm text-muted-foreground">Making contracts understandable for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Contractual. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

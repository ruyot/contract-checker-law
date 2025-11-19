'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, DollarSign, FileText, Download, Share2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ContractAnalysis {
  fileName: string;
  analysisTime: string;
  summary: string;
  keyPoints: {
    category: string;
    items: string[];
    severity: 'neutral' | 'warning' | 'success';
  }[];
}

export default function AnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve analysis from sessionStorage
    const storedAnalysis = sessionStorage.getItem('contractAnalysis');
    
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error('Error parsing stored analysis:', error);
        router.push('/');
      }
    } else {
      // No analysis found, redirect to home
      router.push('/');
    }
    
    setIsLoading(false);
  }, [router]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-l-4 border-l-primary bg-primary/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('financial') || lowerCategory.includes('payment') || lowerCategory.includes('cost')) {
      return DollarSign;
    } else if (lowerCategory.includes('risk') || lowerCategory.includes('penalty') || lowerCategory.includes('liabilit')) {
      return AlertCircle;
    } else if (lowerCategory.includes('date') || lowerCategory.includes('deadline') || lowerCategory.includes('time')) {
      return Clock;
    } else if (lowerCategory.includes('obligation') || lowerCategory.includes('responsibilit')) {
      return CheckCircle;
    }
    return FileText;
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No analysis found</p>
          <Button onClick={() => router.push('/')}>Go Back</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Contract Analysis</h1>
              <p className="text-sm text-muted-foreground">{analysis.fileName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Analysis Summary Card */}
        <Card className="p-8 mb-12 border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Executive Summary</h2>
              <p className="text-muted-foreground">Analyzed in {analysis.analysisTime}</p>
            </div>
            <FileText className="w-12 h-12 text-primary opacity-30" />
          </div>
          <p className="text-lg text-foreground leading-relaxed">{analysis.summary}</p>
        </Card>

        {/* Key Points Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground mb-6">Key Insights</h3>
          
          {analysis.keyPoints.map((section, idx) => {
            const IconComponent = getCategoryIcon(section.category);
            return (
              <Card 
                key={idx}
                className={`p-6 overflow-hidden transition-all hover:shadow-md ${getSeverityColor(section.severity)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">{section.category}</h4>
                </div>
                
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Action Section */}
        <div className="mt-12 p-8 bg-secondary/30 rounded-xl border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Next Steps</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="w-full" size="lg">
              Accept & Sign
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Request Changes
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

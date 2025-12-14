import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import { HeroPreview } from './HeroPreview';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(187_94%_43%_/_0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(270_70%_60%_/_0.1)_0%,transparent_50%)]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, hsl(222 47% 18%) 1px, transparent 1px), linear-gradient(to bottom, hsl(222 47% 18%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Design Your Dream Space in 3D
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6"
          >
            Create Stunning
            <br />
            <span className="gradient-text glow-text">3D Room Designs</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Transform your interior design ideas into reality with our powerful 
            drag-and-drop 3D room designer. No experience needed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group">
                Start Designing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { value: '50K+', label: 'Designers' },
              { value: '200+', label: '3D Models' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold font-heading gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-2xl overflow-hidden glass border border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10" />
            <div className="aspect-[16/9] bg-card">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary opacity-20 animate-pulse" />
                </div>
              }>
                <HeroPreview />
              </Suspense>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 rounded-xl glass animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 -right-8 w-12 h-12 rounded-lg bg-primary/20 animate-float" style={{ animationDelay: '4s' }} />
        </motion.div>
      </div>
    </section>
  );
}

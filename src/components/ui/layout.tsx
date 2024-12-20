import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PageWrapperProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
}

export const PageWrapper = ({ children, className, ...props }: PageWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={cn('min-h-screen bg-background', className)}
    {...props}
  >
    {children}
  </motion.div>
);

interface SectionProps extends Omit<HTMLMotionProps<"section">, "ref"> {
  children: React.ReactNode;
}

export const Section = ({ children, className, ...props }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={cn('py-8 md:py-12', className)}
    {...props}
  >
    {children}
  </motion.section>
);

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = ({ children, className, ...props }: ContainerProps) => (
  <div
    className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}
    {...props}
  >
    {children}
  </div>
);

interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: number;
}

export const CardGrid = ({ 
  children, 
  columns = 3, 
  className, 
  ...props 
}: CardGridProps) => (
  <div
    className={cn(
      'grid gap-4',
      {
        'md:grid-cols-2': columns === 2,
        'md:grid-cols-3': columns === 3,
        'md:grid-cols-4': columns === 4,
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
}

export const GlassCard = ({ children, className, ...props }: GlassCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={cn(
      'glass rounded-xl p-6 hover-card',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Header = ({ children, className, ...props }: HeaderProps) => (
  <header
    className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}
    {...props}
  >
    {children}
  </header>
);

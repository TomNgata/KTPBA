
import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  icon: Icon = Trophy, 
  title, 
  description, 
  actionLabel, 
  actionLink 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-24 px-8 text-center bg-white border border-dashed border-gray-200 shadow-sm"
    >
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      
      <h3 className="font-display text-3xl font-bold uppercase tracking-tighter mb-4 text-ktpba-black">
        {title}
      </h3>
      
      <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg font-light leading-relaxed">
        {description}
      </p>
      
      {actionLabel && actionLink && (
        <Link 
          to={actionLink} 
          className="inline-flex items-center px-10 py-4 bg-ktpba-black text-white font-display font-bold uppercase tracking-widest hover:bg-ktpba-red transition-all duration-300"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}

import { motion } from 'motion/react';
import Logo from './Logo';

export default function MaintenanceMode() {
  return (
    <div className="min-h-screen bg-ktpba-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ktpba-red rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center z-10"
      >
        <div className="flex justify-center mb-12">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Logo size={120} />
          </motion.div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-tight">
          WE'LL BE <span className="text-ktpba-red">BACK</span> SOON
        </h1>
        
        <div className="h-1 w-24 bg-ktpba-red mx-auto mb-8" />
        
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg mx-auto">
          The KTPBA Teams Marathon portal is currently undergoing scheduled maintenance and updates. We're polishing the experience to bring you the latest results and standings.
        </p>

        <div className="grid grid-cols-3 gap-1 w-full max-w-xs mx-auto mb-12 opacity-50">
          <div className="h-2 bg-ktpba-black border border-white/20" />
          <div className="h-2 bg-ktpba-red" />
          <div className="h-2 bg-white" />
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-gray-500 font-bold">
          Kenyan Ten Pin Bowling Association
        </p>
      </motion.div>

      {/* Decorative stripe at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-2 flex">
        <div className="flex-1 bg-ktpba-black" />
        <div className="flex-1 bg-ktpba-red" />
        <div className="flex-1 bg-white" />
      </div>
    </div>
  );
}

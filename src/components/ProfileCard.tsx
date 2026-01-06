import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import DiscordStatus from './DiscordStatus';
import MusicPlayer from './MusicPlayer';
import ProjectsTab from './ProjectsTab';
import ContactTab from './ContactTab';
import TerminalDialog from './TerminalDialog';
import albumCover from '@/assets/album-cover.jpg';

const tracks = [
  {
    title: 'Highway Patrol',
    artist: 'Yung Lean, Bladee',
    albumArt: albumCover,
    duration: '3:33',
  },
  {
    title: 'Obedient',
    artist: 'Bladee',
    albumArt: albumCover,
    duration: '2:58',
  },
];

// Discord User ID for Lanyard API
const DISCORD_USER_ID = '1173788423308451841';

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'contact'>('home');
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md glass-card rounded-xl overflow-visible relative z-10"
      >
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onHelpClick={() => setTerminalOpen(true)}
        />

        <div className="p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-5xl mb-0 font-medium leading-none tracking-tight font-retro">
                    alisaa
                  </h1>
                  <p className="text-muted-foreground text-xs leading-none mt-1">
                    full stack developer specializing in modern web technologies
                  </p>
                </div>

                {/* Discord Status */}
                <DiscordStatus userId={DISCORD_USER_ID} />

                {/* Music Player */}
                <MusicPlayer tracks={tracks} />
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectsTab />
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ContactTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <TerminalDialog open={terminalOpen} onOpenChange={setTerminalOpen} />
    </>
  );
};

export default ProfileCard;

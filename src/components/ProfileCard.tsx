import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import DiscordStatus from './DiscordStatus';
import MusicPlayer from './MusicPlayer';
import ProjectsTab from './ProjectsTab';
import ContactTab from './ContactTab';
import HelpDialog from './HelpDialog';
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

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'contact'>('home');
  const [helpOpen, setHelpOpen] = useState(false);

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
          onHelpClick={() => setHelpOpen(true)}
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
                  <h1 className="text-5xl mb-0 font-medium leading-none tracking-tight">
                    cosmin
                  </h1>
                  <p className="text-muted-foreground text-xs leading-none mt-1">
                    full stack developer specializing in modern web technologies
                  </p>
                </div>

                {/* Discord Status */}
                <DiscordStatus
                  username="wirebandit"
                  avatarUrl="https://cdn.discordapp.com/avatars/1173788423308451841/e277e8ed11b94d34594e5e6d9b0e06e4.png"
                  discordId="1173788423308451841"
                  status="offline"
                />

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

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
};

export default ProfileCard;

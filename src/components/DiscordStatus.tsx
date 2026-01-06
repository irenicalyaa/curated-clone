interface DiscordStatusProps {
  username: string;
  avatarUrl: string;
  discordId: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
}

const DiscordStatus = ({ username, avatarUrl, discordId, status }: DiscordStatusProps) => {
  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
  };

  return (
    <div className="info-panel">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Discord Avatar"
            className="w-7 h-7 rounded-full"
          />
          <div
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background status-${status}`}
          />
        </div>
        <div className="flex flex-col flex-1">
          <a
            href={`https://discord.com/users/${discordId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground/90 link-underline"
          >
            {username}
          </a>
          <span className="text-xs text-muted-foreground">{statusLabels[status]}</span>
        </div>
      </div>
    </div>
  );
};

export default DiscordStatus;

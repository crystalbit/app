import React from 'react';

const SocialIconsBar = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: '0px'
      }}
    >
      <a
        href="https://twitter.com/colonylab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icons/x.svg" alt="X (Twitter)" />
      </a>
      <a
        href="https://docs.colonylab.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icons/docs.svg" alt="Documentation" />
      </a>
      <a
        href="https://github.com/colonylab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icons/github.svg" alt="GitHub" />
      </a>
      <a
        href="https://discord.gg/colonylab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icons/discord.svg" alt="Discord" />
      </a>
      <a
        href="https://t.me/colonylab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/icons/telegram.svg"
          alt="Telegram"
          style={{ width: '18px', height: '18px' }}
        />
      </a>
    </div>
  );
};

export default SocialIconsBar;

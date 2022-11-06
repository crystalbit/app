import { Types } from 'phaser';

import { LoadingScene } from '../scenes/loading';
import { MainMapScene } from '../scenes/mainMap';

const gameConfig: Types.Core.GameConfig = {
  title: 'Mars Colony',
  type: Phaser.WEBGL,
  parent: 'game-root',
  backgroundColor: '#351f1b',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: Boolean(process.env.REACT_APP_GAME_DEBUG_MODE)
    }
  },
  fps: { target: 40, min: 30 },
  render: {
    antialiasGL: false,
    pixelArt: false
  },
  callbacks: {
    // will triggers on every app start
    postBoot: () => {
      window.sizeChanged();
    }
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: false,
  audio: {
    disableWebAudio: false
  },
  scene: [LoadingScene, MainMapScene]
};

export default gameConfig;

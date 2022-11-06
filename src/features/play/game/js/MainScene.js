import MiningQuestApi from '@api/miningQuestApi';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  INITIAL_GAME_TIME,
  MAP_SIZE,
  MAX_HEIGHT,
  MAX_WIDTH,
  TILE_SIZE,
  TILES_WIDTH,
  Y_POS_DIFF
} from '@features/play/constants';
import { store } from '@redux/store';
import { setActualTransportState } from '@slices/questSlice';
import Phaser from 'phaser';

import GUI from './GUI.js';
import MissionMap from './MissionMap.js';
import Rover from './Rover.js';

let portrait = false;
let rover, map, gui;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Main' });
    this.claim_started = false;
  }

  create() {
    this.tileSize = TILE_SIZE;

    this.zIn = 1;
    this.zOut = 0.3;
    this.cam2 = this.cameras.add().setName('Camera 2');

    this.resize();
    this.start();

    window.restartMiningGame = () => {
      this.resize();
      this.updateObjects();
    };

    window.addEventListener('resize', window.restartMiningGame);
  }

  start(dataFallback) {
    try {
      this.time_left = INITIAL_GAME_TIME;
      const miningMissionState =
        store.getState().quests.miningGameInfo ?? dataFallback;

      this.map = map = new MissionMap(this);

      const {
        position: { x: xPos, y: yPos },
        tiles
      } = miningMissionState;

      const position = xPos < Math.floor(TILES_WIDTH / 2) ? 'right' : 'left';

      map.addExits({ x: xPos, y: yPos + Y_POS_DIFF });

      this.rover = rover = new Rover(this, xPos, yPos + Y_POS_DIFF, position);

      map.drawAllNewTiles(tiles);

      map.addFogs();

      this.gui = gui = new GUI(this);

      rover.checkActions();
      gui.showWindow('start');
    } catch (err) {}
  }

  async restart() {
    if (this.claim_started) return;
    const reward = store.getState().quests.miningReward;
    if (reward) {
      this.claim_started = true;
      const { message, signature } = reward;
      await MiningQuestApi.claimReward({
        message,
        signature,
        callback: () => {
          store.dispatch(setActualTransportState(parseInt(0)));
          this.claim_started = false;
        }
      });
    } else {
      store.dispatch(setActualTransportState(parseInt(0)));
      await window.navigateHook('/play/0?withToggle=true');
    }
  }

  isWindowShow() {
    return gui.isWindowShow();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;

    let scale = Math.min(w / width, h / height);
    let newWidth = Math.min(w / scale, maxWidth);
    let newHeight = Math.min(h / scale, maxHeight);

    this.game.scale.resize(newWidth, newHeight);

    this.game.canvas.style.width = newWidth * scale + 'px';
    this.game.canvas.style.height = newHeight * scale + 'px';

    this.game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    this.game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;

    this.game.sizeW = newWidth;
    this.game.sizeH = newHeight;

    portrait = this.game.sizeH > this.game.sizeW;

    this.cameras.resize(this.game.sizeW, this.game.sizeH);

    this.scale.setParentSize(this.game.sizeW, this.game.sizeH);

    this.cameras.main.setBounds(0, 0, MAP_SIZE.width, MAP_SIZE.height);
    this.center = new Phaser.Geom.Point(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    let zCalc = this.game.sizeW / MAP_SIZE.width;
    let zCalc2 = this.game.sizeH / MAP_SIZE.height;
    this.zOut = zCalc < zCalc2 ? zCalc : zCalc2;
    portrait ? (this.zIn = 1.3) : (this.zIn = 1);

    this.updateObjects();
  }

  isZoomNow() {
    if (gui != null) return gui.zoomNow;
    else return null;
  }

  updateObjects() {
    if (gui != null && this.game.scene) gui.updatePos();
  }
}

import { Actor } from './actor';
import { store } from '@redux/store';
import { setFocusStatus } from '@redux/slices/commonAppStateSlice';

export class Building extends Actor {
  constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
    super(scene, x, y, type);

    this.getBody().setSize(1000, 1000);
    this.getBody().setOffset(0, 0);
    this.setScale(1, 1);
    this.getBody().setCollideWorldBounds();
    this.setInteractive();
    this.on('pointerover', () => {
      store.dispatch(setFocusStatus(true));
    });

    this.on('pointerout', () => {
      store.dispatch(setFocusStatus(false));
    });
  }
}

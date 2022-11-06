import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    this.load.image('loader', './img/loader.png');
  }

  update(time, delta) {
    this.scene.start('Preload');
  }
}

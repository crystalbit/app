import { extractURLParam } from '@global/utils/urlParams';
import { NETWORK_DATA } from '@root/settings';
import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  selectRover() {
    const roverId = extractURLParam(window.location, 'transportId');
    if (!roverId) return;
    switch (roverId) {
      case '14':
        return 'rover4.json';
      case '13':
        return 'rover2.json';
      case '12':
        return 'rover3.json';
      default:
        return 'rover1.json';
    }
  }

  preload() {
    this.ldr = this.add
      .image(window.innerWidth / 2, window.innerHeight / 2, 'loader')
      .setOrigin(0.5)
      .setScale(0.7);
    this.tweens.add({
      targets: this.ldr,
      angle: 360,
      duration: 1000,
      ease: 'Linear',
      repeat: -1
    });

    window.addEventListener('resize', this.resize());

    this.load.path = './miningImg/';

    const selectedAvatar = extractURLParam(window.location, 'avatarId');
    if (selectedAvatar) {
      this.load.image(
        'selected-avatar',
        `${NETWORK_DATA.AVATAR_META}${selectedAvatar}.jpg`
      );
    }

    this.load
      .image('bg', 'bg.jpg')
      .multiatlas('rover', this.selectRover())
      .multiatlas('objects', 'objects.json')
      .multiatlas('worm', 'worm.json')
      .multiatlas('gui', 'gui.json')
      .multiatlas('nocompress', 'nocompress.json')
      .tilemapTiledJSON('map', 'level1.json');

    this.load.path = './miningFont/';

    this.load.rexWebFont({
      custom: {
        families: ['Helvetica', 'Play'],
        urls: ['font/stylesheet.css']
      }
    });
  }

  resize() {
    this.ldr.setPosition(window.innerWidth / 2, window.innerHeight / 2);
  }

  update() {
    window.removeEventListener('resize', this.resize());
    this.scene.start('Main');
  }
}

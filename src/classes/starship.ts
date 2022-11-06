import { Actor } from './actor';
import { GAME_OBJECTS } from '@features/game/constants/gameObjects';

export class Starship extends Actor {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_OBJECTS.starship[0]);

    // Add handlers for keyboard actions
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    // Physical properties
    this.getBody().setSize(150, 150);
    this.getBody().setOffset(0, 0);
  }

  update(): void {
    this.getBody().setVelocity(0);
    if (this.keyW?.isDown) {
      this.body.velocity.y = -350;
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -350;
      this.checkFlip();
      this.getBody().setOffset(150, 0);
    }
    if (this.keyS?.isDown) {
      this.body.velocity.y = 350;
    }
    if (this.keyD?.isDown) {
      this.body.velocity.x = 350;
      this.checkFlip();
      this.getBody().setOffset(0, 0);
    }
  }
}

import { GAME_OBJECTS } from '@features/game/constants/gameObjects';
import { NETWORK_DATA } from '@root/settings';
import { APP_VERSION } from '@root/settings/chains';
import { Scene } from 'phaser';

export class LoadingScene extends Scene {
  private text!: any;

  constructor() {
    super('loading-scene');
  }

  private getCorrectTileMap = () => {
    const mapType = NETWORK_DATA.MAP_TYPE;

    switch (mapType) {
      case 'Polygon':
        return 'polygonTilesMap.json';
      case 'Harmony':
        return 'newMapTiles.json';
    }
  };

  private getCorrectMapImage = () => {
    const mapType = NETWORK_DATA.MAP_TYPE;

    switch (mapType) {
      case 'Polygon':
        return `./map/polygonMap.jpg`;
      case 'Harmony':
        return `./map/newMap.jpg`;
    }
  };

  preload(): void {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.text = this.add
      .text(screenCenterX, screenCenterY, 'Loading...')
      .setOrigin(0.5)
      .setResolution(3);

    this.load.image(
      GAME_OBJECTS.hoverCircle[0],
      `./objects/hoverCircle.png?${APP_VERSION}`
    );
    this.load.image({
      key: 'tiles',
      url: this.getCorrectMapImage()
    });
    this.load.tilemapTiledJSON('map', `./tiles/${this.getCorrectTileMap()}`);
  }

  create(): void {
    this.scene.start('mainMap-scene');
  }
}

import { Building } from '@classes/building';
import {
  GAME_OBJECTS,
  HOVER_CIRCLE_POSITIONS
} from '@features/game/constants/gameObjects';
import { store } from '@redux/store';
import { NETWORK_DATA } from '@root/settings';
import { APP_VERSION } from '@root/settings/chains';
import {
  changeGameMode,
  DEFAULT_POPUP_STATE,
  GAME_VIEW_MODES,
  setGamePopupInfo,
  setRepaintMode,
  setReplaceMode
} from '@slices/gameManagementSlice';
import Phaser, { Scene, Tilemaps } from 'phaser';

const SCENE_KEY = 'mainMap-scene';
const SCENE_TILE_WIDTH = 1000;
const SCENE_TILE_HEIGHT = 1000;

type BuildingName =
  | 'spaceXChange'
  | 'transport'
  | 'base'
  | 'robots'
  | 'powerplant';

// To improve: connect this to global redux store, for now this solution is okay I think
let SCENE_OBJECTS_STORAGE: Record<number, boolean> = {};

let oldHref = document.location.href;

let buildingCursorIsDown: boolean = false;

window.onload = function () {
  let bodyList = document.querySelector('body');

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        console.log('__rewrite saved coord__');
        SCENE_OBJECTS_STORAGE = {};
      }
    });
  });

  let config = {
    childList: true,
    subtree: true
  };

  if (bodyList) {
    observer.observe(bodyList, config);
  }
};

enum DrawAction {
  INITIAL,
  NO_ACTION_NEEDED,
  LOADER_NEEDED,
  DOWNLOADING,
  DRAW_NEEDED
}

export class MainMapScene extends Scene {
  // private starship!: GameObjects.Sprite;

  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private groundLayer!: Tilemaps.TilemapLayer;
  private mountainsLayer!: Tilemaps.TilemapLayer;
  private cursorKeys!: any;
  private cursorHandler!: any;
  private cursorMarker!: any;
  private base!: any;
  private transport!: any;
  private robots!: any;
  private powerplant!: any;
  private spaceXChange!: any;
  private hoverCircle!: any;
  private toolTip!: any;
  private toolTipText!: any;
  private replaceGhostObj!: any;
  private replaceObj!: any;

  mapKeyToBuilding: Record<string, BuildingName> = {
    [GAME_OBJECTS.spaceXChange[0]]: 'spaceXChange',
    [GAME_OBJECTS.base[0]]: 'base',
    [GAME_OBJECTS.base[1]]: 'base',
    [GAME_OBJECTS.transportBay[0]]: 'transport',
    [GAME_OBJECTS.transportBay[1]]: 'transport',
    [GAME_OBJECTS.transportBay[2]]: 'transport',
    [GAME_OBJECTS.robot[0]]: 'robots',
    [GAME_OBJECTS.robot[1]]: 'robots',
    [GAME_OBJECTS.robot[2]]: 'robots',
    [GAME_OBJECTS.powerplant[0]]: 'powerplant',
    [GAME_OBJECTS.powerplant[1]]: 'powerplant',
    [GAME_OBJECTS.powerplant[2]]: 'powerplant'
  };

  private drawStates: Record<BuildingName, DrawAction> = {
    spaceXChange: DrawAction.INITIAL,
    base: DrawAction.INITIAL,
    transport: DrawAction.INITIAL,
    powerplant: DrawAction.INITIAL,
    robots: DrawAction.INITIAL
  };

  constructor() {
    super(SCENE_KEY);
  }

  preload() {
    this.load.setPath('./objects/');
    this.load.image(GAME_OBJECTS.ghostBase[0], `baseGhost.png?${APP_VERSION}`);
    this.load.image(
      GAME_OBJECTS.ghostPower[0],
      `powerGhost.png?${APP_VERSION}`
    );
    this.load.image(
      GAME_OBJECTS.ghostRobots[0],
      `robotsGhost.png?${APP_VERSION}`
    );
    this.load.image(
      GAME_OBJECTS.ghostTransport[0],
      `transportGhost.png?${APP_VERSION}`
    );
  }

  create(): void {
    this.initMap();

    // this.starship = new Starship(this, 1200, 1000);
    // this.physics.add.collider(this.starship, this.mountainsLayer);
    // this.physics.add.collider(this.starship, this.groundLayer);

    this.initCamera();
    this.createTooltip();

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.input.mouse.disableContextMenu();
    this.cursorHandler = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.cameras.main,
      left: this.cursorKeys.left,
      right: this.cursorKeys.right,
      up: this.cursorKeys.up,
      down: this.cursorKeys.down,
      speed: 0.5
    });
    this.cursorMarker = this.add.graphics();

    // Custom cursor
    this.setCustomCursor();
  }

  private doDrawAction(
    key: string,
    condition: boolean,
    imgURI: string,
    coordsToPlace: { x: string; y: string },
    tooltipText: string,
    description: string,
    actions: string[],
    type: string,
    yPosCoeff: number,
    hoverPosCoeff: { x: number; y: number },
    tooltipPosCoeff: { x: number; y: number },
    popupPosCoeff: { x: number; y: number },
    moveBuildingCoeff: { x: number; y: number }
  ) {
    const building = this.mapKeyToBuilding[key];

    if (condition && this.drawStates[building] === DrawAction.INITIAL) {
      this.drawStates[building] = DrawAction.LOADER_NEEDED;
    }

    if (this.drawStates[building] === DrawAction.LOADER_NEEDED) {
      this.drawStates[building] = DrawAction.DOWNLOADING;

      this.loadAssetDynamically(
        key,
        NETWORK_DATA.MAP_TYPE === 'Polygon'
          ? `${imgURI}-polygon.png`
          : `${imgURI}.png`,
        (buildingKey) => {
          this.drawStates[this.mapKeyToBuilding[buildingKey]] =
            DrawAction.DRAW_NEEDED;
          console.log(buildingKey, 'LOAD FINISHED');
        }
      );
    }

    if (this.drawStates[building] === DrawAction.DRAW_NEEDED) {
      this.drawStates[building] = DrawAction.NO_ACTION_NEEDED;
      console.log(building, 'DrawAction.DRAW_NEEDED');
      this[building]?.destroy();

      const { pixelX, pixelY, index } =
        this.groundLayer.getTileAt(
          parseInt(coordsToPlace.x),
          parseInt(coordsToPlace.y)
        ) ?? {};

      const {
        pixelX: mountainsPixelX,
        pixelY: mountainsPixelY,
        index: mountainsIndex
      } = this.mountainsLayer.getTileAt(
        parseInt(coordsToPlace.x),
        parseInt(coordsToPlace.y)
      ) ?? {};

      const pixelXValue = pixelX ?? mountainsPixelX;
      const pixelYValue = pixelY ?? mountainsPixelY;
      const indexValue = index ?? mountainsIndex;

      this[building] = new Building(
        this,
        pixelXValue + SCENE_TILE_WIDTH / 2 + moveBuildingCoeff.x,
        pixelYValue + SCENE_TILE_WIDTH / yPosCoeff + moveBuildingCoeff.y,
        key
      );
      SCENE_OBJECTS_STORAGE[indexValue] = true;

      this[building].setDepth(2);
      this.handleHoverState(
        building,
        pixelXValue - hoverPosCoeff.x,
        pixelYValue - hoverPosCoeff.y
      );

      this[building].on('pointermove', (pointer: any) => {
        if (this.toolTipText.text !== tooltipText) {
          this.toolTipText.destroy();
          this.toolTipText = this.add
            .text(0, 0, tooltipText, {
              fontFamily: 'Arial',
              color: '#fff',
              fontSize: '100px'
            })
            .setOrigin(0);
          this.toolTipText.setDepth(4);
          this.toolTip.setDepth(3);
        }

        this.toolTip.x = pointer.worldX - 350;
        this.toolTip.y = pointer.worldY - 350;
        this.toolTipText.x = pointer.worldX - tooltipPosCoeff.x;
        this.toolTipText.y = pointer.worldY - tooltipPosCoeff.y;
      });

      this[building].on('pointerup', (pointer: any) => {
        const { position } = pointer;
        store.dispatch(
          setGamePopupInfo({
            title: tooltipText,
            text: description,
            x: `${position.x - popupPosCoeff.x}px`,
            y: `${position.y - popupPosCoeff.y}px`,
            level: 1,
            isActive: true,
            actions,
            type
          })
        );
      });
    }
  }

  buildSpaceXChangeOnce() {
    if (!NETWORK_DATA.DEX) return;
    const { coords, shift } = MainMapScene.getXChangeCoords();
    this.doDrawAction(
      GAME_OBJECTS.spaceXChange[0],
      true,
      'dexNew',
      coords,
      'SpaceXChange',
      'Swap assets in the Colony DEX, provide funds to liquidity pools',
      ['enter-sex'],
      'SpaceXChange',
      1.5,
      HOVER_CIRCLE_POSITIONS.dex[NETWORK_DATA.MAP_TYPE],
      { x: 280, y: 310 },
      { x: 260, y: 305 },
      shift
    );
  }

  private isMissionsAvailable = false;

  buildBaseStationOnce(landId: string) {
    const baseCoordsToPlace =
      store.getState()?.game?.landPlacesInfo?.base?.coords ?? {};

    const isMissionsAvailable =
      store?.getState()?.balanceStats?.landMissionsLimits?.[landId] ?? 0;

    if (isMissionsAvailable && !this.isMissionsAvailable) {
      this.isMissionsAvailable = true;
      this.drawStates.base = DrawAction.INITIAL;
    }

    const key =
      isMissionsAvailable && NETWORK_DATA.MISSIONS
        ? GAME_OBJECTS.base[1]
        : GAME_OBJECTS.base[0];

    const imgURI =
      isMissionsAvailable && NETWORK_DATA.MISSIONS ? 'base-active' : 'base';

    this.doDrawAction(
      key,
      Boolean(parseInt(baseCoordsToPlace.x) || parseInt(baseCoordsToPlace.y)),
      imgURI,
      baseCoordsToPlace,
      'Base Station',
      'Your home as a colonist. Rest, store items, and access your dashboard',
      NETWORK_DATA.MISSIONS ? ['replace', 'missions'] : ['replace'],
      'Base Station',
      2.5,
      HOVER_CIRCLE_POSITIONS.base[NETWORK_DATA.MAP_TYPE],
      { x: 200, y: 305 },
      { x: 225, y: 270 },
      isMissionsAvailable ? { x: 0, y: 0 } : { x: 0, y: 75 }
    );
  }

  private lastTransportLevel = 0;
  private lastRobotAssemblyLevel = 0;
  private lastPowerProductionLevel = 0;

  buildTransportOnce() {
    const transportCoordsToPlace =
      store.getState()?.game?.landPlacesInfo?.transport?.coords ?? {};
    const transportLevel = parseInt(
      store.getState().game?.landPlacesInfo?.transport?.availability ?? '1'
    );

    if (transportLevel !== this.lastTransportLevel) {
      this.lastTransportLevel = transportLevel;
      this.drawStates.transport = DrawAction.INITIAL;
    }

    this.doDrawAction(
      GAME_OBJECTS.transportBay[transportLevel - 1],
      Boolean(
        parseInt(transportCoordsToPlace.x) || parseInt(transportCoordsToPlace.y)
      ),
      `transportBay-${transportLevel}`,
      transportCoordsToPlace,
      'Transport Garage',
      'Your hub for vehicles and transportation',
      ['replace'],
      'Transport',
      2,
      HOVER_CIRCLE_POSITIONS.transport[NETWORK_DATA.MAP_TYPE],
      { x: 315, y: 305 },
      { x: 200, y: 270 },
      { x: 0, y: 0 }
    );
  }

  buildRobotAssemblyOnce() {
    const robotCoordsToPlace =
      store.getState()?.game?.landPlacesInfo?.robot?.coords ?? {};
    const robotLevel = parseInt(
      store.getState().game?.landPlacesInfo?.robot?.availability ?? '1'
    );

    if (robotLevel !== this.lastRobotAssemblyLevel) {
      this.lastRobotAssemblyLevel = robotLevel;
      this.drawStates.robots = DrawAction.INITIAL;
    }

    this.doDrawAction(
      GAME_OBJECTS.robot[robotLevel - 1],
      Boolean(parseInt(robotCoordsToPlace.x) || parseInt(robotCoordsToPlace.y)),
      `robots-${robotLevel}`,
      robotCoordsToPlace,
      'Robot Assembly',
      'Produce, repair, and upgrade robots and other machinery',
      ['replace'],
      'Robot Assembly',
      2,
      HOVER_CIRCLE_POSITIONS.robots[NETWORK_DATA.MAP_TYPE],
      { x: 280, y: 305 },
      { x: 230, y: 270 },
      { x: 200, y: 0 }
    );
  }

  buildPowerPlantOnce() {
    const powerCoordsToPlace =
      store.getState()?.game?.landPlacesInfo?.powerplant?.coords ?? {};
    const powerLevel = parseInt(
      store.getState().game?.landPlacesInfo?.powerplant?.availability ?? '1'
    );

    if (powerLevel !== this.lastPowerProductionLevel) {
      this.lastPowerProductionLevel = powerLevel;
      this.drawStates.powerplant = DrawAction.INITIAL;
    }

    this.doDrawAction(
      GAME_OBJECTS.powerplant[powerLevel - 1],
      Boolean(parseInt(powerCoordsToPlace.x) || parseInt(powerCoordsToPlace.y)),
      `powerplant-${powerLevel}`,
      powerCoordsToPlace,
      'Power Plant',
      'Generate and distribute electrical power to your plot and complete missions',
      ['replace'],
      'Power Production',
      2,
      HOVER_CIRCLE_POSITIONS.power[NETWORK_DATA.MAP_TYPE],
      { x: 178, y: 305 },
      { x: 250, y: 270 },
      { x: 0, y: 0 }
    );
  }

  update(): void {
    const isBuildMode = store.getState()?.game?.mode === GAME_VIEW_MODES.build;
    const isRepaintNeeded = store.getState().game?.isRepaintNeeded;
    const id = new URLSearchParams(window.location.search).get('id');

    const isBuildingMouseUpEvent =
      !this.input.manager.activePointer.isDown && buildingCursorIsDown; // was down, but isn't now
    buildingCursorIsDown =
      this.input.manager.activePointer.isDown && isBuildMode;
    this.buildSpaceXChangeOnce();
    this.buildBaseStationOnce(id ?? '');
    this.buildTransportOnce();
    this.buildRobotAssemblyOnce();
    this.buildPowerPlantOnce();

    let worldPoint: { x: number; y: number } =
      this.input.activePointer.positionToCamera(this.cameras.main) as {
        x: number;
        y: number;
      };

    // Rounds down to the nearest tile
    let pointerTileX = this.groundLayer.worldToTileX(worldPoint.x);
    let pointerTileY = this.groundLayer.worldToTileY(worldPoint.y);

    const { index, pixelY, pixelX, collides } =
      this.groundLayer.getTileAt(pointerTileX, pointerTileY) ?? {};

    if (!isBuildMode) {
      this.toolTipText.setDepth(4);
      this.toolTip.setDepth(3);
      if (this.input.manager.activePointer.isDown) {
        this.setGrabbedCursor();
      } else if (store.getState()?.common?.isGameObjectFocused) {
        this.setActiveCursor();
      } else {
        this.setCustomCursor();
      }
    } else {
      if (typeof collides === 'undefined' || SCENE_OBJECTS_STORAGE[index]) {
        this.setNonBuildCursor();
      } else this.setBuildCursor();
    }

    if (isBuildMode) {
      this.toolTipText.setDepth(-1);
      this.toolTip.setDepth(-1);
      this.cursorHandler.update();
      this.cursorMarker.strokeRect(0, 0, SCENE_TILE_WIDTH, SCENE_TILE_HEIGHT);

      // Snap to tile coordinates, but in world space
      this.cursorMarker.x = this.groundLayer.tileToWorldX(pointerTileX);
      this.cursorMarker.y = this.groundLayer.tileToWorldY(pointerTileY);

      this.cursorMarker.lineStyle(
        8,
        typeof collides === 'undefined' || SCENE_OBJECTS_STORAGE[index]
          ? 0xcb1d1d
          : 0x006400,
        1
      );

      if (isBuildingMouseUpEvent) {
        this.hoverCircle?.destroy?.();
        this.toolTipText.alpha = 0;
        this.toolTip.alpha = 0;

        if (typeof collides === 'undefined') return;

        const isEmpty = !SCENE_OBJECTS_STORAGE[index];

        if (isEmpty) {
          store.dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
          const id = new URLSearchParams(window.location.search).get('id');
          const objectToSet =
            store.getState().game?.objectToPlace ?? this.replaceObj;

          const { availabilityOnMap, method, key, ghostObject } =
            MainMapScene.getMethod(objectToSet, Boolean(this.replaceGhostObj));

          const isWithBuild = !parseInt(availabilityOnMap);

          let ghostObj = this.add.image(
            pixelX + SCENE_TILE_HEIGHT / 2,
            pixelY + SCENE_TILE_HEIGHT / 2,
            ghostObject
          );

          this.replaceGhostObj?.destroy();

          // @ts-ignore
          window[method](
            objectToSet,
            parseInt(id ?? '0'),
            pointerTileX,
            pointerTileY,
            !this.replaceObj,
            () => {
              ghostObj.destroy();
              this.drawStates[key] = DrawAction.INITIAL;
              store.dispatch(setReplaceMode(false));
              this.replaceGhostObj = null;
              this.replaceObj = null;
              window.updateCLNY(address);
            },
            () => {
              if (
                this.replaceObj &&
                typeof this.replaceObj?.destroy === 'function'
              )
                this.replaceObj.destroy();
              ghostObj.destroy();
              this.cursorMarker.strokeRect(0, 0, 0, 0);
              const canvas = document.getElementsByTagName('canvas')[0];
              store.dispatch(setReplaceMode(false));
              if (!canvas?.style?.cursor) {
                this.setCustomCursor();
              }
              this.replaceGhostObj = null;
              this.replaceObj = null;
            },
            this.replaceObj ? false : isWithBuild
          );
        }
      }
    } else {
      // DROP THE PLACEMENT CURSOR STYLES
      this.cursorMarker.lineStyle(0, 0x000000, 0);
      this.cursorMarker.strokeRect(0, 0, 0, 0);

      // HIDE DIZ
      this.cursorMarker.x = -1000000000000;
      this.cursorMarker.y = -1000000000000;

      const canvas = document.getElementsByTagName('canvas')[0];
      if (!canvas?.style?.cursor) {
        this.setCustomCursor();
      }
    }

    if (isRepaintNeeded)
      setTimeout(() => store.dispatch(setRepaintMode(false)), 200);
  }

  private initMap(): void {
    this.map = this.make.tilemap({
      key: 'map',
      tileWidth: SCENE_TILE_WIDTH,
      tileHeight: SCENE_TILE_HEIGHT
    });

    this.tileset = this.map.addTilesetImage(
      'newMap',
      'tiles',
      SCENE_TILE_WIDTH,
      SCENE_TILE_HEIGHT,
      0,
      0
    );
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
    this.mountainsLayer = this.map.createLayer('Mountains', this.tileset, 0, 0);

    this.physics.world.setBounds(
      0,
      0,
      this.groundLayer.width,
      this.groundLayer.height
    );
    this.mountainsLayer.setCollisionByProperty({
      collides: true
    });
    this.showDebugWalls(false);
  }

  private initCamera(): void {
    const cam = this.cameras.main;
    cam.setSize(this.game.scale.width, this.game.scale.height);
    cam.followOffset.set(0, 0);
    // cam.setZoom(0.5);

    cam.setBounds(
      0,
      0,
      this.groundLayer.displayWidth,
      this.groundLayer.displayHeight
    );

    cam.setZoom(0.2);

    const initialCameraSetup =
      NETWORK_DATA.MAP_TYPE === 'Harmony' ? [7000, 4000] : [10000, 2000];

    cam.centerOn(initialCameraSetup[0], initialCameraSetup[1]);

    this.input.on('pointermove', function (p: any) {
      if (!p.isDown) return;
      cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
      cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
    });

    let maxZoom = 1.5;
    let minZoom = 0.2;

    // @ts-ignore
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (
        deltaY > 0 &&
        cam.zoom - 0.2 <= maxZoom &&
        cam.zoom - 0.2 >= minZoom
      ) {
        cam.zoom -= 0.2;
      }

      if (
        deltaY < 0 &&
        cam.zoom + 0.2 <= maxZoom &&
        cam.zoom + 0.2 >= minZoom
      ) {
        cam.zoom += 0.2;
      }
    });

    window.onZoomIn = (e: MouseEvent) => {
      e?.stopPropagation();
      if (cam.zoom + 0.2 <= maxZoom && cam.zoom + 0.2 >= minZoom) {
        cam.zoom += 0.2;
      }
    };
    window.onZoomOut = (e: MouseEvent) => {
      e?.stopPropagation();
      if (cam.zoom - 0.2 <= maxZoom && cam.zoom - 0.2 >= minZoom) {
        cam.zoom -= 0.2;
      }
    };
    window.replace = (field: string) => this.replaceModeActivated(field);

    // this.cameras.main.startFollow(this.starship, true, 0.09, 0.09);
  }

  private showDebugWalls(active: boolean = true): void {
    if (!active) return;
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.mountainsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255)
    });
  }

  private setCustomCursor(): void {
    this.input.setDefaultCursor(`
      url('./objects/cursor.cur'),
      pointer
    `);
  }

  private setGrabbedCursor(): void {
    this.input.setDefaultCursor(`
      url('./objects/cursorGrabbed.cur'),
      pointer
    `);
  }

  private setBuildCursor(): void {
    this.input.setDefaultCursor(`
    url('./objects/cursorBuild.cur'),
      pointer
    `);
  }

  private setNonBuildCursor(): void {
    this.input.setDefaultCursor(`
    url('./objects/cursorNonBuild.cur'),
      pointer
    `);
  }

  private setActiveCursor(): void {
    this.input.setDefaultCursor(`url('./objects/cursorActive.cur'), pointer`);
  }

  private handleHoverState(type: BuildingName, x: number, y: number): void {
    const isBuildMode = store.getState()?.game?.mode === GAME_VIEW_MODES.build;
    if (isBuildMode && this.hoverCircle) return this.hoverCircle.setDepth(-10);
    if (!isBuildMode && this.hoverCircle) this.hoverCircle.setDepth(1);

    if (this[type]) {
      this[type].on('pointerover', () => {
        if (!this.hoverCircle) {
          this.hoverCircle = this.setHoverCircle(x, y);
          this.hoverCircle.setRealSpriteSize(
            type === 'base' ? 1000 : 800,
            type === 'base' ? 1300 : 900
          );
          this.hoverCircle.setDepth(1);
        }
      });
      this[type].on('pointerout', () => {
        if (this.hoverCircle) {
          this.hoverCircle.destroy();
          this.hoverCircle = null;
        }
      });
    }
  }

  private setHoverCircle(x: number, y: number): Building {
    return new Building(
      this,
      x + SCENE_TILE_WIDTH / 2 - 20,
      y + SCENE_TILE_WIDTH / 2 + 100,
      GAME_OBJECTS.hoverCircle[0]
    );
  }

  private async replaceModeActivated(field: string) {
    const { ghostObject, key } = MainMapScene.getMethod(field, true);
    this[key].destroy();

    this.replaceGhostObj = this.add.image(
      this[key].x,
      this[key].y,
      ghostObject
    );

    this.replaceObj = field;
    store.dispatch(setGamePopupInfo(DEFAULT_POPUP_STATE));
    store.dispatch(changeGameMode(GAME_VIEW_MODES.build));
    if (this.hoverCircle) this.hoverCircle.destroy();

    const { index } =
      this.groundLayer.getTileAtWorldXY(
        parseInt(this[key].x),
        parseInt(this[key].y)
      ) ?? {};

    delete SCENE_OBJECTS_STORAGE[index];
  }

  private createTooltip(text = 'Base station') {
    this.toolTip = this.add.rectangle(0, 0, 850, 200, 0x000000).setOrigin(0);
    this.toolTipText = this.add
      .text(0, 0, text, {
        fontFamily: 'Arial',
        color: '#fff',
        fontSize: '100px'
      })
      .setOrigin(0);
    this.toolTip.alpha = 0;
    this.toolTip.setDepth(3);
    this.toolTipText.setDepth(4);

    this.input.setPollOnMove();

    this.input.on(
      'gameobjectover',
      () => {
        this.tweens.add({
          targets: [this.toolTip, this.toolTipText],
          alpha: { from: 0, to: 1 },
          repeat: 0,
          duration: 50
        });
      },
      this
    );

    this.input.on('gameobjectout', () => {
      this.toolTip.alpha = 0;
      this.toolTipText.alpha = 0;
    });
  }

  private static getLevelValue(availabilityOnMap: string, isReplace?: boolean) {
    if (isReplace) {
      return parseInt(availabilityOnMap);
    } else {
      return parseInt(availabilityOnMap) < 3
        ? parseInt(availabilityOnMap) + 1
        : 3;
    }
  }

  private static getMethod(
    objectToSet: string | null,
    isReplace: boolean = false
  ): {
    method: string;
    availabilityOnMap: string;
    object: string;
    key: BuildingName;
    ghostObject: string;
  } {
    let method: string;
    let availabilityOnMap: string;
    let object: string;
    let level: number;
    let key: BuildingName;
    let ghostObject: string;

    switch (objectToSet) {
      case 'Base Station':
        availabilityOnMap =
          store.getState().game?.landPlacesInfo?.base?.availability ?? '0';
        method = 'placeBaseObject';
        object = GAME_OBJECTS.base[0];
        key = 'base';
        ghostObject = GAME_OBJECTS.ghostBase[0];
        break;
      case 'Robot Assembly':
        availabilityOnMap =
          store.getState().game?.landPlacesInfo?.robot?.availability ?? '0';
        level = MainMapScene.getLevelValue(availabilityOnMap, isReplace);
        method = 'placeRobotsObject';
        object = GAME_OBJECTS.robot[level - 1];
        key = 'robots';
        ghostObject = GAME_OBJECTS.ghostRobots[0];
        break;
      case 'Transport':
        availabilityOnMap =
          store.getState().game?.landPlacesInfo?.transport?.availability ?? '0';
        level = MainMapScene.getLevelValue(availabilityOnMap, isReplace);
        method = 'placeTransportObject';
        object = GAME_OBJECTS.transportBay[level - 1];
        key = 'transport';
        ghostObject = GAME_OBJECTS.ghostTransport[0];
        break;
      case 'Power Production':
        availabilityOnMap =
          store.getState().game?.landPlacesInfo?.powerplant?.availability ??
          '0';
        level = MainMapScene.getLevelValue(availabilityOnMap, isReplace);
        method = 'placePowerplantObject';
        object = GAME_OBJECTS.powerplant[level - 1];
        key = 'powerplant';
        ghostObject = GAME_OBJECTS.ghostPower[0];
        break;
      default:
        availabilityOnMap =
          store.getState().game?.landPlacesInfo?.base?.availability ?? '0';
        method = 'placeBaseObject';
        object = GAME_OBJECTS.base[0];
        ghostObject = GAME_OBJECTS.ghostBase[0];
        key = 'base';
    }

    return { method, availabilityOnMap, object, key, ghostObject };
  }

  private callbackSet = false;

  private assetsLoaded: Set<string> = new Set();

  private loadAssetDynamically = (
    key: string,
    url: string,
    callBack: (buildingKey: string) => void
  ) => {
    if (!this.assetsLoaded.has(url)) {
      this.assetsLoaded.add(url);
    } else {
      // не надо повторно грузить (всё равно не будет)
      callBack(key);
      return;
    }
    if (!this.callbackSet) {
      this.callbackSet = true;
      this.load.on('filecomplete', callBack, this);
      this.load.on('loaderror', console.log, this);
    }

    this.load.image(key, `${url}?${APP_VERSION}`);

    this.load.start();
  };

  private static getXChangeCoords() {
    const mapType = NETWORK_DATA.MAP_TYPE;
    switch (mapType) {
      case 'Polygon':
        return {
          coords: { x: '5', y: '1' },
          shift: { x: 200, y: -400 }
        };
      case 'Harmony':
        return {
          coords: { x: '6', y: '2' },
          shift: { x: 50, y: -100 }
        };
    }
  }
}

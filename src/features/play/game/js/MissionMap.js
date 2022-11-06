import { Y_POS_DIFF } from '@features/play/constants';
import { MINING_MAP_OBJECT } from '@features/play/types';
import Phaser from 'phaser';

let map_array = [];
let obj_exits = [];
let obj_res = [];
let fogs = [];
let worms = [];
let res_for_worms = [];
let exits_show = [];
let tileMap;
let curr_worm;
let gr;

export default class MissionMap extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);

    scene.add.existing(this);
    this.resetMap();
    obj_exits = [];
    obj_res = [];
    fogs = [];
    worms = [];
    res_for_worms = [];
    exits_show = [];
    this.scan_arr = [];

    this.tileMap = tileMap = scene.make.tilemap({ key: 'map' });
    const tileset = tileMap.addTilesetImage('bg_tileset', 'bg');
    let bg_layer = tileMap.createLayer('Background', tileset, 0, 0);

    gr = scene.add.graphics().lineStyle(3, 0xffffff, 0.03);

    try {
      scene.cam2.ignore([this, bg_layer, gr]);
    } catch (err) {}

    this.createAnim(scene);
    this.drawGrid();
  }

  getObjPos(tx, ty) {
    let find_obj;
    for (let i = 0; i < obj_res.length; i++) {
      const obj = obj_res[i];
      if (obj.tileX === tx && obj.tileY === ty) {
        find_obj = obj;
        break;
      }
    }
    return find_obj;
  }

  getDebris(tx, ty) {
    const find_obj = [];
    for (let i = 0; i < obj_res.length; i++) {
      const obj = obj_res[i];
      if (obj.name === 'debris') {
        if (obj.tileX === tx + 1 && obj.tileY === ty) find_obj.push(obj);
        if (obj.tileX === tx - 1 && obj.tileY === ty) find_obj.push(obj);
        if (obj.tileX === tx && obj.tileY === ty + 1) find_obj.push(obj);
        if (obj.tileX === tx && obj.tileY === ty - 1) find_obj.push(obj);
      }
    }

    return find_obj;
  }

  getTilePos(tx, ty) {
    return tileMap.tileToWorldXY(tx, ty);
  }
  getTilePosX(tx) {
    return tileMap.tileToWorldX(tx);
  }
  getTilePosY(ty) {
    return tileMap.tileToWorldY(ty);
  }

  getArrayPos(tx, ty) {
    if (ty < 0 || ty > map_array.length || tx < 0 || tx > map_array[0].length)
      return 1;
    return map_array[ty][tx];
  }
  setArrayPos(tx, ty, tdata) {
    map_array[ty][tx] = tdata;
  }
  getTilePointX(x) {
    return tileMap.worldToTileX(x + this.scene.cameras.main.scrollX);
  }
  getTilePointY(y) {
    return tileMap.worldToTileY(y + this.scene.cameras.main.scrollY);
  }
  addExits(startPoint) {
    const { x, y } = startPoint;
    exits_show.push({ tileY: y, tileX: x });
    map_array[y][x] = MINING_MAP_OBJECT.gate;

    const ext = this.scene.add
      .sprite(
        this.getTilePosX(x),
        this.getTilePosY(y) + 10,
        'objects',
        'exit sign/0005'
      )
      .setVisible(true)
      .play('exit anim');
    ext.name = 'exit';
    ext.tileX = x;
    ext.tileY = y;
    this.scene.cam2.ignore(ext);
    obj_exits.push(ext);

    this.addObjects();
  }

  addObjects() {
    let tileID = 0;
    const tilesCutouts = [
      64, 77, 82, 88, 181, 182, 261, 262, 264, 279, 280, 281
    ];
    for (let i = 0; i < map_array.length; i++) {
      for (let j = 0; j < map_array[i].length; j++) {
        if (tilesCutouts.indexOf(tileID) >= 0) {
          const ext = this.scene.add
            .sprite(
              this.getTilePosX(j),
              this.getTilePosY(i),
              'objects',
              'cutouts/tile' + String(tileID).padStart(3, '0')
            )
            .setDepth(0.1)
            .setVisible(true);
          this.scene.cam2.ignore(ext);
          obj_exits.push(ext);
        }
        tileID++;
      }
    }
  }

  // addWorms() {
  //   for (let i = 0; i < 4; i++) {
  //     let rnd_res = Phaser.Math.Between(0, res_for_worms.length - 1);
  //     let rnd_pos = Phaser.Math.Between(1, 8);
  //     let worm_added = false;
  //
  //     switch (rnd_pos) {
  //       case 1:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX - 1,
  //           res_for_worms[rnd_res].tileY
  //         );
  //         break;
  //       case 2:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX - 1,
  //           res_for_worms[rnd_res].tileY - 1
  //         );
  //         break;
  //       case 3:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX,
  //           res_for_worms[rnd_res].tileY - 1
  //         );
  //         break;
  //       case 4:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX + 1,
  //           res_for_worms[rnd_res].tileY - 1
  //         );
  //         break;
  //       case 5:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX - 1,
  //           res_for_worms[rnd_res].tileY + 1
  //         );
  //         break;
  //       case 6:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX,
  //           res_for_worms[rnd_res].tileY + 1
  //         );
  //         break;
  //       case 7:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX + 1,
  //           res_for_worms[rnd_res].tileY
  //         );
  //         break;
  //       case 8:
  //         worm_added = this.wormCreate(
  //           res_for_worms[rnd_res].tileX + 1,
  //           res_for_worms[rnd_res].tileY + 1
  //         );
  //         break;
  //     }
  //     if (worm_added) res_for_worms.splice(rnd_res, 1);
  //     else i--;
  //   }
  // }

  wormCreate(tx, ty) {
    const rover = this.scene.rover;
    const tData = this.getArrayPos(tx, ty);
    if (
      tData !== MINING_MAP_OBJECT.gate &&
      rover.tileX - 1 !== tx &&
      rover.tileX + 1 !== tx &&
      rover.tileY - 1 !== ty &&
      rover.tileY + 1 !== ty
    ) {
      const worm = this.scene.add
        .sprite(
          this.getTilePosX(tx),
          this.getTilePosY(ty),
          'worm',
          'appearance/worm_ani_000'
        )
        .setVisible(false);
      worm.name = 'worm';
      worm.showed = false;
      worm.tileX = tx;
      worm.tileY = ty;
      map_array[ty][tx] = MINING_MAP_OBJECT.worm;
      this.scene.cam2.ignore(worm);
      worms.push(worm);
      return true;
    } else return false;
  }

  showWorm(tx, ty) {
    let worm_finded;
    for (let i = 0; i < worms.length; i++) {
      const worm = worms[i];
      const wtx = worm.tileX;
      const wty = worm.tileY;
      if (
        (wtx === tx - 1 && wty === ty) ||
        (wtx === tx + 1 && wty === ty) ||
        (wtx === tx && wty === ty - 1) ||
        (wtx === tx && wty === ty + 1)
      ) {
        worm_finded = worm;
        i = worms.length;
      }
    }
    if (worm_finded != null) {
      if (!worm_finded.showed) {
        worm_finded.showed = true;
        worm_finded
          .play('worm appearance')
          .on('animationcomplete', this.wormAppearance, worm_finded);
      } else {
        this.scene.gui.showWindow('worm');
      }
      worm_finded.setVisible(true);
      curr_worm = worm_finded;
    } else {
      this.scene.rover.setWorkNext();
    }
  }

  leaveWorm() {
    if (curr_worm != null) {
      curr_worm.play('worm leaving');
      curr_worm = null;
    }
  }

  deleteWorm() {
    if (curr_worm != null) {
      const tData = this.getArrayPos(curr_worm.tileX, curr_worm.tileY);
      if (tData === 3) {
        this.setArrayPos(curr_worm.tileX, curr_worm.tileY, 0);
      }
      curr_worm.play('worm leaving');
      curr_worm = null;
    }
  }
  wormAppearance() {
    // console.log(this)
    this.off('animationcomplete');
    this.play('worm idle');
    this.scene.gui.showWindow('worm');
  }

  drawGrid() {
    for (let i = 0; i < map_array.length; i++) {
      for (let j = 0; j < map_array[i].length; j++) {
        gr.strokeRect(
          j * this.scene.tileSize,
          i * this.scene.tileSize,
          this.scene.tileSize,
          this.scene.tileSize
        );
      }
    }
  }

  addFogs() {
    const roverPos = this.scene.rover.getTilePos();
    const arr_nofog = this.testFog(roverPos.tileX, roverPos.tileY);
    for (let i = 0; i < map_array.length; i++) {
      fogs.push([]);
      for (let j = 0; j < map_array[i].length; j++) {
        let newfog;
        let addfog = 1;
        if (exits_show[0].tileX === j && exits_show[0].tileY === i) {
          addfog = 0;
          for (let k = 0; k < obj_exits.length; k++) {
            const obj = obj_exits[k];
            if (obj != null) {
              if (
                obj.tileX === exits_show[0].tileX &&
                obj.tileY === exits_show[0].tileY
              ) {
                obj.setVisible(true);
              }
            }
          }
        }

        let ind_fog = -1;
        for (let k = 0; k < arr_nofog.length; k++) {
          const elem = arr_nofog[k];
          if (elem.tileX === j && elem.tileY === i) ind_fog = k;
        }
        if (ind_fog >= 0) addfog = arr_nofog[ind_fog].fog;

        if (addfog > 0) {
          newfog = this.scene.add
            .sprite(
              this.getTilePosX(j) + this.scene.tileSize / 2,
              this.getTilePosY(i) + this.scene.tileSize / 2,
              'objects',
              'fog'
            )
            .setAlpha(addfog)
            .setScale(0.99)
            .setDepth(0.2);
          this.scene.cam2.ignore(newfog);
          fogs[i].push(newfog);
        } else {
          this.showObj(j, i, 0);
          fogs[i].push(null);
        }
      }
    }
  }

  testFog(rx, ry, scan) {
    const arr = [{ tileX: rx, tileY: ry, fog: 0 }];
    let leftT = 1,
      leftD = 1,
      rightT = 1,
      rightD = 1;
    if (map_array[ry][rx - 1] != null) {
      arr.push({ tileX: rx - 1, tileY: ry, fog: 0 });
      if (map_array[ry][rx - 1] < 1) {
        leftT -= 0.5;
        leftD -= 0.5;
      }
    }
    if (map_array[ry][rx + 1] != null) {
      arr.push({ tileX: rx + 1, tileY: ry, fog: 0 });
      if (map_array[ry][rx + 1] < 1) {
        rightT -= 0.5;
        rightD -= 0.5;
      }
    }
    if (map_array[ry - 1][rx] != null) {
      arr.push({ tileX: rx, tileY: ry - 1, fog: 0 });
      if (map_array[ry - 1][rx] < 1) {
        leftT -= 0.5;
        rightT -= 0.5;
      }
    }
    if (map_array[ry + 1][rx] != null) {
      arr.push({ tileX: rx, tileY: ry + 1, fog: 0 });
      if (map_array[ry + 1][rx] < 1) {
        leftD -= 0.5;
        rightD -= 0.5;
      }
    }

    if (scan) {
      leftT = 0;
      leftD = 0;
      rightT = 0;
      rightD = 0;
    }

    if (map_array[ry - 1][rx - 1] != null) {
      arr.push({ tileX: rx - 1, tileY: ry - 1, fog: leftT });
    }
    if (map_array[ry + 1][rx + 1] != null) {
      arr.push({ tileX: rx + 1, tileY: ry + 1, fog: rightD });
    }
    if (map_array[ry - 1][rx + 1] != null) {
      arr.push({ tileX: rx + 1, tileY: ry - 1, fog: leftD });
    }
    if (map_array[ry + 1][rx - 1] != null) {
      arr.push({ tileX: rx - 1, tileY: ry + 1, fog: rightT });
    }

    if (scan) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (rx - i >= 0 && ry - j >= 0)
            if (map_array[ry - j][rx - i] != null) {
              arr.push({ tileX: rx - i, tileY: ry - j, fog: 0 });
            }
          if (ry - j >= 0)
            if (map_array[ry - j][rx + i] != null) {
              arr.push({ tileX: rx + i, tileY: ry - j, fog: 0 });
            }
          if (rx - i >= 0 && ry + j < map_array.length)
            if (map_array[ry + j][rx - i] != null) {
              arr.push({ tileX: rx - i, tileY: ry + j, fog: 0 });
            }

          if (ry + j < map_array.length)
            if (map_array[ry + j][rx + i] != null) {
              arr.push({ tileX: rx + i, tileY: ry + j, fog: 0 });
            }
        }
      }
      if (map_array[ry][rx - 2] != null) {
        arr.push({ tileX: rx - 2, tileY: ry, fog: leftT });
      }
      if (map_array[ry][rx - 3] != null) {
        arr.push({ tileX: rx - 3, tileY: ry, fog: leftT });
      }
      if (map_array[ry][rx + 2] != null) {
        arr.push({ tileX: rx + 2, tileY: ry, fog: rightD });
      }
      if (map_array[ry][rx + 3] != null) {
        arr.push({ tileX: rx + 3, tileY: ry, fog: rightD });
      }

      if (map_array[ry - 1][rx - 2] != null) {
        arr.push({ tileX: rx - 1, tileY: ry - 2, fog: leftT });
      }
      if (map_array[ry + 1][rx + 1] != null) {
        arr.push({ tileX: rx + 1, tileY: ry + 1, fog: rightD });
      }
      if (map_array[ry - 1][rx + 1] != null) {
        arr.push({ tileX: rx + 1, tileY: ry - 1, fog: leftD });
      }
      if (map_array[ry + 1][rx - 1] != null) {
        arr.push({ tileX: rx - 1, tileY: ry + 1, fog: rightT });
      }
    }

    return arr;
  }

  scanArr(rx, ry) {
    const arr = [{ tileX: rx, tileY: ry }];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (rx - i >= 0 && ry - j >= 0)
          if (map_array[ry - j][rx - i] != null) {
            arr.push({ tileX: rx - i, tileY: ry - j });
          }
        if (ry - j >= 0)
          if (map_array[ry - j][rx + i] != null) {
            arr.push({ tileX: rx + i, tileY: ry - j });
          }
        if (rx - i >= 0 && ry + j < map_array.length)
          if (map_array[ry + j][rx - i] != null) {
            arr.push({ tileX: rx - i, tileY: ry + j });
          }

        if (ry + j < map_array.length)
          if (map_array[ry + j][rx + i] != null) {
            arr.push({ tileX: rx + i, tileY: ry + j });
          }
      }
    }

    for (let i = 0; i < arr.length - 1; i++) {
      const e1 = arr[i];
      for (let j = i + 1; j < arr.length; j++) {
        const e2 = arr[j];
        if (e1.tileX === e2.tileX && e1.tileY === e2.tileY) {
          // console.log(e1.tileX +'  '+ e2.tileX +' and '+ e1.tileY +'  '+ e2.tileY)
          arr.splice(j, 1);
          j--;
        }
      }
    }

    return arr;
  }
  checkRes(data) {
    const { resourcesScanned, tiles } = data;

    this.drawAllNewTiles(tiles);

    return { count: resourcesScanned, tiles };
  }
  scanMap(roverPos, realX, realY, data) {
    this.deleteScan();
    const { count } = this.checkRes(data);
    let scanline = this.scene.add
      .sprite(
        realX - this.scene.tileSize * 3.5,
        realY - this.scene.tileSize,
        'nocompress',
        'scan_area'
      )
      .setScale(1, 1)
      .setDepth(0.22);
    let scanline2 = this.scene.add
      .sprite(
        realX + this.scene.tileSize * 3.5,
        realY - this.scene.tileSize,
        'nocompress',
        'scan_area'
      )
      .setScale(-1, 1)
      .setDepth(0.22);
    let scanline3 = this.scene.add
      .sprite(
        realX - this.scene.tileSize * 3.5,
        realY + this.scene.tileSize,
        'nocompress',
        'scan_area'
      )
      .setScale(1, -1)
      .setDepth(0.22);
    let scanline4 = this.scene.add
      .sprite(
        realX + this.scene.tileSize * 3.5,
        realY + this.scene.tileSize,
        'nocompress',
        'scan_area'
      )
      .setScale(-1, -1)
      .setDepth(0.22);

    this.scene.gui.scan_find
      .setVisible(true)
      .setText(
        'THERE ARE ' +
          count +
          ` ${count === 1 ? 'RESOURCE' : 'RESOURCES'}\nIN THE HIGHLIGHTED AREA`
      );

    this.scan_arr.push(scanline, scanline2, scanline3, scanline4);
    this.scene.cam2.ignore([scanline, scanline2, scanline3, scanline4]);

    if (this.scanTime != null) this.scanTime.destroy();
    this.scanTime = this.scene.time.addEvent({
      delay: 30000,
      callback: this.endScanTime,
      callbackScope: this,
      loop: true
    });
  }

  deleteScan() {
    for (let i = 0; i < this.scan_arr.length; i++) {
      if (this.scan_arr[i] != null) this.scan_arr[i].destroy();
    }
    this.scan_arr = [];
  }

  endScanTime() {
    this.scene.gui.scan_find.setVisible(false);
    this.deleteScan();
  }

  delFogs(roverPos, delayTw = 0, scan = false) {
    const arr_nofog = this.testFog(roverPos.tileX, roverPos.tileY, scan);
    const fortween = [];
    if (fogs.length > 0) {
      for (let i = 0; i < fogs.length; i++) {
        for (let j = 0; j < fogs[i].length; j++) {
          if (i >= 0 && j >= 0) {
            let ind_fog = -1;
            let addfog = 1;
            for (let k = 0; k < arr_nofog.length; k++) {
              const elem = arr_nofog[k];
              if (elem.tileX === j && elem.tileY === i) {
                ind_fog = k;
                break;
              }
            }
            if (ind_fog >= 0) addfog = arr_nofog[ind_fog].fog;

            if (addfog < 1) {
              if (fogs[i][j] != null) {
                this.showObj(j, i, delayTw);
                fortween.push(fogs[i][j]);
                fogs[i][j] = null;
              }
            }
          }
        }
      }
    }
    this.scene.tweens.add({
      targets: fortween,
      alpha: 0,
      duration: 1000,
      ease: 'Quad.Out',
      delay: delayTw,
      onComplete: (tw, trgts) => trgts.forEach((elem) => elem.destroy())
    });
  }

  showObj(tx, ty, delayTw = 0) {
    const fortween = [];
    if (obj_res.length) {
      for (let i = 0; i < obj_res.length; i++) {
        const res = obj_res[i];
        if (res.tileX === tx && res.tileY === ty) {
          if (res != null) {
            if (res.visible === false) {
              res.setAlpha(0).setVisible(true);
              fortween.push(res);
            }
          }
        }
      }
    }
    for (let i = 0; i < obj_exits.length; i++) {
      const res = obj_exits[i];
      if (res.tileX === tx && res.tileY === ty) {
        if (res != null) {
          if (res.visible === false) {
            res.setAlpha(0).setVisible(true);
            fortween.push(res);
          }
        }
      }
    }
    this.scene.tweens.add({
      targets: fortween,
      alpha: 1,
      duration: 1000,
      ease: 'Quad.Out',
      delay: delayTw
    });
  }

  deleteAll() {
    this.tileMap.destroy();
    gr.destroy();

    obj_exits.forEach((elem) => {
      if (elem != null) elem.destroy();
    });
    obj_res.forEach((elem) => {
      if (elem != null) elem.destroy();
    });
    fogs.forEach((elem) => {
      if (elem != null)
        elem.forEach((elem2) => {
          if (elem2 != null) elem2.destroy();
        });
    });
  }

  resetMap() {
    // Important notes:
    // -1 -- blocked tile
    // 0 -- common tile with available scanner
    // 6 -- gates
    // 8 -- obstacles
    map_array = [
      [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1
      ],
      [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1
      ],
      [0, 0, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
      [-1, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [-1, -1, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, -1, -1],
      [
        -1, -1, -1, -1, -1, 0, 0, 0, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0, 0, -1, -1
      ],
      [-1, -1, 0, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, -1, -1, 0, 0, -1, -1, -1, -1],
      [-1, -1, 0, 0, 0, -1, 0, -1, -1, -1, 0, 0, -1, -1, 0, 0, 0, 0, 0, -1, -1],
      [-1, -1, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 8, 0, -1, 0, 0, 0, -1, -1],
      [
        -1, -1, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, -1, -1, -1, 0, 0, 0, -1, -1, -1
      ],
      [
        -1, -1, -1, -1, -1, 0, 0, -1, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, -1, -1
      ],
      [
        -1, -1, -1, -1, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, -1, 0, -1, -1,
        -1
      ],
      [0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 8, 0, 0, -1, -1, 0, 0, 0, -1, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0],
      [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1
      ]
    ];
  }

  createAnim(scene) {
    scene.anims.create({
      key: 'exit anim',
      frames: scene.anims.generateFrameNames('objects', {
        prefix: 'exit sign/',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      frameRate: 24,
      repeat: -1
    });
    scene.anims.create({
      key: 'worm appearance',
      frames: scene.anims.generateFrameNames('worm', {
        prefix: 'appearance/worm_ani_',
        start: 0,
        end: 89,
        zeroPad: 3
      }),
      frameRate: 35
    });
    scene.anims.create({
      key: 'worm idle',
      frames: scene.anims.generateFrameNames('worm', {
        prefix: 'idle/worm_idle_',
        start: 0,
        end: 28,
        zeroPad: 2
      }),
      frameRate: 29,
      repeat: -1
    });
    scene.anims.create({
      key: 'worm leaving',
      frames: scene.anims.generateFrameNames('worm', {
        prefix: 'leaving/worm_ani_',
        start: 127,
        end: 157,
        zeroPad: 3
      }),
      frameRate: 30
    });
  }

  drawAllNewTiles(tilesArr) {
    return tilesArr.forEach(({ x, y, state }) => {
      let rnd, res;
      if (map_array[y + Y_POS_DIFF][x] === state) return;
      this.setArrayPos(x, y + Y_POS_DIFF, state);
      switch (state) {
        case MINING_MAP_OBJECT.common_resource:
          rnd = Phaser.Math.Between(1, 5);
          res = this.scene.add
            .sprite(
              this.getTilePosX(x),
              this.getTilePosY(y + Y_POS_DIFF),
              'objects',
              'deposits/small 0' + rnd
            )
            .setVisible(true);
          res.name = x + y;
          res.tileX = x;
          res.tileY = y + Y_POS_DIFF;
          this.scene.cam2.ignore(res);
          obj_res.push(res);
          res_for_worms.push(res);
          break;
        case MINING_MAP_OBJECT.rare_resource:
          rnd = Phaser.Math.Between(1, 5);
          res = this.scene.add
            .sprite(
              this.getTilePosX(x),
              this.getTilePosY(y + Y_POS_DIFF),
              'objects',
              'deposits/big 0' + rnd
            )
            .setVisible(true);
          res.name = x + y;
          res.tileX = x;
          res.tileY = y + 2;
          this.scene.cam2.ignore(res);
          obj_res.push(res);
          res_for_worms.push(res);
          break;
        case MINING_MAP_OBJECT.legendary_resource:
          rnd = Phaser.Math.Between(1, 5);
          res = this.scene.add
            .sprite(
              this.getTilePosX(x),
              this.getTilePosY(y + Y_POS_DIFF),
              'objects',
              'deposits/huge 0' + rnd
            )
            .setVisible(true);
          res.name = x + y;
          res.tileX = x;
          res.tileY = y + Y_POS_DIFF;
          this.scene.cam2.ignore(res);
          obj_res.push(res);
          res_for_worms.push(res);
          break;
        case MINING_MAP_OBJECT.worm:
          this.wormCreate(x, y + Y_POS_DIFF);
          break;
        case MINING_MAP_OBJECT.obstacle:
          let dbrs, dbrs2;

          switch (y) {
            case 1:
              dbrs = this.scene.add
                .sprite(
                  this.getTilePosX(x),
                  this.getTilePosY(y + Y_POS_DIFF),
                  'objects',
                  'debris/debris tile 71'
                )
                .setVisible(true);
              dbrs2 = this.scene.add
                .sprite(
                  this.getTilePosX(x),
                  this.getTilePosY(y + 3),
                  'objects',
                  'debris/debris tile 92'
                )
                .setVisible(true);
              obj_res.push(dbrs2);
              dbrs2.name = 'debris';
              dbrs2.tileX = x;
              dbrs2.tileY = y + Y_POS_DIFF;
              break;
            case 6:
              dbrs = this.scene.add
                .sprite(
                  this.getTilePosX(x),
                  this.getTilePosY(y + Y_POS_DIFF),
                  'objects',
                  'debris/debris tile 181'
                )
                .setVisible(true);
              break;
            case 10:
              dbrs = this.scene.add
                .sprite(
                  this.getTilePosX(x),
                  this.getTilePosY(y + Y_POS_DIFF),
                  'objects',
                  'debris/debris tile 262'
                )
                .setVisible(true);
              break;
            default:
              break;
          }

          dbrs.name = 'debris';
          dbrs.tileX = x;
          dbrs.tileY = y + Y_POS_DIFF;
          this.scene.cam2.ignore(dbrs);
          if (dbrs2 != null) this.scene.cam2.ignore(dbrs2);
          obj_res.push(dbrs);
          break;
        case MINING_MAP_OBJECT.fuel:
          res = this.scene.add
            .sprite(
              this.getTilePosX(x),
              this.getTilePosY(y + Y_POS_DIFF),
              'objects',
              'deposits/fuel'
            )
            .setVisible(true);
          res.name = 'fuel res';
          res.tileX = x;
          res.tileY = y + 2;
          this.scene.cam2.ignore(res);
          obj_res.push(res);
          break;
        case MINING_MAP_OBJECT.gate:
          const ext = this.scene.add
            .sprite(
              this.getTilePosX(x),
              this.getTilePosY(y + Y_POS_DIFF) + 10,
              'objects',
              'exit sign/0005'
            )
            .setVisible(true)
            .play('exit anim');
          ext.name = 'exit';
          ext.tileX = x;
          ext.tileY = y + Y_POS_DIFF;
          this.scene.cam2.ignore(ext);
          obj_exits.push(ext);
          break;
        default:
          break;
      }
      if (res) {
        obj_res.push(res);
        res_for_worms.push(res);
      }
    });
  }
}

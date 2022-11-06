import MiningQuestApi from '@api/miningQuestApi';
import {
  AVAILABLE_TILES_IDX,
  TRANSPORT_DIRECTIONS
} from '@features/play/constants';
import { MINING_MAP_OBJECT } from '@features/play/types';
import { store } from '@redux/store';
import { setMiningGameRewards } from '@slices/questSlice';
import Phaser from 'phaser';

let current_anim = 'idle left';
let move = '';
let tileX = 0;
let tileY = 0;
let lastTX = 2;
let lastTY = 2;
let work = false;
let touch_array = [];
let freetapCount = 0;
let action_in_progress = false;

export default class Rover extends Phaser.GameObjects.Sprite {
  constructor(scene, tx, ty, side) {
    super(scene, 0, 0, 'rover');
    console.log(scene);
    const miningInfo = store.getState().quests.miningGameInfo;
    const { dynamites, scans, resources, moves } = miningInfo;

    touch_array = [];
    current_anim = 'idle ' + side;
    tileX = tx;
    tileY = ty;
    this.rover = this;
    this.dynamite = dynamites;
    this.scan = scans;
    this.collected_common = resources.common;
    this.collected_rare = resources.rare;
    this.collected_legendary = resources.legendary;
    this.ct_moves = moves;
    this.setDepth(1);

    scene.add.existing(this);

    this.createAnim(scene);

    this.setScale(0.8)
      .play(current_anim)
      .setPosition(this.getPosX(), this.getPosY());

    scene.cam2.ignore(this);
    scene.cameras.main.startFollow(this, true, 0.08, 0.08);

    for (let i = 0; i < 5; i++) {
      const newGreen = scene.add
        .sprite(this.x, this.y, 'objects', 'green')
        .setAlpha(0.5)
        .setVisible(false)
        .setDepth(0.18)
        .setInteractive();

      if (i === 0) newGreen.setAlpha(0.01);
      newGreen.rover = this;
      newGreen.scene = this.scene;
      newGreen.id = i;

      switch (i) {
        case 0:
          newGreen.name = 'self';
          break;
        case 1:
          newGreen.name = 'left';
          break;
        case 2:
          newGreen.name = 'right';
          break;
        case 3:
          newGreen.name = 'up';
          break;
        case 4:
          newGreen.name = 'down';
          break;
        default:
          break;
      }

      newGreen.on('pointerdown', this.tapDown, newGreen);
      touch_array.push(newGreen);
    }

    scene.cam2.ignore(touch_array);

    scene.input.keyboard.on('keydown', this.keyDown, this);
    scene.input.on('pointerdown', this.freeTap, this);

    this.drawOpenTile();
  }

  freeTap() {
    if (!work && !this.scene.isWindowShow()) {
      freetapCount++;
      if (freetapCount > 1) this.speedUp();
    }
  }

  tapDown() {
    if (work && !this.scene.isWindowShow()) {
      move = this.name;
      this.rover.moveAction(move);
    } else if (!work && !this.scene.isWindowShow()) {
      this.speedUp?.();
    }
  }

  moveAction(mv = 'self') {
    if (work) {
      move = mv;
      let tData = 0;

      switch (move) {
        case 'right':
          tData = this.scene.map.getArrayPos(tileX + 1, tileY);
          if (AVAILABLE_TILES_IDX.includes(tData))
            this.moveRight().then(() => {});
          else if (tData === MINING_MAP_OBJECT.obstacle) this.startDynamite();
          break;
        case 'left':
          tData = this.scene.map.getArrayPos(tileX - 1, tileY);
          if (AVAILABLE_TILES_IDX.includes(tData))
            this.moveLeft().then(() => {});
          else if (tData === MINING_MAP_OBJECT.obstacle) this.startDynamite();
          break;
        case 'up':
          tData = this.scene.map.getArrayPos(tileX, tileY - 1);
          if (AVAILABLE_TILES_IDX.includes(tData)) this.moveUp().then(() => {});
          else if (tData === MINING_MAP_OBJECT.obstacle) this.startDynamite();
          break;
        case 'down':
          tData = this.scene.map.getArrayPos(tileX, tileY + 1);
          if (AVAILABLE_TILES_IDX.includes(tData))
            this.moveDown().then(() => {});
          else if (tData === MINING_MAP_OBJECT.obstacle) this.startDynamite();
          break;
        case 'self':
          if (
            [
              MINING_MAP_OBJECT.common_resource,
              MINING_MAP_OBJECT.rare_resource,
              MINING_MAP_OBJECT.legendary_resource
            ].indexOf(this.scene.map.getArrayPos(tileX, tileY)) >= 0
          )
            this.rotateMining().then(() => {});
          else if (
            this.scene.map.getArrayPos(tileX, tileY) === MINING_MAP_OBJECT.gate
          )
            this.toExit();
          else if (
            this.scene.map.getArrayPos(tileX, tileY) === MINING_MAP_OBJECT.fuel
          )
            this.collectFuel().then(() => {});
          break;
        default:
          break;
      }
    }
  }

  keyDown(e) {
    if (work && !this.scene.isWindowShow()) {
      const tData = this.scene.map.getArrayPos(tileX, tileY);
      move = '';
      if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        if (
          AVAILABLE_TILES_IDX.includes(
            this.scene.map.getArrayPos(tileX + 1, tileY)
          )
        )
          this.moveRight().then(() => {});
      } else if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        if (
          AVAILABLE_TILES_IDX.includes(
            this.scene.map.getArrayPos(tileX - 1, tileY)
          )
        )
          this.moveLeft().then(() => {});
      } else if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        if (
          AVAILABLE_TILES_IDX.includes(
            this.scene.map.getArrayPos(tileX, tileY - 1)
          )
        )
          this.moveUp().then(() => {});
      } else if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        if (
          AVAILABLE_TILES_IDX.includes(
            this.scene.map.getArrayPos(tileX, tileY + 1)
          )
        )
          this.moveDown().then(() => {});
      } else if (e.code === 'KeyR') {
        if (tData === MINING_MAP_OBJECT.fuel) {
          this.collectFuel().then(() => {});
        } else if (this.checkCollapse()) {
          this.startDynamite();
        }
      } else if (e.code === 'KeyE') {
        if (this.scene.map.getArrayPos(tileX, tileY) === MINING_MAP_OBJECT.gate)
          this.toExit();
        else if (
          [
            MINING_MAP_OBJECT.common_resource,
            MINING_MAP_OBJECT.rare_resource,
            MINING_MAP_OBJECT.legendary_resource
          ].includes(this.scene.map.getArrayPos(tileX, tileY))
        )
          this.rotateMining().then(() => {});
      } else if (e.code === 'KeyF') {
        this.startScan().then(() => {});
      } else if (e.code === 'Escape') {
        this.scene.gui.showWindow('exit');
      }
    } else if (!work && !this.scene.isWindowShow()) {
      this.speedUp();
    }
  }

  startScan = async () => {
    if (work) {
      try {
        if (this.ct_moves >= 5) {
          await MiningQuestApi.scan({
            address: window.address,
            successCallback: (data) => {
              this.ct_moves = data.moves;
              this.scene.gui.updateHeaderDynamic(data);
              this.scene.map.scanMap(this.getTilePos(), this.x, this.y, data);
            },
            failCallback: () => {}
          });
        }
      } catch (err) {}
    }
  };

  checkActions() {
    const tData = this.scene.map.getArrayPos(tileX, tileY);
    let act = 'scan';
    if (tData === MINING_MAP_OBJECT.gate) {
      act = 'exit';
    } else if (tData === MINING_MAP_OBJECT.fuel) {
      act = 'fuel';
    } else if (tData === MINING_MAP_OBJECT.common_resource) {
      act = 'common';
    } else if (tData === MINING_MAP_OBJECT.rare_resource) {
      act = 'rare';
    } else if (tData === MINING_MAP_OBJECT.legendary_resource) {
      act = 'legendary';
    } else {
      if (this.checkCollapse()) act = 'dynamite';
    }
    if (act === 'scan' && this.scan < 0) act = 'empty';

    if (this.scene.gui != null && act !== '') this.scene.gui.showModal(act);
  }

  checkCollapse() {
    const scene = this.scene;
    return (
      scene.map.getArrayPos(tileX + 1, tileY) === MINING_MAP_OBJECT.obstacle ||
      scene.map.getArrayPos(tileX - 1, tileY) === MINING_MAP_OBJECT.obstacle ||
      scene.map.getArrayPos(tileX, tileY + 1) === MINING_MAP_OBJECT.obstacle ||
      scene.map.getArrayPos(tileX, tileY - 1) === MINING_MAP_OBJECT.obstacle
    );
  }

  checkWorm() {
    const scene = this.scene;
    return (
      scene.map.getArrayPos(tileX + 1, tileY) === MINING_MAP_OBJECT.worm ||
      scene.map.getArrayPos(tileX - 1, tileY) === MINING_MAP_OBJECT.worm ||
      scene.map.getArrayPos(tileX, tileY + 1) === MINING_MAP_OBJECT.worm ||
      scene.map.getArrayPos(tileX, tileY - 1) === MINING_MAP_OBJECT.worm
    );
  }

  toExit = async () => {
    if (this.ct_moves > 0) {
      move = 'exit';
      work = false;
      await MiningQuestApi.exit({
        address: window.address,
        successCallback: (resp) => {
          const { data, message, signature } = resp;

          const [xp, clny] = data;

          store.dispatch(
            setMiningGameRewards({ clny, xp, message, signature })
          );

          this.hideTouch();
          this.scene.gui.hideAll();
          this.setVisible(false);
          this.scene.input.keyboard.off('keydown');
          this.scene.gui.showEnd();
        },
        failCallback: () => {}
      });
    }
  };

  startDynamite() {
    if (this.dynamite > 0 && !action_in_progress) {
      move = 'dynamite';
      work = false;
      action_in_progress = true;

      MiningQuestApi.dynamite({
        address: window.address,
        successCallback: () => {
          action_in_progress = false;
          this.hideTouch();
          this.dynamite--;
          this.scene.gui.updateHeader();
          const find_debris = this.scene.map.getDebris(tileX, tileY);

          for (let i = 0; i < find_debris.length; i++)
            this.scene.map.setArrayPos(
              find_debris[i].tileX,
              find_debris[i].tileY,
              0
            );

          if (find_debris.length > 0) {
            this.scene.tweens.add({
              targets: find_debris,
              alpha: 0,
              duration: 300,
              ease: 'Linear',
              delay: 0
            });
          }

          this.scene.time.delayedCall(
            700,
            (rover) => {
              rover.drawOpenTile();
            },
            [this, work]
          );
        },
        failCallback: () => {
          action_in_progress = false;
        }
      }).then(() => {});
    }
  }

  collectFuel = async () => {
    let need_moves = 1;
    this.mine_now = 'fuel';
    if (this.ct_moves >= need_moves && !action_in_progress) {
      action_in_progress = true;
      await MiningQuestApi.fuel({
        address: window.address,
        failCallback: () => {
          action_in_progress = false;
        },
        successCallback: (data) => {
          this.scene.gui.updateHeaderDynamic(data);
          this.hideTouch();
          this.scene.map.setArrayPos(tileX, tileY, 0);
          const find_res = this.scene.map.getObjPos(tileX, tileY);
          if (find_res != null)
            this.scene.tweens.add({
              targets: find_res,
              alpha: 0,
              duration: 1000,
              ease: 'Quad.InOut',
              delay: 0
            });

          this.drawOpenTile();
          action_in_progress = false;
        }
      });
    }
  };
  rotateMining = async () => {
    let need_moves = 1;
    const res_mining = this.scene.map.getArrayPos(tileX, tileY);
    if (!action_in_progress) {
      try {
        action_in_progress = true;
        await MiningQuestApi.mine({
          address: window.address,
          failCallback: (err) => {
            if (err.message === 'No recourse on this tile') {
              return;
            }
            this.scene.gui.showWindow('game over fuel');
            action_in_progress = false;
          },
          successCallback: () => {
            switch (res_mining) {
              case MINING_MAP_OBJECT.common_resource:
                this.mine_now = 'common';
                need_moves = 6;
                break;
              case MINING_MAP_OBJECT.rare_resource:
                this.mine_now = 'rare';
                need_moves = 10;
                break;
              case MINING_MAP_OBJECT.legendary_resource:
                this.mine_now = 'legendary';
                need_moves = 15;
                break;
              default:
                break;
            }

            if (this.ct_moves >= need_moves) {
              this.ct_moves -= need_moves;
              this.scene.gui.updateHeader();
              work = false;
              move = 'mining';
              this.hideTouch();
              switch (current_anim) {
                case 'idle left':
                  this.play('rotation left-mining');
                  this.startMining(250, 'idle left');
                  break;
                case 'idle right':
                  this.play('rotation right-down');
                  this.playAfterDelay('rotation down-mining', 500);
                  this.startMining(750, 'idle down');
                  break;
                case 'idle up':
                  this.play('rotation up-left');
                  this.playAfterDelay('rotation left-mining', 500);
                  this.startMining(750, 'idle left');
                  break;
                case 'idle down':
                  this.play('rotation down-mining');
                  this.startMining(250, 'idle down');
                  break;
                default:
                  break;
              }
            }

            action_in_progress = false;
          }
        });
      } catch (err) {}
    }
  };

  isWork() {
    return work;
  }

  startMining(delayTw = 0, anim = 'idle left') {
    current_anim = anim;

    this.scene.map.setArrayPos(tileX, tileY, 0);

    this.scene.time.delayedCall(
      delayTw,
      (rover) => {
        rover.play('mining');
        rover.endMining(3050);
      },
      [this]
    );
  }

  endMining(delayTw = 0) {
    const find_res = this.scene.map.getObjPos(tileX, tileY);
    if (find_res != null)
      this.scene.tweens.add({
        targets: find_res,
        alpha: 0,
        duration: 3000,
        ease: 'Quad.InOut',
        delay: 250
      });

    this.scene.time.delayedCall(
      delayTw,
      (rover) => {
        if (current_anim === 'idle left')
          rover.playReverse('rotation left-mining');
        else rover.playReverse('rotation down-mining');
        work = true;
        this.drawOpenTile();
        switch (rover.mine_now) {
          case 'common':
            rover.collected_common++;
            break;
          case 'rare':
            rover.collected_rare++;
            break;
          case 'legendary':
            rover.collected_legendary++;
            break;
          default:
            break;
        }
        rover.scene.gui.updateHeader();
      },
      [this, move, current_anim]
    );
  }

  startMove(newTiles, additionalData, delayTw = 0) {
    // console.log(
    //   this.collected_common,
    //   this.collected_rare,
    //   this.collected_legendary
    // );
    const { worm, moves } = additionalData;
    if (this.ct_moves > 0) {
      this.ct_moves = moves;
      this.scene.gui.updateHeaderDynamic({ moves });
      this.hideTouch();
      this.scene.tweens.add({
        targets: this,
        x: this.getPosX(),
        y: this.getPosY(),
        duration: 1000,
        ease: 'Linear',
        delay: delayTw,
        onComplete: (tw, trgts, params) => {
          params.moveEnd(worm);
        },
        onCompleteParams: [this],
        onStart: (tw, trgts, params, move) => {
          if (
            move === 'right' ||
            move === 'left' ||
            move === 'down' ||
            move === 'up'
          )
            params.play('ride ' + move);
        },
        onStartParams: [this, move]
      });
      this.scene.map.delFogs(this.getTilePos(), delayTw);
    }

    this.scene.map.drawAllNewTiles(newTiles);
  }

  hideTouch() {
    touch_array.forEach((elem) => elem.setVisible(false));
  }

  moveLast() {
    tileX = lastTX;
    tileY = lastTY;

    this.x = this.getPosX();
    this.y = this.getPosY();
  }

  moveRight = async () => {
    work = false;
    lastTX = tileX;
    lastTY = tileY;

    move = 'right';
    tileX++;

    let isSuccessfulMove = true;

    try {
      const newData = await MiningQuestApi.move({
        address: window.address,
        direction: TRANSPORT_DIRECTIONS.right,
        failCallback: () => (isSuccessfulMove = false)
      });

      if (!isSuccessfulMove) return;

      const { tiles, worm, moves } = newData;

      switch (current_anim) {
        case 'idle right':
          this.startMove(tiles, { worm, moves });
          break;
        case 'idle left':
          this.play('rotation left-up');
          this.playAfterDelay('rotation up-right', 500);
          this.startMove(tiles, { worm, moves }, 1000);
          break;
        case 'idle up':
          this.play('rotation up-right');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle down':
          this.play('rotation down-right');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        default:
          break;
      }
    } catch (err) {}
  };

  moveLeft = async () => {
    work = false;
    lastTX = tileX;
    lastTY = tileY;

    move = 'left';
    tileX--;

    let isSuccessfulMove = true;

    try {
      const newData = await MiningQuestApi.move({
        address: window.address,
        direction: TRANSPORT_DIRECTIONS.left,
        failCallback: () => (isSuccessfulMove = false)
      });

      if (!isSuccessfulMove) return;

      const { tiles, worm, moves } = newData;

      switch (current_anim) {
        case 'idle left':
          this.startMove(tiles, { worm, moves });
          break;
        case 'idle right':
          this.play('rotation right-up');
          this.playAfterDelay('rotation up-left', 500);
          this.startMove(tiles, { worm, moves }, 1000);
          break;
        case 'idle up':
          this.play('rotation up-left');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle down':
          this.play('rotation down-left');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        default:
          break;
      }
    } catch (err) {}
  };

  moveUp = async () => {
    work = false;
    lastTX = tileX;
    lastTY = tileY;

    move = 'up';
    tileY--;

    let isSuccessfulMove = true;

    try {
      const newData = await MiningQuestApi.move({
        address: window.address,
        direction: TRANSPORT_DIRECTIONS.up,
        failCallback: () => (isSuccessfulMove = false)
      });

      if (!isSuccessfulMove) return;

      const { tiles, worm, moves } = newData;

      switch (current_anim) {
        case 'idle up':
          this.startMove(tiles, { worm, moves });
          break;
        case 'idle right':
          this.play('rotation right-up');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle left':
          this.play('rotation left-up');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle down':
          this.play('rotation down-left');
          this.playAfterDelay('rotation left-up', 500);
          this.startMove(tiles, { worm, moves }, 1000);
          break;
        default:
          break;
      }
    } catch (err) {}
  };

  moveDown = async () => {
    work = false;
    lastTX = tileX;
    lastTY = tileY;

    move = 'down';
    tileY++;

    let isSuccessfulMove = true;

    try {
      const newData = await MiningQuestApi.move({
        address: window.address,
        direction: TRANSPORT_DIRECTIONS.down,
        failCallback: () => (isSuccessfulMove = false)
      });

      if (!isSuccessfulMove) return;

      const { tiles, worm, moves } = newData;

      switch (current_anim) {
        case 'idle down':
          this.startMove(tiles, { worm, moves });
          break;
        case 'idle right':
          this.play('rotation right-down');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle left':
          this.play('rotation left-down');
          this.startMove(tiles, { worm, moves }, 500);
          break;
        case 'idle up':
          this.play('rotation up-right');
          this.playAfterDelay('rotation right-down', 500);
          this.startMove(tiles, { worm, moves }, 1000);
          break;
        default:
          break;
      }
    } catch (err) {}
  };

  moveEnd() {
    if (move === 'right' || move === 'left' || move === 'down' || move === 'up')
      current_anim = 'idle ' + move;
    this.play(current_anim);
    if (this.checkWorm()) {
      this.scene.map.showWorm(tileX, tileY);
    } else {
      this.setWorkNext();
    }
  }

  speedUp() {
    this.scene.tweens.timeScale = 2;
    this.scene.time.timeScale = 2;
    this.scene.anims.globalTimeScale = 2;
  }

  speedOrigin() {
    this.scene.tweens.timeScale = 1;
    this.scene.time.timeScale = 1;
    this.scene.anims.globalTimeScale = 1;
  }

  setWorkNext() {
    freetapCount = 0;
    this.speedOrigin();
    work = true;
    this.drawOpenTile();
  }

  getPosX() {
    return this.scene.map.getTilePosX(tileX) + this.scene.tileSize / 2;
  }

  getPosY() {
    return this.scene.map.getTilePosY(tileY) + this.scene.tileSize / 2;
  }

  getTilePos() {
    return { tileX, tileY };
  }

  drawOpenTile() {
    if (this.ct_moves > 0 && this.scene.time_left > 0) {
      work = true;
      touch_array.forEach((elem) => {
        const rover = elem.rover;
        if (elem.id > 0) elem.setVisible(false).setAlpha(0.5);
        else elem.setVisible(true);
        switch (elem.id) {
          case 0:
            elem.setPosition(rover.x, rover.y);
            break;
          case 1:
            elem.setPosition(rover.x - rover.scene.tileSize, rover.y);
            break;
          case 2:
            elem.setPosition(rover.x + rover.scene.tileSize, rover.y);
            break;
          case 3:
            elem.setPosition(rover.x, rover.y - rover.scene.tileSize);
            break;
          case 4:
            elem.setPosition(rover.x, rover.y + rover.scene.tileSize);
            break;
          default:
            break;
        }
      });

      if (
        AVAILABLE_TILES_IDX.includes(
          this.scene.map.getArrayPos(tileX - 1, tileY)
        )
      )
        touch_array[1].setVisible(true);
      if (
        AVAILABLE_TILES_IDX.includes(
          this.scene.map.getArrayPos(tileX + 1, tileY)
        )
      )
        touch_array[2].setVisible(true);
      if (
        AVAILABLE_TILES_IDX.includes(
          this.scene.map.getArrayPos(tileX, tileY - 1)
        )
      )
        touch_array[3].setVisible(true);
      if (
        AVAILABLE_TILES_IDX.includes(
          this.scene.map.getArrayPos(tileX, tileY + 1)
        )
      )
        touch_array[4].setVisible(true);

      if (
        parseInt(this.scene.map.getArrayPos(tileX - 1, tileY)) ===
        MINING_MAP_OBJECT.obstacle
      ) {
        console.log('obstacle');
        touch_array[1].setVisible(true).setAlpha(0.01);
      }
      if (
        parseInt(this.scene.map.getArrayPos(tileX + 1, tileY)) ===
        MINING_MAP_OBJECT.obstacle
      ) {
        touch_array[2].setVisible(true).setAlpha(0.01);
      }
      if (
        parseInt(this.scene.map.getArrayPos(tileX, tileY - 1)) ===
        MINING_MAP_OBJECT.obstacle
      ) {
        touch_array[3].setVisible(true).setAlpha(0.01);
      }
      if (
        parseInt(this.scene.map.getArrayPos(tileX, tileY + 1)) ===
        MINING_MAP_OBJECT.obstacle
      ) {
        touch_array[4].setVisible(true).setAlpha(0.01);
      }

      this.checkActions();
    } else {
      if (this.ct_moves <= 0) this.scene.gui.showWindow('game over fuel');
      else if (this.scene.time_left <= 0)
        this.scene.gui.showWindow('game over time');
    }
  }

  deleteAll() {
    for (let i = 0; i < touch_array.length; i++) {
      if (touch_array[i] != null) touch_array[i].destroy();
    }
    this.destroy();
  }

  createAnim(scene) {
    scene.anims.create({
      key: 'idle right',
      frames: [{ key: 'rover', frame: 'ride right/0117' }],
      frameRate: 1
    });
    scene.anims.create({
      key: 'idle left',
      frames: [{ key: 'rover', frame: 'ride left/0039' }],
      frameRate: 1
    });
    scene.anims.create({
      key: 'idle down',
      frames: [{ key: 'rover', frame: 'ride down/0001' }],
      frameRate: 1
    });
    scene.anims.create({
      key: 'idle up',
      frames: [{ key: 'rover', frame: 'ride up/0078' }],
      frameRate: 1
    });
    scene.anims.create({
      key: 'ride right',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'ride right/',
        start: 117,
        end: 140,
        zeroPad: 4
      }),
      frameRate: 24,
      repeat: -1
    });
    scene.anims.create({
      key: 'ride left',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'ride left/',
        start: 39,
        end: 62,
        zeroPad: 4
      }),
      frameRate: 24,
      repeat: -1
    });
    scene.anims.create({
      key: 'ride down',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'ride down/',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      frameRate: 24,
      repeat: -1
    });
    scene.anims.create({
      key: 'ride up',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'ride up/',
        start: 78,
        end: 101,
        zeroPad: 4
      }),
      frameRate: 24,
      repeat: -1
    });
    //Rotate Animation
    scene.anims.create({
      key: 'rotation up-right',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation up-right/',
        start: 102,
        end: 116,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation right-up',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation up-right/',
        start: 116,
        end: 102,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation right-down',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation right-down/',
        start: 141,
        end: 155,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation down-right',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation right-down/',
        start: 155,
        end: 141,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation down-left',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation down-left/',
        start: 25,
        end: 38,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation left-down',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation down-left/',
        start: 38,
        end: 25,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation left-up',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation left-up/',
        start: 63,
        end: 77,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation up-left',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation left-up/',
        start: 77,
        end: 63,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation left-mining',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation down-left/',
        start: 38,
        end: 32,
        zeroPad: 4
      }),
      frameRate: 28
    });
    scene.anims.create({
      key: 'rotation down-mining',
      frames: scene.anims.generateFrameNames('rover', {
        prefix: 'rotation down-left/',
        start: 25,
        end: 32,
        zeroPad: 4
      }),
      frameRate: 28
    });

    const mining_frames = [
      scene.anims.generateFrameNames('rover', {
        prefix: 'start mining/',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      scene.anims.generateFrameNames('rover', {
        prefix: 'mining/',
        start: 25,
        end: 48,
        zeroPad: 4
      }),
      scene.anims.generateFrameNames('rover', {
        prefix: 'mining/',
        start: 25,
        end: 48,
        zeroPad: 4
      }),
      scene.anims.generateFrameNames('rover', {
        prefix: 'mining/',
        start: 25,
        end: 48,
        zeroPad: 4
      }),
      scene.anims.generateFrameNames('rover', {
        prefix: 'stop mining/',
        start: 49,
        end: 63,
        zeroPad: 4
      })
    ];
    scene.anims.create({
      key: 'mining',
      frames: mining_frames.flat(),
      frameRate: 24,
      repeat: 0
    });
  }
}

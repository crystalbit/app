import MiningQuestApi from '@api/miningQuestApi';
import { MAX_DYNAMITES_LIMIT, MAX_MOVES_LIMIT } from '@features/play/constants';
import { trackUserEvent } from '@global/utils/analytics';
import { extractURLParam } from '@global/utils/urlParams';
import { store } from '@redux/store';
import { toggleMiningPrepareScreenState } from '@slices/questSlice';
import Phaser from 'phaser';

const moves_name = 'Moves:';
const times_name = 'Time:';
const dynamite_name = 'Dynamite:';
const res_name = 'Resources:';
let curr_window = '';

export default class GUI extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);

    this.setScrollFactor(0).setDepth(0.5);

    this.createAnim(scene);

    this.pay_worm_count = 0;
    this.zoomNow = true;
    this.windowShowNow = false;
    this.wnd_array = [];

    this.scene.add.existing(this);
    this.curr_mode = '';

    this.header_cont = scene.add.container();
    this.move_icon = scene.add.sprite(80, 30, 'nocompress', 'move_icon');
    this.time_icon = scene.add.sprite(230, 30, 'nocompress', 'time_icon');
    this.dynamite_icon = scene.add.sprite(
      360,
      30,
      'nocompress',
      'dynamite_icon'
    );
    this.res_icon = scene.add.sprite(500, 30, 'nocompress', 'resources_icon');
    this.moves_txt2 = scene.add
      .text(80, 60, moves_name, {
        font: '16px Helvetica',
        fill: '#FFFFFF',
        align: 'center'
      })
      .setOrigin(0.5)
      .setResolution(2);

    this.moves_txt = scene.add
      .rexBBCodeText(80, 90, `${MAX_MOVES_LIMIT()}/${MAX_MOVES_LIMIT()}`, {
        fontFamily: 'Play',
        fontSize: 26,
        color: '#fe5161'
      })
      .setOrigin(0.5)
      .setHAlign('center')
      .setResolution(2);

    this.time_txt2 = scene.add
      .text(230, 60, times_name, {
        font: '16px Helvetica',
        fill: '#FFFFFF',
        align: 'center'
      })
      .setOrigin(0.5)
      .setResolution(2);

    this.time_txt = scene.add
      .rexBBCodeText(230, 90, '20:00', {
        fontFamily: 'Play',
        fontSize: 26,
        color: '#fe5161'
      })
      .setOrigin(0.5)
      .setHAlign('center')
      .setResolution(2);

    this.dynamite_txt2 = scene.add
      .text(360, 60, dynamite_name, {
        font: '16px Helvetica',
        fill: '#FFFFFF',
        align: 'center'
      })
      .setOrigin(0.5)
      .setResolution(2);

    this.dynamite_txt = scene.add
      .rexBBCodeText(360, 90, MAX_DYNAMITES_LIMIT(), {
        fontFamily: 'Play',
        fontSize: 26,
        color: '#fe5161'
      })
      .setOrigin(0.5)
      .setHAlign('center')
      .setResolution(2);

    this.res_txt2 = scene.add
      .text(500, 60, res_name, {
        font: '16px Helvetica',
        fill: '#FFFFFF',
        align: 'center'
      })
      .setOrigin(0.5)
      .setResolution(2);

    this.res_txt = scene.add
      .rexBBCodeText(500, 90, '0/0/0', {
        fontFamily: 'Play',
        fontSize: 26,
        color: '#fe5161'
      })
      .setOrigin(0.5)
      .setHAlign('center')
      .setResolution(2);

    this.header_cont.add([
      this.move_icon,
      this.time_icon,
      this.dynamite_icon,
      this.res_icon
    ]);
    this.header_cont.add([
      this.moves_txt2,
      this.time_txt2,
      this.res_txt2,
      this.dynamite_txt2
    ]);
    this.header_cont.add([
      this.moves_txt,
      this.time_txt,
      this.res_txt,
      this.dynamite_txt
    ]);

    this.modal_cont = scene.add.container().setPosition(scene.game.sizeW, 0);
    this.modal = scene.add
      .sprite(0, 0, 'gui', 'modal')
      .setOrigin(1, 0)
      .setScale(1, 1.3)
      .setInteractive();
    this.modal_icon = scene.add.sprite(-100, 60, 'gui', 'scan');

    this.modal_cont.add([this.modal, this.modal_icon]);
    this.modal_txt = scene.add
      .text(-100, 150, 'Press "E" to mine\ncommon resource', {
        font: '18px Helvetica',
        fill: '#FFFFFF',
        align: 'center'
      })
      .setOrigin(0.5)
      .setResolution(2)
      .setDepth(0.6);
    this.modal_cont.add([this.modal_txt]);
    this.modal.on('pointerdown', this.tapAction, this);

    this.controls_info = scene.add
      .image(
        scene.game.sizeW - 60,
        scene.game.sizeH - 150,
        'gui',
        'controls_modal'
      )
      .setScrollFactor(0);

    this.controls_info.curr_show = true;
    this.add([this.controls_info]);

    this.sound_icon = scene.add
      .image(
        scene.game.sizeW - 60,
        scene.game.sizeH - 30,
        'nocompress',
        'sound_icon'
      )
      .setInteractive()
      .setScrollFactor(0);

    this.add([this.sound_icon]);

    this.zoom_btn = scene.add
      .sprite(
        scene.game.sizeW - 60,
        scene.game.sizeH - 65,
        'nocompress',
        'zoom'
      )
      .setInteractive()
      .setScrollFactor(0);
    this.add([this.zoom_btn]);

    this.exit_btn = scene.add
      .sprite(40, scene.game.sizeH - 30, 'nocompress', 'quit')
      .setInteractive()
      .setScrollFactor(0);
    this.add([this.exit_btn]);

    this.scan_find = this.scene.add
      .text(
        this.scene.game.sizeW / 2,
        this.scene.game.sizeH - 40,
        'THERE ARE 3 RESOURCES\nIN THE HIGHLIGHTED AREA',
        { font: '18px Play', fill: '#fe5161', align: 'center' }
      )
      .setOrigin(0.5)
      .setResolution(2)
      .setDepth(0.22)
      .setScrollFactor(0)
      .setVisible(false);

    this.add([this.scan_find]);

    this.exit_btn.on('pointerdown', this.tapQuit, this);
    this.zoom_btn.on('pointerdown', this.tapZoom, this);
    scene.input.keyboard.on('keydown', this.keyDown, this);

    this.add([this.header_cont, this.modal_cont]);
    scene.cameras.main.ignore(this);

    this.timedEvent = scene.time.addEvent({
      delay: 1000,
      callback: this.endTimer,
      callbackScope: this,
      loop: true
    });

    this.showModal('scan');
  }

  tapQuit() {
    if (this.scene.rover.isWork()) this.showWindow('exit');
  }

  tapAction() {
    // console.log('tap action')
    if (this.curr_mode === 'scan') {
      this.scene.rover.startScan();
    } else if (this.curr_mode === 'dynamite') {
      if (this.scene.rover.checkCollapse()) this.scene.rover.startDynamite();
    } else {
      this.scene.rover.moveAction('self');
    }
  }

  endTimer() {
    if (this.scene != null) {
      if (!this.windowShowNow) {
        if (this.scene.time_left != null) this.scene.time_left--;
        if (this.time_txt != null)
          this.time_txt.setText(
            new Date(this.scene.time_left * 1000).toISOString().slice(14, 19)
          );

        if (this.scene.time_left <= 0)
          this.scene.gui.showWindow('game over time');
      }
    }
  }

  updateHeaderDynamic({ moves, resources, dynamites }) {
    if (typeof moves === 'number')
      this.moves_txt.setText(moves + `/${MAX_MOVES_LIMIT()}`);
    if (typeof resources !== 'undefined')
      this.res_txt.setText(
        resources.common + '/' + resources.rare + '/' + resources.legendary
      );
    if (typeof dynamites === 'number') this.dynamite_txt.setText(dynamites);
  }

  updateHeader() {
    const rover = this.scene.rover;
    this.moves_txt.setText(rover.ct_moves + `/${MAX_MOVES_LIMIT()}`);
    // this.time_txt2
    this.res_txt.setText(
      rover.collected_common +
        '/' +
        rover.collected_rare +
        '/' +
        rover.collected_legendary
    );
    this.dynamite_txt.setText(rover.dynamite);
  }

  getCorrectMineDiscount() {
    const drillsGear = extractURLParam(window.location, 'drills');
    if (!drillsGear) return 0;

    switch (drillsGear) {
      case '3':
        return 0.5;
      case '4':
        return 1;
      case '5':
        return 2;
      default:
        return 0;
    }
  }

  showModal(mode = 'common') {
    this.curr_mode = mode;
    switch (mode) {
      case 'empty':
        this.modal_txt.setText('No actions available');
        this.modal_txt.setText('');
        this.modal_icon.setVisible(false);
        break;
      case 'exit':
        this.modal_txt.setText('Press "E" to leave\nthe map');
        this.modal_icon.setVisible(false);
        break;
      case 'common':
        this.modal_txt.setText(
          `Press "E" to mine\n resources\n(COST - ${
            6 - this.getCorrectMineDiscount()
          } MOVES)`
        );
        this.modal_icon.setTexture('gui', 'gem 1').setVisible(true);
        break;
      case 'rare':
        this.modal_txt.setText(
          `Press "E" to mine\n resources\n(COST - ${
            10 - this.getCorrectMineDiscount()
          } MOVES)`
        );
        this.modal_icon.setTexture('gui', 'gem 2').setVisible(true);
        break;
      case 'legendary':
        this.modal_txt.setText(
          `Press "E" to mine\n resources\n(COST - ${
            15 - this.getCorrectMineDiscount()
          } MOVES)`
        );
        this.modal_icon.setTexture('gui', 'gem 3').setVisible(true);
        break;
      case 'dynamite':
        this.modal_txt.setText('Press "R" to blow\nup tunnel collapse');
        this.modal_icon.setVisible(false);
        break;
      case 'fuel':
        this.modal_txt.setText(
          'Press "R" to collect\nthe fuel\n(COST - 1 MOVE)'
        );
        this.modal_icon.setTexture('gui', 'fuel').setVisible(true);
        break;
      case 'scan':
        this.modal_txt.setText('Press "F" to scan\nthe area\n(COST - 5 MOVE)');
        this.modal_icon.setTexture('gui', 'scan').setVisible(true);
        break;
      default:
        break;
    }
  }

  getWormWinChanceValue = () => {
    const transmitterGear = extractURLParam(window.location, 'transmitters');
    if (!transmitterGear) return 70;

    switch (transmitterGear) {
      case '9':
        return 75;
      case '10':
        return 80;
      case '11':
        return 90;
      default:
        return 70;
    }
  };

  showWindow(type, black_delay = 50) {
    if (!this.windowShowNow) {
      this.windowShowNow = true;
      this.wnd_array.forEach((e) => {
        if (e != null) e.destroy();
      });
      this.wnd_array = [];

      const rover = this.scene.rover;
      this.end_cont = this.scene.add
        .container()
        .setPosition(this.scene.center.x, this.scene.center.y);

      this.blackscreen = this.scene.add.graphics();
      this.blackscreen
        .fillStyle(0x000000, 0.75)
        .fillRect(
          -this.scene.game.sizeW,
          -this.scene.game.sizeH,
          this.scene.game.sizeW * 3,
          this.scene.game.sizeH * 3
        );
      this.blackscreen.setScale(4).setAlpha(1).setVisible(true);
      if (black_delay > 0) {
        this.blackscreen.setAlpha(0);
        this.scene.tweens.add({
          targets: this.blackscreen,
          alpha: 1,
          duration: black_delay,
          ease: 'Linear',
          delay: 0
        });
      }
      curr_window = type;

      this.end = this.scene.add
        .sprite(0, 0, 'gui', 'window_ui')
        .setOrigin(0.5)
        .setScale(1)
        .setDepth(0.9);

      if (type === 'start') {
        this.img = this.scene.add
          .image(0.5, 11, 'gui', 'disclaimer_image')
          .setOrigin(0.5, 1)
          .setScale(0.996);
        this.message = this.scene.add
          .text(0, 60, 'WELCOME TO MINING MISSION', {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(
            0,
            130,
            'Your goal is to complete resource mining and return\nto base with a limited amount of steps.\n\nIn the course of the mission, you might be attacked by the sand worm.\nYou will be able to decide whether to interact with him and fight or leave.',
            { font: '14px Helvetica', fill: '#FFFFFF', align: 'center' }
          )
          .setOrigin(0.5)
          .setResolution(2);
        this.start_btn = this.scene.add
          .image(0, 230, 'nocompress', 'button')
          .setInteractive()
          .on('pointerdown', this.letsPlay, this);

        this.start_txt = this.scene.add
          .text(0, 230, 'LET’S PLAY', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.img,
          this.message,
          this.message2,
          this.start_btn,
          this.start_txt
        );
      } else if (type === 'exit') {
        this.end.setScale(1, 0.9);
        this.img = this.scene.add
          .image(0.5, 39, 'gui', 'disclaimer_image')
          .setOrigin(0.5, 1)
          .setScale(0.996);
        this.message = this.scene.add
          .text(0, 90, 'EXIT THE MISSION?', {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(
            0,
            140,
            'You will loose all the progress in this mission\nif you exit before getting to the exit gates',
            { font: '14px Helvetica', fill: '#FFFFFF', align: 'center' }
          )
          .setOrigin(0.5)
          .setResolution(2);
        this.exit_btn = this.scene.add
          .image(100, 220, 'nocompress', 'button')
          .setInteractive()
          .on('pointerdown', () => this.exitGame(true), this);
        this.exit_txt = this.scene.add
          .text(100, 220, 'EXIT', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.return_txt = this.scene.add
          .text(-100, 220, 'RETURN TO MISSION', {
            font: '16px Play',
            fill: '#fe5161',
            align: 'center'
          })
          .setOrigin(0.5)
          .setInteractive()
          .setResolution(2)
          .on('pointerdown', this.returnGame, this);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.img,
          this.message,
          this.message2,
          this.exit_btn,
          this.exit_txt,
          this.return_txt
        );
      } else if (type === 'worm') {
        this.end.setScale(1, 1.15);
        this.selectActionWorm = 'retreat';
        this.img = this.scene.add
          .image(0.5, -30, 'gui', 'worm_attack')
          .setOrigin(0.5, 1)
          .setScale(0.996);
        this.message = this.scene.add
          .text(0, 30, "YOU'VE BEEN ATTACKED\nBY THE SAND WORM!", {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(-160, 90, 'Choose your next action to save yourself:', {
            font: '16px Helvetica',
            fill: '#FFFFFF',
            align: 'left'
          })
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.exit_btn = this.scene.add
          .image(0, 270, 'nocompress', 'button')
          .setInteractive()
          .on('pointerdown', this.chooseWormAction, this);
        this.exit_txt = this.scene.add
          .text(0, 270, 'CHOOSE', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.retreat_btn = this.scene.add
          .sprite(0, 130, 'gui', 'modal_choose')
          .setInteractive()
          .on('pointerdown', this.chooseRetreat, this);
        this.pay_btn = this.scene.add
          .sprite(0, 166, 'gui', 'modal_choose')
          .setInteractive()
          .on('pointerdown', this.choosePay, this);
        this.fight_btn = this.scene.add
          .sprite(0, 202, 'gui', 'modal_choose')
          .setInteractive()
          .on('pointerdown', this.chooseFight, this);

        this.select_btn = this.scene.add.sprite(
          0,
          130,
          'gui',
          'modal_choose_select'
        );

        this.retreat_txt = this.scene.add
          .text(-150, 130, 'Retreat (7 moves will be taken)', {
            font: '13px Helvetica',
            fill: '#FFFFFF',
            align: 'left'
          })
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.pay_txt = this.scene.add
          .text(
            -150,
            166,
            'Pay contribution to worm  (1 least rare resource)',
            {
              font: '13px Helvetica',
              fill: '#FFFFFF',
              align: 'left'
            }
          )
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.fight_txt = this.scene.add
          .text(
            -150,
            202,
            `Fight worm (${this.getWormWinChanceValue()}% chance to win)`,
            {
              font: '13px Helvetica',
              fill: '#FFFFFF',
              align: 'left'
            }
          )
          .setOrigin(0, 0.5)
          .setResolution(2);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.img,
          this.message,
          this.message2,
          this.exit_btn,
          this.exit_txt
        );
        this.wnd_array.push(
          this.retreat_btn,
          this.pay_btn,
          this.fight_btn,
          this.select_btn
        );
        this.wnd_array.push(this.retreat_txt, this.pay_txt, this.fight_txt);
      } else if (
        type === 'attack won' ||
        type === 'retreat' ||
        type === 'pay'
      ) {
        let go_img = 'attack_won';
        let go_title = 'ATTACK - WON';
        let go_offset = 0,
          title_space = 0,
          button_space = 0;
        let go_info =
          'You decided to fight the worm Luckily,\nyou were able to defeat the worm. Continue your journey';
        this.end.setScale(1, 1);
        if (type === 'retreat') {
          this.end.setScale(1, 0.95);
          go_offset = -15;
          go_img = 'retreated';
          go_title = 'YOU HAVE RETREATED';
          go_info = '7 steps have been deducted\nContinue your journey.';
        }
        if (type === 'pay') {
          this.end.setScale(1, 0.95);
          title_space = -10;
          button_space = 10;
          go_offset = -15;
          go_img = 'contribution';
          go_title = 'CONTRIBUTION PAID';
          go_info =
            'You have chosen to one of your resources to worm.\nWorm lets you live and allows you to pass.\nPlease continue your journey';
        }

        this.img = this.scene.add
          .image(0.5, 40 + go_offset, 'gui', go_img)
          .setOrigin(0.5, 1)
          .setScale(0.996);
        this.message = this.scene.add
          .text(0, 60 + 40 + go_offset + title_space, go_title, {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(0, 120 + 30 + go_offset, go_info, {
            font: '16px Helvetica',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.exit_btn = this.scene.add
          .image(0, 180 + 45 + go_offset + button_space, 'nocompress', 'button')
          .setInteractive()
          .on('pointerdown', this.continueGame, this);
        this.exit_txt = this.scene.add
          .text(0, 180 + 45 + go_offset + button_space, 'OK', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.img,
          this.message,
          this.message2,
          this.exit_btn,
          this.exit_txt
        );
      } else if (
        type === 'game over fuel' ||
        type === 'game over time' ||
        type === 'game over worm'
      ) {
        let go_img = 'game_over_fuel';
        let go_info = 'YOU RUN OUT OF FUEL';
        if (type === 'game over time') {
          go_img = 'game_over_fuel';
          go_info = 'YOU RUN OUT OF TIME';
          trackUserEvent('Mining mission failed: time over');
        }
        if (type === 'game over worm') {
          go_img = 'game_over_worm';
          go_info = 'YOU HAVE BEEN EATEN BY A WORM';
          trackUserEvent('Mining mission failed: eaten by worm');
        }
        this.end.setScale(1, 0.92);
        this.img = this.scene.add
          .image(0.5, 35, 'gui', go_img)
          .setOrigin(0.5, 1)
          .setScale(0.996);
        this.message = this.scene.add
          .text(0, 60 + 20, 'GAME OVER!', {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(0, 100 + 20, go_info, {
            font: '30px Play',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.exit_btn = this.scene.add
          .image(100, 180 + 20, 'nocompress', 'button')
          .setInteractive()
          .on('pointerdown', this.restartGame, this);
        this.exit_txt = this.scene.add
          .text(100, 180 + 20, 'PLAY AGAIN', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.return_txt = this.scene.add
          .text(-100, 180 + 20, 'EXIT', {
            font: '16px Play',
            fill: '#fe5161',
            align: 'center'
          })
          .setOrigin(0.5)
          .setInteractive()
          .setResolution(2)
          .on('pointerdown', this.exitGame, this);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.img,
          this.message,
          this.message2,
          this.exit_btn,
          this.exit_txt,
          this.return_txt
        );
        trackUserEvent('Mining mission failed: fuel over');
      } else if (type === 'passed') {
        trackUserEvent('Mining mission passed');

        const reward = store.getState().quests.miningReward;

        let res_proc_collect =
          rover.collected_common * 8 +
          rover.collected_rare * 18 +
          rover.collected_legendary * 28;

        let res_ganted = Phaser.Math.Clamp(
          Math.round(res_proc_collect) / 100,
          0,
          100
        );

        let clny_collect = reward?.clny?.value ?? 0;
        let avatar_collect = reward?.xp?.value ?? 0;

        this.end.setScale(1.5, 1);
        this.grayrect = this.scene.add.graphics();
        this.grayrect.fillStyle(0x232628, 1).fillRect(-80, -106, 460, 246);

        this.resline = this.scene.add.graphics();
        this.resline
          .fillStyle(0x3d4048, 1)
          .fillRect(0, 0, 220, 4)
          .setPosition(-40, -15);
        this.resline2 = this.scene.add.graphics();
        this.resline2
          .fillStyle(0xfe5161, 1)
          .fillRect(0, 0, 220 * res_ganted, 4)
          .setPosition(-40, -15);

        this.transline = this.scene.add.graphics();
        this.transline
          .fillStyle(0x3d4048, 1)
          .fillRect(0, 0, 245, 4)
          .setPosition(-362, 138);
        this.transline2 = this.scene.add.graphics();
        this.transline2
          .fillStyle(0xf55b5d, 1)
          .fillRect(
            0,
            0,
            (245 * store.getState().quests?.transportCondition) / 100,
            4
          )
          .setPosition(-362, 138);
        this.transline3 = this.scene.add.graphics();
        this.transline3
          .fillStyle(0xfe5161, 1)
          .fillRect(
            0,
            0,
            245 * ((store.getState().quests?.transportCondition - 2.5) / 100),
            4
          )
          .setPosition(-362, 138);

        this.img = this.scene.add
          .image(-240, 140, 'rover', 'rover_image')
          .setOrigin(0.5, 1);
        this.av = this.scene.add
          .image(60, -70, 'nocompress', 'resources_avatar')
          .setOrigin(0.5)
          .setScale(0.5);
        this.av2 = this.scene.add
          .image(260, -70, 'selected-avatar')
          .setOrigin(0.5)
          // TODO: SIZE OF IMAGE AFTER BE FIX
          .setScale(0.03);
        this.av_txt = this.scene.add
          .text(-40, -30, 'Resources collected: ' + clny_collect + ' CLNY', {
            font: '14px Helvetica',
            fill: '#FFFFFF',
            align: 'left'
          })
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.ganted_txt = this.scene.add
          .text(60, 5, +Math.round(res_ganted * 100) + '% granted', {
            font: '12px Helvetica',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.av2_txt = this.scene.add
          .text(260, -30, `Avatar: + ${avatar_collect} XP`, {
            font: '14px Helvetica',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message3 = this.scene.add
          .text(
            -40,
            45,
            'Common: ' +
              rover.collected_common +
              ' x 8% = ' +
              rover.collected_common * 8 +
              '%',
            { font: '12px Helvetica', fill: '#FFFFFF', align: 'left' }
          )
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.message4 = this.scene.add
          .text(
            -40,
            80,
            'Rare: ' +
              rover.collected_rare +
              ' x 18% = ' +
              rover.collected_rare * 18 +
              '%',
            { font: '12px Helvetica', fill: '#FFFFFF', align: 'left' }
          )
          .setOrigin(0, 0.5)
          .setResolution(2);
        this.message5 = this.scene.add
          .text(
            -40,
            115,
            'Legendary: ' +
              rover.collected_legendary +
              ' x 28% = ' +
              rover.collected_legendary * 28 +
              '%',
            { font: '12px Helvetica', fill: '#FFFFFF', align: 'left' }
          )
          .setOrigin(0, 0.5)
          .setResolution(2);

        this.message = this.scene.add
          .text(0, -200, 'YOU HAVE PASSED\nTHE MISSION!', {
            font: '40px Play',
            fill: '#FFFFFF',
            align: 'left'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.message2 = this.scene.add
          .text(-240, -125, 'Default transport', {
            font: '14px Helvetica',
            fill: '#FFFFFF',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);
        this.transp_cond = this.scene.add
          .rexBBCodeText(
            -240,
            150,
            `Transport condition ${
              store.getState().quests?.transportCondition - 2.5
            }% | [color=#F55B5D]-2.5%[/color]`,
            { fontFamily: 'Helvetica', fontSize: 14, color: '#FFFFFF' }
          )
          .setOrigin(0.5, 0)
          .setHAlign('center')
          .setResolution(2);

        this.exit_btn = this.scene.add
          .image(100, 230, 'nocompress', 'button')
          .setInteractive()
          .setScale(1.5, 1)
          .on('pointerdown', this.restartGame, this);
        this.exit_txt = this.scene.add
          .text(100, 230, reward ? 'COLLECT REWARD' : 'PLAY AGAIN', {
            font: '16px Play',
            fill: '#36363D',
            align: 'center'
          })
          .setOrigin(0.5)
          .setResolution(2);

        this.return_txt = this.scene.add
          .text(-100, 230, 'EXIT', {
            font: '16px Play',
            fill: '#fe5161',
            align: 'center'
          })
          .setOrigin(0.5)
          .setInteractive()
          .setResolution(2)
          .on('pointerdown', this.exitGame, this);

        this.wnd_array.push(
          this.blackscreen,
          this.end,
          this.grayrect,
          this.img,
          this.av,
          this.av_txt,
          this.av2,
          this.av2_txt,
          this.message,
          this.message2,
          this.exit_btn,
          this.exit_txt,
          this.return_txt
        );
        this.wnd_array.push(this.message3, this.message4, this.message5);
        this.wnd_array.push(this.transp_cond, this.ganted_txt);
        this.wnd_array.push(this.resline, this.resline2);
        this.wnd_array.push(this.transline, this.transline2, this.transline3);
      }
      this.end_cont.add(this.wnd_array);

      this.add(this.end_cont);

      this.scene.input.keyboard.on('keydown', this.keyWindows, this);
    }
  }

  keyWindows(e) {
    // console.log('key ',e.key)
    if (curr_window === 'worm') {
      if (e.key === 'ArrowDown') {
        if (this.selectActionWorm === 'retreat') {
          this.scene.tweens.add({
            targets: this.select_btn,
            y: this.pay_btn.y,
            duration: 100,
            ease: 'Quad.InOut',
            delay: 0
          });
          this.selectActionWorm = 'pay';
        } else if (this.selectActionWorm === 'pay') {
          this.scene.tweens.add({
            targets: this.select_btn,
            y: this.fight_btn.y,
            duration: 100,
            ease: 'Quad.InOut',
            delay: 0
          });
          this.selectActionWorm = 'fight';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.selectActionWorm === 'pay') {
          this.scene.tweens.add({
            targets: this.select_btn,
            y: this.retreat_btn.y,
            duration: 100,
            ease: 'Quad.InOut',
            delay: 0
          });
          this.selectActionWorm = 'retreat';
        } else if (this.selectActionWorm === 'fight') {
          this.scene.tweens.add({
            targets: this.select_btn,
            y: this.pay_btn.y,
            duration: 100,
            ease: 'Quad.InOut',
            delay: 0
          });
          this.selectActionWorm = 'pay';
        }
      } else if (e.key === 'Enter') {
        this.chooseWormAction();
      }
    } else {
      if (e.key === 'Enter') {
        if (
          curr_window === 'attack won' ||
          curr_window === 'retreat' ||
          curr_window === 'pay'
        ) {
          this.continueGame();
        } else if (
          curr_window === 'game over fuel' ||
          curr_window === 'game over time' ||
          curr_window === 'game over worm'
        ) {
          this.restartGame();
        } else if (curr_window === 'passed') {
          this.restartGame();
        } else if (curr_window === 'exit') {
          this.exitGame();
        } else if (curr_window === 'start') {
          this.letsPlay();
        }
      }
    }
  }

  continueGame() {
    this.closeWindow();
    this.scene.rover.setWorkNext();
  }

  closeWindow() {
    this.wnd_array.forEach((e) => {
      if (e != null) e.destroy();
    });

    this.windowShowNow = false;
    this.scene.input.keyboard.off('keydown', this.keyWindows);

    if (curr_window === 'attack won' || curr_window === 'pay') {
      this.scene.map.deleteWorm();
    }
  }

  letsPlay() {
    this.closeWindow();
    this.scene.rover.work = true;
  }

  returnGame() {
    this.closeWindow();
  }

  restartGame() {
    this.scene.restart();
  }

  exitGame = async (withLoad) => {
    try {
      if (withLoad) {
        await MiningQuestApi.leaveMission();
      }
      trackUserEvent('Mining mission finished: user exit');
      store.dispatch(toggleMiningPrepareScreenState(false));
      window.navigateHook('/');
    } catch (err) {}
  };

  chooseRetreat() {
    this.selectActionWorm = 'retreat';

    this.scene.tweens.add({
      targets: this.select_btn,
      y: this.retreat_btn.y,
      duration: 100,
      ease: 'Quad.InOut',
      delay: 0
    });
  }

  choosePay() {
    this.selectActionWorm = 'pay';
    this.scene.tweens.add({
      targets: this.select_btn,
      y: this.pay_btn.y,
      duration: 100,
      ease: 'Quad.InOut',
      delay: 0
    });
  }

  chooseFight() {
    this.selectActionWorm = 'fight';
    this.scene.tweens.add({
      targets: this.select_btn,
      y: this.fight_btn.y,
      duration: 100,
      ease: 'Quad.InOut',
      delay: 0
    });
  }

  chooseWormAction() {
    switch (this.selectActionWorm) {
      case 'retreat':
        try {
          MiningQuestApi.wormAction({
            address: window.address,
            action: 'retreat',
            successCallback: (data) => {
              this.closeWindow();
              const { moves, dynamites, resources } = data;
              this.scene.rover.ct_moves = moves;
              this.updateHeaderDynamic({ moves, dynamites, resources });
              this.scene.rover.moveLast();
              this.showWindow('retreat', 0);
            },
            failCallback: () => {}
          }).then(() => {});
          break;
        } catch (err) {}
        break;
      case 'pay':
        try {
          if (
            this.scene.rover.collected_rare >= 0 ||
            this.scene.rover.collected_legendary >= 0 ||
            this.scene.rover.collected_common >= 0
          ) {
            MiningQuestApi.wormAction({
              address: window.address,
              action: 'pay',
              successCallback: (data) => {
                this.closeWindow();
                const { moves, dynamites, resources } = data;
                this.pay_worm_count++;
                this.updateHeaderDynamic({ moves, dynamites, resources });
                this.showWindow('pay', 0);
              },
              failCallback: () => {
                window.toast('You should have more resources', {
                  appearance: 'error'
                });
              }
            }).then(() => {});
          } else {
            window.toast('You should have more resources', {
              appearance: 'error'
            });
          }
          break;
        } catch (err) {
          break;
        }
      case 'fight':
        try {
          MiningQuestApi.wormAction({
            address: window.address,
            action: 'fight',
            successCallback: (data) => {
              this.closeWindow();
              const { figntStatus } = data;
              this.fightWorm(figntStatus);
            },
            failCallback: () => {
              this.closeWindow();
              this.fightWorm('failed');
            }
          }).then(() => {});
          break;
        } catch (err) {
          break;
        }
      default:
        break;
    }
  }

  fightWorm(fightStatus) {
    if (fightStatus === 'win') {
      this.showWindow('attack won', 0);
    } else {
      this.showWindow('game over worm', 0);
    }
  }

  isZoomNow() {
    return this.zoomNow;
  }

  tapZoom() {
    // console.log('tap zoom')
    this.zoomToogle();
  }

  keyDown(e) {
    // console.log(e)
    if (e.code === 'Space') {
      this.zoomToogle();
    }
  }

  isWindowShow() {
    return this.windowShowNow;
  }

  zoomToogle() {
    if (!this.isWindowShow()) {
      this.zoomNow = !this.zoomNow;
      if (this.zoomNow) {
        if (this.zoom != null) this.zoom_btn.play('zoom out btn');
        this.zoomIn();
      } else {
        if (this.zoom != null) this.zoom_btn.play('zoom in btn');
        this.zoomOut();
      }
    }
  }

  showEnd() {
    this.showWindow('passed');
  }

  hideAll() {
    this.scene.input.keyboard.off('keydown');

    if (this.header_cont != null) this.header_cont.setVisible(false);
    if (this.modal_cont != null) this.modal_cont.setVisible(false);
    if (this.controls_info != null) this.controls_info.setVisible(false);
    if (this.sound_icon != null) this.sound_icon.setVisible(false);
  }

  zoomIn() {
    this.scene.cameras.main.startFollow(this.scene.rover, true, 0.08, 0.08);
    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      zoom: this.scene.zIn,
      duration: 500,
      ease: 'Quad.InOut',
      delay: 0
    });
  }

  zoomOut() {
    this.scene.cameras.main.stopFollow();
    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      zoom: this.scene.zOut,
      duration: 500,
      ease: 'Quad.InOut',
      delay: 0
    });
  }

  updatePos() {
    if (!this.scene) return;

    this.modal_cont.setPosition(this.scene.game.sizeW, 0);
    if (this.controls_info != null)
      this.controls_info.setPosition(
        this.scene.game.sizeW - 60,
        this.scene.game.sizeH - 150
      );
    if (this.zoom_btn != null)
      this.zoom_btn.setPosition(
        this.scene.game.sizeW - 60,
        this.scene.game.sizeH - 65
      );
    if (this.sound_icon != null)
      this.sound_icon.setPosition(
        this.scene.game.sizeW - 60,
        this.scene.game.sizeH - 30
      );
    if (this.exit_btn != null)
      this.exit_btn.setPosition(40, this.scene.game.sizeH - 30);

    if (this.scan_find != null)
      this.scan_find.setPosition(
        this.scene.game.sizeW / 2,
        this.scene.game.sizeH - 40
      );

    if (this.end_cont != null)
      this.end_cont.setPosition(this.scene.center.x, this.scene.center.y);
  }

  delete() {
    this.scene.input.keyboard.off('keydown');
    this.scene.time.removeAllEvents();
  }

  createAnim(scene) {}
}

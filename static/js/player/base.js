import { AcGameObject } from '/static/js/ac_game_object/base.js';

export class Player extends AcGameObject {
    constructor(root, info) {
        super();

        this.root = root;

        this.id = info.id; // 用id区分两个角色

        // 人物坐标及宽高
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;

        this.color = info.color; // 创建游戏角色

        this.direction = 1;

        // 水平及垂直的速度
        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;  // 水平初速度
        this.speedy = -1000;  // 跳跃初速度

        this.gravity = 50; // 定义重力

        this.ctx = this.root.game_map.ctx; // 定义canvas对象ctx

        this.pressed_keys = this.root.game_map.controller.pressed_keys; // 把按键传入

        // 人物有很多个状态，此处定义状态机。初始为跳跃状态。逻辑上1和2是同一种。
        // 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡
        this.status = 3;
        this.animations = new Map(); // 把所有的状态的动作存到数组中
        this.frame_current_cnt = 0;

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');
    }

    start() {

    }

    update_move() {
        this.vy += this.gravity; // 速度每秒都会增加g

        this.x += this.vx * this.timedelta / 1000; // v = at，单位是ms要除1000
        this.y += this.vy * this.timedelta / 1000;

        // 实现人物掉落（游戏初始）
        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;

            if (this.status === 3) this.status = 0; // 当触及地面时停止跳跃并静止
        }

        // 设置地图的边界
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_control() {
        let w, a, d, space; // 定义键盘控制

        // 玩家1：定义wad和space；玩家2：定义ArrowUp和ArrowLeft和Enter
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        // 静止或移动时的操作
        if (this.status === 0 || this.status === 1) {
            if (space) {
                // 按下space攻击
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    // 定义向前跳跃
                    this.vx = this.speedx;
                } else if (a) {
                    // 定义向后跳跃
                    this.vx = -this.speedx;
                } else {
                    // 定义向上跳跃
                    this.vx = 0;
                }
                this.vy = this.speedy; // 定义跳跃时的垂直速度
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                // 定义向前移动
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                // 定义向后移动
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                // 定义静止
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_direction() {
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {
        if (this.status === 6) return;

        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 20, 0);

        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            };

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {
        let status = this.status;

        if (this.status === 1 && this.direction * this.vx < 0) status = 2;

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }

        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                }
            }
        }

        this.frame_current_cnt++;
    }
}
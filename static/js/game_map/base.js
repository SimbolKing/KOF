import { AcGameObject } from '/static/js/ac_game_object/base.js'; // 地图基于AcGameObject
import { Controller } from '/static/js/controller/base.js'; // 把控制器加入地图中


export class GameMap extends AcGameObject {
    constructor(root) {
        super();

        this.root = root;

        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>'); // 用jquery定义canvas，tabindex = 0表示聚焦

        this.ctx = this.$canvas[0].getContext('2d'); // 把canvas取出来，jquery中的canvas函数是个数组

        // 加到kof中并聚焦（为了获取输入）
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas); // 把控制器加入地图中

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));

        this.time_left = 60000;  // 单位：毫秒
        this.$timer = this.root.$kof.find(".kof-head-timer");
    }

    start() {

    }

    update() {
        this.time_left -= this.timedelta;
        if (this.time_left < 0) {
            this.time_left = 0;

            let [a, b] = this.root.players;
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }

        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();
    }

    render() { // 清空地图，避免人物重影
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
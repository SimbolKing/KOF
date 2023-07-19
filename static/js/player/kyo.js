// kyo角色的实现，继承自Player

import { Player } from '/static/js/player/base.js';
import { GIF } from '/static/js/utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info); // 初始化Player

        this.init_animations();
    }

    init_animations() { // 初始化动画
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,  // 总图片数
                frame_rate: 5,  // 每5帧过度一次，刷帧的速度
                offset_y: offsets[i],  // 垂直方向偏移量
                loaded: false,  // 是否加载完整
                scale: 2,  // 放大多少倍
            });

            // 图片加载完后需要更新一下
            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    obj.frame_rate = 4;
                }
            }
        }
    }
}
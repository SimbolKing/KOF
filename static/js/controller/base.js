// 用于读取玩家的键盘输入

export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set(); // 开一个set表示当前按下哪个键，set可以判重
        this.start();
    }

    start() {
        let outer = this; // 想用外面的this需要用变量存下来
        this.$canvas.keydown(function (e) { // 按下键
            outer.pressed_keys.add(e.key);
        });

        this.$canvas.keyup(function (e) { // 按起键
            outer.pressed_keys.delete(e.key);
        });
    }
}
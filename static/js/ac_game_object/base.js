// 3个元素：地图、玩家1、玩家2，都要实现每秒刷新60次，3个元素继承自同一class

let AC_GAME_OBJECTS = []; // 对象的所有元素都存下来

class AcGameObject {
    constructor() {

        AC_GAME_OBJECTS.push(this); // 存下来元素

        this.timedelta = 0; // 当前帧距离上一帧的时间间隔

        this.has_call_start = false; // 当前对象是否执行start()
    }

    start() {  // 初始化

    }

    update() {  // 每一帧执行一次

    }

    destroy() {  // 删除当前元素
        for (let i in AC_GAME_OBJECTS) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}


let last_timestamp; // 上一帧是什么时候执行的

// 传入timestamp表示当前函数的执行的时刻
let AC_GAME_OBJECTS_FRAME = (timestamp) => {

    // 枚举所有元素。of枚举值，in枚举下标
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME); // 递归执行
}

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);

export {
    AcGameObject
}
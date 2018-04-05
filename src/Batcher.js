/**
 * 批处理构造函数
 * @constructor
 */

 //在watcher的update方法中new的
function Batcher() {
    //调用下面的reset方法
    this.reset();
}

/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher实例
 */
Batcher.prototype.push = function (job) {
    //job就是watcher实例
    if (!this.has[job.name]) {
        //把watcher实例存到queue数组（执行队列）中
        this.queue.push(job);
        //再把它放到哈希表中
        this.has[job.name] = job;
        if (!this.waiting) {
            this.waiting = true;
            //第二个参数时间没写，使用浏览器默认的最小时间，下一个eventloop执行
            setTimeout(() => {
                this.flush();
            });
        }
    }
};

/**
 * 执行并清空事件队列
 */
Batcher.prototype.flush = function () {
    //调用watcher原型链上的cb函数
    this.queue.forEach((job) => {
        job.cb();
    });
    this.reset();
};
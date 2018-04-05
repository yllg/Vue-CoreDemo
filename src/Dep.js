
//收集依赖，发送更新通知

function Dep() {
  //存放所有的依赖,即watcher实例
  //本例子会加两个watcher进来，分别是input节点的watcher和{{text}}文本的watcher
  this.subs = [];
}

Dep.prototype = {
  //增加依赖
  addSub: function(sub) {
    this.subs.push(sub);
  },
  //发通知
  notify: function() {
    //遍历所有的依赖项即watcher，触发它的更新方法
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};

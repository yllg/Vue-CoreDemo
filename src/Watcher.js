
//拿到data中的值，创建batcher批处理函数

function Watcher(vm, node, name, type) {
    //observe.js中的 Dep.target在这里；
    //每次都要重新赋值；因为JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
    Dep.target = this;
    //text； compile编译找到v-model绑定那个属性名，即text
    this.name = name;
    //dom节点； 本例子就是input节点
    this.node = node;
    //实例对象
    this.vm = vm;
    //写死的； compile中传入的固定值 “value”或者“nodevalue”
    this.type = type;
    //调用原型链上的更新方法
    this.update();
    Dep.target = null;
}

//初始化compile编译时初始化每个watcher都会触发一次update方法
//之后set修改data属性值时，dep发通知，触发watcher的update方法
Watcher.prototype = {
    update: function() {
        //核心，取值，调用下面的get方法
        this.get();
        //又new一个batcher，执行了他内部的初始化重置方法
        var batcher = new Batcher();
        //调用他的push方法，把本watcher实例传入
        batcher.push(this);
        // this.node[this.type] = this.value; // 订阅者执行相应操作
    },
    //更新dom视图啊！
    cb:function(){
        // 订阅者执行相应操作
        //比如第二个节点input元素 它初始化watcher时传入的type是“value”
        //这里就可以this.node.value就是输入框的内容 “”
        //把它替换成data中的值 “Hello Vue源码”，输入框内就有默认值了

        //再比如第三个节点“  {{text}}”它初始化watcher时传入的type是“nodeValue”
        //这里就可以this.node.nodeValue就是他的内容“  {{text}}”
        //把它替换成data中的值 “Hello Vue源码”
        this.node[this.type] = this.value; 
    },
    // 获取data的属性值
    get: function() {
        //！！核心
        //触发observe中相应属性（这里就是text）的get方法
        //this.value  设置成员属性,把helloworld去处理，并通知observe更新dep
        this.value = this.vm[this.name]; 
    }
}

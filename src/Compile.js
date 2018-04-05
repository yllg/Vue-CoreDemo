
//编译解析模板，给input绑定输入监听事件，给每个v-model命令创建一个watcher

function Compile(node, vm) {
  //dom节点，vue实例对象
  if (node) {
    //调用下面的方法一
    this.$frag = this.nodeToFragment(node, vm);
    return this.$frag;
  }
}

//定义了两个方法
Compile.prototype = {
  //方法一 真实节点转成虚拟节点
  nodeToFragment: function(node, vm) {
    //把自己Compile存起来
    var self = this;
    //创建一个文档碎片节点，是一个虚拟的节点
    //暂时存放那些一次插入文档的多个节点,可以减少dom操作
    var frag = document.createDocumentFragment();
    var child;
    //node的第一个孩子节点就是input输入框
    //这里一个 = 表示赋值！！指向同一个地址
    //本例子中node也就是#app的div节点一共有三个子节点
    //分别是： “ ”，input节点， “  {{text}}”
    //会走3次循环
    while ((child = node.firstChild)) {
      //调用原型链上的第二个方法，编译
      //传入 当前元素的子节点  vue实例
      self.compileElement(child, vm);
      //将编译后的子节点，加到虚拟节点frag中
      //注意：append到碎片节点，会删除原来的节点，所以while才会有终止条件
      frag.append(child); 
    }
    return frag;
  },

  //方法二 编译
  compileElement: function(node, vm) {
    //匹配双花括号内的0个或多个字符
    var reg = /\{\{(.*)\}\}/;

    //节点类型： 1 元素；2 属性； 3 文本；
    //节点类型为元素； 本例子的input
    if (node.nodeType === 1) {
      //拿到所有的属性值；类数组的三个值：type id v-model
      var attr = node.attributes;
      // 解析属性
      for (var i = 0; i < attr.length; i++) {
        //找到使用了v-model的属性名
        if (attr[i].nodeName == "v-model") {
          // 获取v-model绑定的属性名， 本例子就是text
          var name = attr[i].nodeValue; 
          //给输入框绑定输入事件
          node.addEventListener("input", function(e) {
            //输入框的值变了，赋值给vue的实例的data，就会触发该属性的set方法
            vm[name] = e.target.value;
          });
          // node.value = vm[name]; // 将data的值赋给该node
          // 创建watcher实例，每个v-model的指令都会创建一个自己的watcher
          new Watcher(vm, node, name, "value");
        }
      }
    }
    //节点类型为text； 本例子第三次是node是 “  {{text}}”
    if (node.nodeType === 3) {
      //第一次时node.nodeValue是“”，不进入
      //第三次可以匹配到 text
      if (reg.test(node.nodeValue)) {
        // 获取匹配到的字符串 text
        var name = RegExp.$1; 
        //去掉首尾的空格
        name = name.trim();
        // node.nodeValue = vm[name]; // 将data的值赋给该node
        //再给他也创建一个watcher
        //因为node.nodeValue可以拿到该节点的内容“  {{text}}”，
        //所以我们传入watcher的type也叫“nodeValue”，
        //之后在watcher的cb函数中就可以用data对应的值（Hello Vue源码）来替换它哦
        new Watcher(vm, node, name, "nodeValue");
      }
    }
  }
};

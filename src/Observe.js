
//数据劫持

function observe(obj, vm) {
  //{text:xx}  vm-> 实例this->{text:xx}
  Object.keys(obj).forEach(function (key) {
    //this  text  "Hello Vue源码" 传到下面的函数中
    defineReactive(vm, key, obj[key]);
  })
}

//进行数据劫持，设置set get
function defineReactive(obj, key, val) {
  //实例this  text  "Hello Vue源码"
  //每一个数据都new一个Dep收集他的依赖
  var dep = new Dep();

  //取值时触发get，修改时触发set
  Object.defineProperty(obj, key, {
    //watcher的update中的get方法触发
    get: function () {
      //添加订阅者watcher到Dep；
      //Dep.target就是一个watcher实例，有这四项vm, node, name, type
      //初始化编译会new个watcher即Dep.target，之后直接notify触发时，就是空，避免重复添加
      if (Dep.target) {
        // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
        dep.addSub(Dep.target);
      }
      //把对应的属性值返回，这里是data中text的值“Hello Vue源码”
      //然后回到watcher的update中
      return val;
    },
    //输入框的值发生变化，就会触发set方法
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      console.log(val);
      // 作为发布者发出通知更新，让每个watcher触发update方法，更新视图哦
      dep.notify();
    }
  })
}
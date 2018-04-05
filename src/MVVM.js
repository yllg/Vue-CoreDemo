function Vue(options) {
      this.data = options.data;
      var data = this.data;
      //{text:'hello...'}   this -> vue的实例data: {text:'hello...'}
      //数据劫持，设置set get
      observe(data, this);
      
      var id = options.el;
      //模板编译，dom节点和this（vue实例）传入
      //得到编译处理后的 文档碎片节点
      var dom =new Compile(document.getElementById(id),this);
      // 编译完成后，将dom返回到app中
      document.getElementById(id).appendChild(dom);
    }

    //1. this -> data: {text:'hello...'}
    //2. observe观察者进行数据劫持  Compile模板编译
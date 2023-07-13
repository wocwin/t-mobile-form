## 小程序自定义导航栏设计

分为三步思路： 1.确定自定义导航栏高度 2.确定右侧囊体宽高以确定自定义左侧囊体 3.具体细节

#### 1.确定不同机型下导航栏的高度

根据实测和网上收集资料，确定基本的 statusBar 高度即小程序自由导航高度。如下写在 systemSetting.js 中

```js
const statusBar = {
  android: 24,
  iPhone: 20,
  newModel: 44, // 长屏下默认高度
};
const navigationBar = {
  default: 44,
};
const navBarStyle = {
  background: "",
  color: "",
  textAlignAndroid: "left",
  textAlignIPhone: "center",
  textAlign: "center",
  fontSize: 18,
};
export { statusBar, navigationBar, navBarStyle };
```

#### 2.确定囊体大小

通过确认微信 API，确定了 wx.getMenuButtonBoundingClientRect()接口的返回值包括了囊体的宽高，在组件代码中即可调用来取得

#### 3.组件具体实现

可参考同级目录下的 navigationBar.vue 的代码。主要的几个流程点有：

```
a.根据前面获取到的导航栏高和囊体大小，将这些值存入vuex以后续调用
```

```
b.在模板处定义对应的不同场景--有home及back或search或单独的back囊体或无该左侧囊体；在js的判断中根据具体条件场景去进一步判断是否需要显示哪一种左侧囊体。
```
```Html
c.在各自对应的需要加入导航栏的页面引入该组件，因为原导航栏占位不再且自定义导航栏position被设置为fixed，故记得在使用的页面对应引入高度占位。如下place-holder的div
    <div class="place-holder" :style="{ height: menuSettings.navBarHeight + 'px'}"></div>
    <nav-bar title="司机首页" />
```


# Recoil Dev Tool

# 安装

```
npm i @aloudata/recoilize
```

# 应用内添加代码

```js
import RecoilizeDebugger from '@aloudata/recoilize';
import RecoilRoot from 'recoil';

//If your app injects on an element with ID of 'app'
const app = document.getElementById('app');

ReactDOM.render(
  <RecoilRoot>
    <RecoilizeDebugger root={app} />
    <App />
  </RecoilRoot>,
  app,
);
```

# 安装chrome浏览器插件

在本项目的根目录下，在安装完所有npm依赖后，运行：

```
npm run build
```

在chrome浏览器的插件管理页面 chrome://extensions/ ，打开“开发者”模式。

点击页面左上角的“加载已解压的扩展程序”按钮，选择本项目下 "src/extension/build" 文件夹。即可加载完成插件。

# 使用

在浏览器页面下可以看到 “Recoilize” 工具项。开始愉快地玩耍吧。
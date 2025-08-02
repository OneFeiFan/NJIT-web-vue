# &lt;zui-material-icons /&gt;

Material图标集合

将谷歌开源的 Material 风格图标打包，方便引用。

图标来源：
[https://github.com/google/material-design-icons](https://github.com/google/material-design-icons)

[https://github.com/marella/material-design-icons/](https://github.com/marella/material-design-icons/)

图标预览：

[https://fonts.google.com/icons?hl=zh-cn](https://fonts.google.com/icons?hl=zh-cn)


图标集合需要配合 zui-svg-icon 插件使用

转到: [zui-svg-icon](https://ext.dcloud.net.cn/plugin?id=13964)



## 快速开始

```javascript
import { SvgIconLib } from '~/static/svg-icons-lib.js';
import { SvgIconLib as MaterialFilled } from '~/uni_modules/zui-material-icons/static/material-filled.js';

SvgIconLib.registerCollection("material-filled", MaterialFilled);
```

```vue
<zui-svg-icon collection="material-filled" icon="home" />
```


## 支持

如果组件对您有帮助，请不吝打赏。肥宅快乐水🥤是创作动力！🥤🥤🥤

<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉  喜欢就打赏一下  🍒🍑🥭
</a>
</span>
</span>

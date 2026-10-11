# 五种倾向 · 中文大五人格测评

免费、开源的中文大五人格静态网站，基于 Johnson IPIP 120 题库。无需注册，浏览器本地计分，无第三方数据收集接口。

## 功能

- 中文 120 题，每页 10 题，支持键盘作答和移动端布局。
- 浏览器自动保存答案，刷新或关闭后可以继续。
- 展示 O/C/E/A/N 五个维度的原始分、平均分与 0–100 换算分。
- 下载含答案与结果的 JSON 文件。

## 本地运行

需要 Node.js 20 或更新版本，无需安装依赖。

```sh
npm start
```

打开 http://127.0.0.1:4173 。不要直接双击 HTML，题库通过 HTTP 加载。

```sh
npm test
```

## GitHub Pages

在仓库 Settings → Pages 中，选择 Deploy from a branch，使用 main 分支的根目录。本站不需要构建，也不依赖 CDN。

## 计分与解释边界

答案取 1–5 分，反向题计为 `6 - 答案`。每个维度有 24 题：原始分为 24–120，平均分为原始分除以 24，展示分为 `round((原始分 - 24) / 96 * 100)`。

**0–100 是可得分范围的线性换算，不是人群百分位或常模 T 分。** 本版不提供高低分档、诊断结论或人格类型。中文题目来自社区翻译，本站尚未独立验证其中文信效度，适用于教育与自我了解。

## 数据与隐私

答案保存在当前浏览器的 localStorage 中，不发送到服务器。公共设备上使用后可点击“清空并重新开始”。下载结果含完整答案，请自行保管。静态托管服务仍可能保留普通网站访问日志。

## 来源与许可

- 题库：[Alheimsins/b5-johnson-120-ipip-neo-pi-r](https://github.com/Alheimsins/b5-johnson-120-ipip-neo-pi-r)，使用 `data/zh-cn/questions.json`，上游简体中文译者为 Roy Jia。
- 固定上游版本记录在 `data/upstream-commit.txt`，保留的上游 MIT 许可证见 `data/LICENSE`。
- IPIP 官方资料：https://ipip.ori.org/ 。本项目不是 MMPI，也未采用 MMPI 的题目或计分代码。
- 本项目代码使用 MIT 许可证，见 `LICENSE`。

## 项目结构

`index.html` 页面；`style.css` 样式；`app.js` 答题与保存；`scoring.js` 独立计分；`data/` 题库与来源；`tests/` 计分测试。

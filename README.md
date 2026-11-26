# Cyrus Yang · 仍在成为

个人学习记录与项目实践。网站：https://yang-cyrus.github.io/

## 编辑与生成

使用 Node.js 22 或更新版本，无需安装依赖。

```sh
npm run build
npm run check
```

- 项目与文章保存在 `_portfolio/`、`_posts/`，个人介绍在 `_pages/about.md`。
- 页面布局与首页内容在 `scripts/build-site.mjs`。
- 样式与交互在 `assets/style.css`、`assets/app.js`。
- 修改源文件后运行构建，将生成的 HTML 一起提交到 main。
- GitHub Pages 从 main 根目录发布，`.nojekyll` 让页面直接作为静态文件提供。
- 开源项目页优先读取 GitHub 最新公开仓库；连接失败时显示带日期说明的仓库快照。

旧版 Jekyll 源文件保留，历史版本可通过 Git 提交记录查看。

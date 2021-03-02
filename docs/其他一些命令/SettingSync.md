---
title: VSC Setting Sync 插件配置流程
categories:
  - setting
tags:
  - VS Code
  - setting sync
---

## <span id="first-use">初次使用 </span>

### 一、插件登录到 github

1. 安装 Setting Sync 插件
2. 进入首页或 Ctrl + Shift + P -> Sync: Advanced Options —> 打开设置
3. 登录到 github

### 二、生成 token

1. GitHub 头像 —> settings -> Developer settings -> Personal access tokens -> Generate new token
2. Note：备注, 勾选 gist，点击确定，生成 token,(token 要保存再来，只能看到一次)

### 三、接下来生成一个 gist

1. GitHub 头像->Yours gists -> 右上角+号创建一个新的 gist 仓库
2. 输入 gist 描述和片段内容
3. gist 仓库 `冒号:` 后面即 Gist 仓库的 ID

### 四、设置 setting sync 插件

1. Ctrl + Shift + P -> 输入 sync -> Advanced Options -> 编辑扩展本地配置

   ```js
   "ignoreExtensions": [],
   "gistDescription": "Visual Studio Code Settings Sync Gist",
   "version": 343,
   "token": "这里放入token",
   "downloadPublicGist": false,

   ```

2. token 填写 第二步中生成的 token
3. 在插件列表中找到 setting sync，点击后面的齿轮，选择 Extention Settings
4. 输入第三步的 gist ID， 配置文件会自动保存。注意 user 和 workspace 的 gist ID

### 五、上传和下载配置

Shift + Alt + U 将配置环境 扩展插件信息上传到云端  
Shift + Alt + D 下载云端的配置  
或者 Ctrl + Shift + P 在顶部面板中选择

## <span id="sync-your-gist">同步自己的配置</span>

如果自己已经上传了 sync 的配置，在其他电脑上安装 setting sync，登录 GitHub 账号

会让你选择 gistID，选择完成后

Shift + Alt + D 下载云端的配置，或者 Ctrl + Shift + P 在顶部面板中选择 Download

重新下载配置就可以了

## <span id="sync-setting">同步他人已有的配置 </span>

如果已经知道一个 可用的 gist ID，可以将这个 gist 下的 setting sync 记录的配置同步下来

### 一、获取 gist ID

1. GitHub 头像 —> Your Gists -> 点击想要使用的 gist —> 浏览器地址栏最后一段内容即 gist ID

### 二、设置 setting sync 插件

1. 在插件列表中找到 setting sync，点击后面的齿轮，选择 Extention Settings
2. 输入第一步的 gist ID， 配置文件会自动保存。注意 user 和 workspace 的 gist ID

### 三、上传和下载配置

Shift + Alt + U 将配置环境 扩展插件信息上传到云端  
Shift + Alt + D 下载云端的配置

或者 Ctrl + Shift + P 在顶部面板中选择

## 重置 setting sync 插件的配置

快捷键的用法是 Ctrl+P 输入命令：>Sync: Reset Extension Settings  
重置不会清除现有的扩展，只恢复初始 sync 的配置

然后参考 [初次使用](#first-use) 或 [同步已有的配置](#sync-setting) 或 [同步自己的配置](#sync-your-gist)

[参考链接](https://www.cnblogs.com/lychee/p/11214032.html)

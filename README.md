# dsh-noworkplace

**中文** | [English](#english)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）宿主插件：维护一个固定的「无工作区」工作区（`~/.dsh/scratch`），让零散的一次性任务**无需选择文件夹**即可开始对话。

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) host plugin that keeps a fixed "No workspace" workspace at `~/.dsh/scratch`, so one-off conversations never need a folder pick.

## 动机

DSH 桌面版默认要求先有一个工作区（工作文件夹）才能开始对话，首次使用还会在系统文档目录自动创建默认工作区。对于"随手问一句、改个临时文件、跑个一次性脚本"这类零散任务，选文件夹是多余的步骤。

本插件在 DSH 的用户数据层维护一个固定的「无工作区」工作区，指向 `~/.dsh/scratch`（自动创建）。它以官方工作区形态存在，因此侧栏、工作区切换菜单、"新会话"回退等全部界面原生支持——**应用更新不影响**（插件装在用户数据层，不在程序目录）。

## 安装

插件以本地目录形式安装进 DSH 档案（profile）。任选其一：

**方式一：DSH 会话内（推荐）**

在任意 DSH 会话里让助手执行：用 `plugin_manager` 工具 `install_bundle`，目标为本仓库的本地克隆目录。

**方式二：命令行**

```bash
git clone https://github.com/wgl2zj/dsh-noworkplace.git
cd dsh-noworkplace
# 在 DSH 会话中，或使用应用自带运行时：
# plugin_manager: install_bundle, target = 本目录绝对路径
```

安装后即时生效（热加载），侧栏会出现名为「无工作区」的工作区。

## 工作原理

- 声明依赖宿主的 `workspaceRegistry` 服务；
- 激活时确保 `~/.dsh/scratch` 目录存在，然后调用官方注册接口 `WorkspaceRegistry.create(path, title)`；
- `create` 对同一规范化路径**幂等**：重复激活复用既有记录，且不会覆盖你在界面上改过的标题。

## 行为说明

- 该工作区与你手动添加的工作区完全同权：可改名、可删除、会话归档等均走官方逻辑；
- 删除该工作区后，插件下次激活会重建（不想要此行为请禁用或移除本插件）；
- 已有 `cwd` 为 `~/.dsh/scratch` 的历史会话会自动归入该工作区显示（官方 cwd 匹配机制）；
- 移除插件不影响已产生的会话记录与 scratch 目录里的文件。

## 兼容性

- 在 DSH 桌面版 `0.2.1-rc.5`（Windows）实测通过；
- 依赖宿主 `WorkspaceRegistry.create(path, title)` 接口签名，官方若变更该接口需要适配。

## 许可证

[MIT](LICENSE)

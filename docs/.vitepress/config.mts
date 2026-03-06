import { defineConfig } from "vitepress";

export default defineConfig({
  title: "AI Employee Playbook",
  description:
    "Operational guide for deploying and managing AI employees with OpenClaw",
  lang: "zh-CN",
  base: "/openclaw-docs/",

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/guide/getting-started" },
      { text: "操作手册", link: "/operations/workspace" },
      { text: "实战案例", link: "/cases/deploy-dev-agent" },
    ],

    sidebar: [
      {
        text: "入门",
        items: [
          { text: "简介", link: "/guide/introduction" },
          { text: "快速开始", link: "/guide/getting-started" },
          { text: "环境准备", link: "/guide/prerequisites" },
        ],
      },
      {
        text: "操作手册",
        items: [
          { text: "Workspace 搭建", link: "/operations/workspace" },
          { text: "Agent 配置", link: "/operations/agent-config" },
          { text: "Agent 生命周期", link: "/operations/agent-lifecycle" },
          { text: "Heartbeat 机制", link: "/operations/heartbeat" },
          { text: "记忆系统", link: "/operations/memory" },
          { text: "OKR 驱动工作流", link: "/operations/okr" },
          { text: "消息通道接入", link: "/operations/messaging" },
          { text: "多 Agent 协作", link: "/operations/multi-agent" },
        ],
      },
      {
        text: "实战案例",
        items: [
          { text: "部署 Dev Agent", link: "/cases/deploy-dev-agent" },
          { text: "配置 Slack 通信", link: "/cases/slack-setup" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/SuLabsOrg/openclaw-docs" },
    ],

    outline: {
      label: "目录",
    },

    search: {
      provider: "local",
    },
  },
});

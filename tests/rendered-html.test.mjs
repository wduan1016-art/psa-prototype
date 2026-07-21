import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("PSA 页面包含完整整体框架和正式元数据", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const label of ["首页", "我的待办", "消息通知", "商机管理", "项目管理", "任务中心", "工单管理", "员工信息", "资源调度", "权限管理"]) {
    assert.match(page, new RegExp(label));
  }
  assert.match(page, /id: "core", label: ""/);
  assert.doesNotMatch(page, /业务管理|交付管理|GitLab|材料中心|NEXT_PUBLIC_PSA_API_URL/);
  assert.match(layout, /PSA 专业服务自动化系统/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(css, /@media\(max-width:760px\)/);
});

test("PSA 页面提供导航、工作台和统一页面状态", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /aria-label="系统主导航"/);
  assert.match(page, /aria-label="全局搜索"/);
  for (const label of ["快捷新建", "我的待办", "我参与的项目", "待跟进商机", "本周剩余可用工时", "优先待办", "商机跟进提醒", "本周个人工时负载", "快捷入口", "系统通知"]) {
    assert.match(page, new RegExp(label));
  }
  for (const state of ["暂无数据", "正在加载", "加载异常"]) assert.match(page, new RegExp(state));
  assert.match(page, /mobile-open/);
  assert.match(page, /is-collapsed/);
  assert.doesNotMatch(page, /fetch\(|\/api\//);
});

test("商机管理提供列表、看板、详情和新建流程", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const label of ["进行中商机", "预计金额", "本月预计赢单", "需要跟进", "商机列表", "商机看板", "新建商机", "记录跟进", "推进阶段", "转为项目", "跟进记录", "商机资料", "上传资料", "首次跟进计划"]) {
    assert.match(page, new RegExp(label));
  }
  assert.match(page, /OpportunityManagement/);
  assert.match(page, /OpportunityDetail/);
  assert.match(page, /OpportunityCreate/);
  assert.match(page, /aria-label="商机阶段"/);
  assert.match(page, /aria-label="负责人"/);
  assert.match(page, /全部负责人/);
  assert.match(page, />查询</);
  assert.doesNotMatch(page, /更多筛选|全部商机/);
});

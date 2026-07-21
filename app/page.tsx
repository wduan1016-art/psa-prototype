"use client";

import { useMemo, useState, type ReactNode } from "react";

type PageId =
  | "home" | "my-todos" | "notifications"
  | "opportunity-list" | "opportunity-board"
  | "project-list" | "project-board"
  | "all-tasks" | "my-tasks" | "claimable-tasks"
  | "work-order-list" | "my-work-orders" | "work-order-review"
  | "employee-list" | "resource-calendar" | "resource-load"
  | "role-management" | "permission-settings";

type MenuLeaf = { id: PageId; label: string };
type MenuItem = { id: string; label: string; icon: string; children?: MenuLeaf[]; page?: PageId };
type MenuGroup = { id: string; label: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    id: "workspace", label: "工作台", items: [
      { id: "home-entry", label: "首页", icon: "⌂", page: "home" },
      { id: "todo-entry", label: "我的待办", icon: "✓", page: "my-todos" },
      { id: "message-entry", label: "消息通知", icon: "◇", page: "notifications" },
    ],
  },
  {
    id: "core", label: "", items: [
      { id: "opportunity", label: "商机管理", icon: "◎", children: [
        { id: "opportunity-list", label: "商机列表" },
        { id: "opportunity-board", label: "商机看板" },
      ] },
      { id: "project", label: "项目管理", icon: "▣", children: [
        { id: "project-list", label: "项目列表" },
        { id: "project-board", label: "项目看板" },
      ] },
      { id: "task", label: "任务中心", icon: "☷", children: [
        { id: "all-tasks", label: "全部任务" },
        { id: "my-tasks", label: "我的任务" },
        { id: "claimable-tasks", label: "待认领任务" },
      ] },
      { id: "work-order", label: "工单管理", icon: "□", children: [
        { id: "work-order-list", label: "工单列表" },
        { id: "my-work-orders", label: "我的工单" },
        { id: "work-order-review", label: "待验收工单" },
      ] },
    ],
  },
  {
    id: "resource", label: "资源管理", items: [
      { id: "employee", label: "员工信息", icon: "♙", children: [
        { id: "employee-list", label: "员工列表" },
      ] },
      { id: "scheduling", label: "资源调度", icon: "▦", children: [
        { id: "resource-calendar", label: "资源日历" },
        { id: "resource-load", label: "负载视图" },
      ] },
    ],
  },
  {
    id: "system", label: "系统管理", items: [
      { id: "permission", label: "权限管理", icon: "◈", children: [
        { id: "role-management", label: "角色管理" },
        { id: "permission-settings", label: "权限配置" },
      ] },
    ],
  },
];

const pageMeta: Record<PageId, { title: string; module: string; group: string; step?: number; description: string }> = {
  home: { title: "首页", module: "个人工作台", group: "工作台", description: "聚合个人待办、项目参与、商机跟进与资源负载。" },
  "my-todos": { title: "我的待办", module: "个人工作台", group: "工作台", description: "集中查看需要我处理、确认和跟进的事项。" },
  notifications: { title: "消息通知", module: "个人工作台", group: "工作台", description: "查看系统提醒、业务动态和协同消息。" },
  "opportunity-list": { title: "商机列表", module: "商机管理", group: "商机管理", step: 2, description: "商机查询、筛选和批量操作的主要入口。" },
  "opportunity-board": { title: "商机看板", module: "商机管理", group: "商机管理", step: 2, description: "按阶段观察商机分布与推进状态。" },
  "project-list": { title: "项目列表", module: "项目管理", group: "项目管理", step: 3, description: "项目全生命周期查询与管理入口。" },
  "project-board": { title: "项目看板", module: "项目管理", group: "项目管理", step: 3, description: "按阶段、健康度和进度查看项目。" },
  "all-tasks": { title: "全部任务", module: "任务中心", group: "任务中心", step: 4, description: "查看商机与项目下的全部任务。" },
  "my-tasks": { title: "我的任务", module: "任务中心", group: "任务中心", step: 4, description: "聚合分派给当前用户的任务。" },
  "claimable-tasks": { title: "待认领任务", module: "任务中心", group: "任务中心", step: 4, description: "展示可由员工主动认领的任务池。" },
  "work-order-list": { title: "工单列表", module: "工单管理", group: "工单管理", step: 5, description: "查看所有已生成工单及执行状态。" },
  "my-work-orders": { title: "我的工单", module: "工单管理", group: "工单管理", step: 5, description: "查看当前用户负责的工单。" },
  "work-order-review": { title: "待验收工单", module: "工单管理", group: "工单管理", step: 5, description: "集中处理已提交、等待验收的工单。" },
  "employee-list": { title: "员工列表", module: "员工信息", group: "资源管理", step: 6, description: "维护员工档案、技能和工作状态。" },
  "resource-calendar": { title: "资源日历", module: "资源调度", group: "资源管理", step: 6, description: "按日期查看人员容量、占用和空闲时间。" },
  "resource-load": { title: "负载视图", module: "资源调度", group: "资源管理", step: 6, description: "识别空闲、满载和超配人员。" },
  "role-management": { title: "角色管理", module: "权限管理", group: "系统管理", step: 7, description: "定义系统角色和角色职责。" },
  "permission-settings": { title: "权限配置", module: "权限管理", group: "系统管理", step: 7, description: "配置菜单、操作和数据访问范围。" },
};

const moduleForPage = (page: PageId) => menuGroups.flatMap(group => group.items).find(item => item.page === page || item.children?.some(child => child.id === page))?.id ?? null;

export default function Home() {
  const [page, setPage] = useState<PageId>("home");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const meta = pageMeta[page];

  const navigate = (next: PageId) => {
    setPage(next);
    setExpanded(moduleForPage(next));
    setMobileOpen(false);
    setQuickOpen(false);
    setSearchOpen(false);
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return (Object.entries(pageMeta) as [PageId, typeof meta][])
      .filter(([, item]) => `${item.title}${item.module}${item.group}`.includes(query.trim()))
      .slice(0, 6);
  }, [query]);

  return (
    <div className={`prototype-shell ${collapsed ? "is-collapsed" : ""}`}>
      {mobileOpen && <button className="mobile-overlay" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}
      <Sidebar page={page} expanded={expanded} collapsed={collapsed} mobileOpen={mobileOpen} onExpand={id => setExpanded(current => current === id ? null : id)} onNavigate={navigate} />

      <div className="app-main">
        <header className="app-header">
          <div className="header-left">
            <button className="header-icon desktop-toggle" aria-label={collapsed ? "展开侧栏" : "收起侧栏"} onClick={() => setCollapsed(value => !value)}>☰</button>
            <button className="header-icon mobile-toggle" aria-label="打开导航" onClick={() => setMobileOpen(true)}>☰</button>
            <div className="breadcrumbs" aria-label="面包屑"><span>{meta.group}</span>{meta.module !== meta.group && <><i>/</i><span>{meta.module}</span></>}{meta.title !== meta.module && <><i>/</i><strong>{meta.title}</strong></>}</div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <span>⌕</span><input aria-label="全局搜索" placeholder="搜索菜单和功能" value={query} onFocus={() => setSearchOpen(true)} onChange={event => { setQuery(event.target.value); setSearchOpen(true); }} /><kbd>⌘ K</kbd>
              {searchOpen && <SearchPanel query={query} results={searchResults} onNavigate={navigate} onClose={() => setSearchOpen(false)} />}
            </div>
            <PopoverButton label="快捷新建" icon="＋" open={quickOpen} onToggle={() => setQuickOpen(value => !value)}>
              <Popover title="快捷新建"><QuickItem icon="◎" label="新建商机" note="进入第 2 项设计" onClick={() => navigate("opportunity-list")} /><QuickItem icon="▣" label="新建项目" note="进入第 3 项设计" onClick={() => navigate("project-list")} /><QuickItem icon="☷" label="新建任务" note="进入第 4 项设计" onClick={() => navigate("all-tasks")} /></Popover>
            </PopoverButton>
            <PopoverButton label="消息通知" icon="♢" badge="3" open={messageOpen} onToggle={() => setMessageOpen(value => !value)} compact>
              <Popover title="最新消息" action="全部消息" onAction={() => navigate("notifications")}><MiniMessage tone="blue" title="项目周报待提交" time="10 分钟前" /><MiniMessage tone="amber" title="你有 2 个临期待办" time="1 小时前" /><MiniMessage tone="green" title="资源申请已通过" time="昨天" /></Popover>
            </PopoverButton>
            <PopoverButton label="帮助" icon="?" open={helpOpen} onToggle={() => setHelpOpen(value => !value)} compact>
              <Popover title="帮助与支持"><QuickItem icon="?" label="使用指南" note="查看系统操作说明" /><QuickItem icon="◇" label="反馈建议" note="提交原型优化意见" /></Popover>
            </PopoverButton>
            <div className="user-menu-wrap">
              <button className="user-trigger" onClick={() => setUserOpen(value => !value)}><span>WD</span><div><strong>王迪</strong><small>PSA 管理员</small></div><b>⌄</b></button>
              {userOpen && <Popover title="个人账户"><QuickItem icon="♙" label="个人信息" note="查看和维护个人资料" /><QuickItem icon="⚙" label="偏好设置" note="设置语言与显示方式" /><QuickItem icon="↗" label="退出登录" note="安全退出当前账号" /></Popover>}
            </div>
          </div>
        </header>

        <main className="page-canvas">
          {page === "home" ? <PersonalWorkspace onNavigate={navigate} /> : page === "my-todos" ? <TodoPage onNavigate={navigate} /> : page === "notifications" ? <NotificationPage /> : <ModulePlaceholder page={page} />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ page, expanded, collapsed, mobileOpen, onExpand, onNavigate }: { page: PageId; expanded: string | null; collapsed: boolean; mobileOpen: boolean; onExpand: (id: string) => void; onNavigate: (page: PageId) => void }) {
  return <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
    <div className="brand"><span className="brand-symbol">P</span><div><strong>PSA</strong><small>专业服务自动化</small></div></div>
    <nav aria-label="系统主导航" className="sidebar-nav">
      {menuGroups.map(group => <section className={`menu-group ${group.label ? "" : "ungrouped"}`} key={group.id}>{group.label && <h2>{group.label}</h2>}{group.items.map(item => {
        const active = item.page === page || item.children?.some(child => child.id === page);
        const isOpen = item.children ? expanded === item.id : false;
        return <div className={`menu-block ${active ? "active-module" : ""}`} key={item.id}>
          <button className={`menu-parent ${item.page === page ? "active" : ""}`} aria-expanded={item.children ? isOpen : undefined} title={collapsed ? item.label : undefined} onClick={() => item.children ? onExpand(item.id) : item.page && onNavigate(item.page)}><span className="menu-icon">{item.icon}</span><span className="menu-label">{item.label}</span>{item.children && <i className={isOpen ? "open" : ""}>⌄</i>}</button>
          {item.children && isOpen && <div className="submenu">{item.children.map(child => <button key={child.id} className={page === child.id ? "active" : ""} onClick={() => onNavigate(child.id)}><span />{child.label}</button>)}</div>}
        </div>;
      })}</section>)}
    </nav>
    <div className="sidebar-footer"><span className="avatar">WD</span><div><strong>王迪</strong><small>在线</small></div><i className="online-dot" /></div>
  </aside>;
}

function PersonalWorkspace({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return <div className="workspace-page">
    <section className="welcome-row"><div><p>2026 年 7 月 21 日 · 星期二</p><h1>早上好，王迪</h1><span>今天有 6 项工作需要关注，其中 2 项将在今天到期。</span></div><button onClick={() => onNavigate("my-todos")}>查看今日待办 <span>→</span></button></section>
    <section className="metric-grid">
      <Metric icon="✓" label="我的待办" value="12" detail="2 项今日到期" tone="blue" onClick={() => onNavigate("my-todos")} />
      <Metric icon="▣" label="进行中项目" value="5" detail="本周 1 个里程碑" tone="violet" onClick={() => onNavigate("my-tasks")} />
      <Metric icon="◎" label="待跟进商机" value="8" detail="3 项超过 7 天未更新" tone="amber" onClick={() => onNavigate("opportunity-list")} />
      <Metric icon="◴" label="本周剩余可用工时" value="14h" detail="已安排 26 / 40 小时" tone="green" onClick={() => onNavigate("resource-calendar")} />
    </section>
    <section className="home-grid">
      <Panel className="priority-panel" title="优先待办" subtitle="按截止时间和优先级排序" action="查看全部" onAction={() => onNavigate("my-todos")}>
        <TodoRow tone="red" title="确认华东制造项目阶段交付物" meta="项目管理 · 今天 17:00" tag="待确认" />
        <TodoRow tone="amber" title="完成吉利研究院二次方案评审" meta="商机管理 · 今天 18:00" tag="待处理" />
        <TodoRow tone="blue" title="审核数据治理需求调研工单" meta="工单管理 · 明天 10:00" tag="待验收" />
        <TodoRow tone="gray" title="更新本周个人工作计划" meta="个人待办 · 周五前" tag="普通" />
      </Panel>
      <Panel className="project-panel" title="我参与的项目" subtitle="近期里程碑与执行进度" action="项目列表" onAction={() => onNavigate("project-list")}>
        <ProjectRow name="智能研发协同平台" code="PRJ-2026-003" progress={68} due="09-30" status="正常" />
        <ProjectRow name="供应链流程优化" code="PRJ-2026-006" progress={92} due="07-31" status="临期" />
        <ProjectRow name="DevSecOps 能力建设" code="PRJ-2026-009" progress={34} due="11-15" status="正常" />
      </Panel>
      <Panel className="follow-panel" title="商机跟进提醒" subtitle="需要我关注的商机动态" action="商机列表" onAction={() => onNavigate("opportunity-list")}>
        <FollowRow customer="吉利研究院" opportunity="研发效能平台建设" stage="二次方案" time="今天" />
        <FollowRow customer="华东制造集团" opportunity="云原生转型咨询" stage="需求调研" time="已逾期 2 天" danger />
        <FollowRow customer="浦江能源" opportunity="数据治理一期" stage="投标" time="明天" />
      </Panel>
      <Panel className="capacity-panel" title="本周个人工时负载" subtitle="计划工时与可用时间" action="资源日历" onAction={() => onNavigate("resource-calendar")}>
        <div className="capacity-chart">{[{d:"一",h:6},{d:"二",h:8},{d:"三",h:7},{d:"四",h:3},{d:"五",h:2}].map(item => <div key={item.d}><span><i style={{height:`${item.h/8*100}%`}} /></span><b>{item.d}</b><small>{item.h}h</small></div>)}</div>
        <div className="capacity-legend"><span><i className="used" />已安排 26h</span><span><i className="free" />剩余 14h</span></div>
      </Panel>
      <Panel className="quick-panel" title="快捷入口" subtitle="快速进入常用工作"><div className="quick-grid"><QuickLink icon="◎" label="商机列表" onClick={() => onNavigate("opportunity-list")} /><QuickLink icon="▣" label="项目列表" onClick={() => onNavigate("project-list")} /><QuickLink icon="☷" label="我的任务" onClick={() => onNavigate("my-tasks")} /><QuickLink icon="□" label="我的工单" onClick={() => onNavigate("my-work-orders")} /><QuickLink icon="▦" label="资源日历" onClick={() => onNavigate("resource-calendar")} /><QuickLink icon="◇" label="消息通知" onClick={() => onNavigate("notifications")} /></div></Panel>
      <Panel className="notice-panel" title="系统通知" subtitle="近期平台与业务通知" action="全部通知" onAction={() => onNavigate("notifications")}><Notice date="07-21" title="本周工时填报将在周五 18:00 截止" /><Notice date="07-20" title="项目阶段评审规范已更新" /><Notice date="07-18" title="第三季度资源计划开始收集" /></Panel>
    </section>
  </div>;
}

function TodoPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return <StandardPage title="我的待办" description="集中处理需要我跟进、确认和验收的工作事项。"><div className="filter-tabs"><button className="active">全部 12</button><button>今天到期 2</button><button>本周到期 7</button><button>已逾期 1</button></div><div className="standalone-list"><TodoRow tone="red" title="确认华东制造项目阶段交付物" meta="项目管理 · 今天 17:00" tag="待确认" /><TodoRow tone="amber" title="完成吉利研究院二次方案评审" meta="商机管理 · 今天 18:00" tag="待处理" /><TodoRow tone="blue" title="审核数据治理需求调研工单" meta="工单管理 · 明天 10:00" tag="待验收" /></div><button className="text-link" onClick={() => onNavigate("home")}>← 返回首页</button></StandardPage>;
}

function NotificationPage() {
  return <StandardPage title="消息通知" description="查看系统提醒、业务变化和需要关注的协同消息。"><div className="filter-tabs"><button className="active">全部消息</button><button>未读 3</button><button>业务提醒</button><button>系统公告</button></div><div className="notification-list"><NotificationItem unread title="项目周报待提交" text="智能研发协同平台本周周报尚未提交，请在今天 18:00 前完成。" time="10 分钟前" /><NotificationItem unread title="商机跟进提醒" text="华东制造集团商机已超过 7 天未更新，请确认下一步行动。" time="1 小时前" /><NotificationItem title="资源申请已通过" text="你提交的 7 月 24 日资源支持申请已由资源经理确认。" time="昨天" /></div></StandardPage>;
}

function ModulePlaceholder({ page }: { page: PageId }) {
  const meta = pageMeta[page];
  return <StandardPage title={meta.title} description={meta.description}><div className="placeholder-card"><div className="placeholder-icon">{menuGroups.flatMap(group => group.items).find(item => item.children?.some(child => child.id === page))?.icon ?? "□"}</div><span>整体框架已就绪</span><h2>{meta.module} · {meta.title}</h2><p>该页面的导航、面包屑和内容容器已经建立。具体字段、流程、视图与操作将在第 {meta.step} 项中与你逐步确认并完善。</p><div className="placeholder-features"><span>统一页面标题区</span><span>筛选与操作区预留</span><span>列表 / 看板内容区预留</span><span>空态与异常态规范</span></div></div><StateSamples /></StandardPage>;
}

function StandardPage({ title, description, children }: { title: string; description: string; children: ReactNode }) { return <div className="standard-page"><header><p>PSA 专业服务自动化</p><h1>{title}</h1><span>{description}</span></header>{children}</div>; }
function Panel({ title, subtitle, action, onAction, className="", children }: { title: string; subtitle: string; action?: string; onAction?: () => void; className?: string; children: ReactNode }) { return <section className={`panel ${className}`}><header><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button onClick={onAction}>{action} <span>→</span></button>}</header>{children}</section>; }
function Metric({ icon, label, value, detail, tone, onClick }: { icon: string; label: string; value: string; detail: string; tone: string; onClick: () => void }) { return <button className={`metric-card ${tone}`} onClick={onClick}><span className="metric-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div><i>→</i></button>; }
function TodoRow({ tone, title, meta, tag }: { tone: string; title: string; meta: string; tag: string }) { return <button className="todo-row"><i className={tone} /><span className="todo-check" /><div><strong>{title}</strong><small>{meta}</small></div><em className={tone}>{tag}</em><b>›</b></button>; }
function ProjectRow({ name, code, progress, due, status }: { name: string; code: string; progress: number; due: string; status: string }) { return <button className="project-row"><span className="project-symbol">{name.slice(0,1)}</span><div className="project-copy"><strong>{name}</strong><small>{code} · 截止 {due}</small><span><i style={{width:`${progress}%`}} /></span></div><div className="project-value"><em className={status === "临期" ? "warn" : ""}>{status}</em><b>{progress}%</b></div></button>; }
function FollowRow({ customer, opportunity, stage, time, danger=false }: { customer: string; opportunity: string; stage: string; time: string; danger?: boolean }) { return <button className="follow-row"><span>{customer.slice(0,2)}</span><div><strong>{opportunity}</strong><small>{customer} · {stage}</small></div><em className={danger ? "danger" : ""}>{time}</em><b>›</b></button>; }
function QuickLink({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) { return <button onClick={onClick}><span>{icon}</span><strong>{label}</strong></button>; }
function Notice({ date, title }: { date: string; title: string }) { return <button className="notice-row"><time>{date}</time><span>{title}</span><b>›</b></button>; }
function NotificationItem({ title, text, time, unread=false }: { title: string; text: string; time: string; unread?: boolean }) { return <article className={`notification-item ${unread ? "unread" : ""}`}><i /><div><strong>{title}</strong><p>{text}</p><small>{time}</small></div><button>标记已读</button></article>; }

function PopoverButton({ label, icon, badge, open, onToggle, compact=false, children }: { label: string; icon: string; badge?: string; open: boolean; onToggle: () => void; compact?: boolean; children: ReactNode }) { return <div className="popover-wrap"><button className={compact ? "header-icon" : "quick-create"} aria-label={label} aria-expanded={open} onClick={onToggle}><span>{icon}</span>{!compact && label}{badge && <em>{badge}</em>}</button>{open && children}</div>; }
function Popover({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) { return <div className="popover"><header><strong>{title}</strong>{action && <button onClick={onAction}>{action}</button>}</header><div>{children}</div></div>; }
function QuickItem({ icon, label, note, onClick }: { icon: string; label: string; note: string; onClick?: () => void }) { return <button className="quick-item" onClick={onClick}><span>{icon}</span><div><strong>{label}</strong><small>{note}</small></div><b>›</b></button>; }
function MiniMessage({ tone, title, time }: { tone: string; title: string; time: string }) { return <button className="mini-message"><i className={tone} /><div><strong>{title}</strong><small>{time}</small></div></button>; }
function SearchPanel({ query, results, onNavigate, onClose }: { query: string; results: [PageId, typeof pageMeta[PageId]][]; onNavigate: (page: PageId) => void; onClose: () => void }) { return <div className="search-panel"><header><strong>{query ? `“${query}” 的搜索结果` : "快速导航"}</strong><button onClick={onClose}>×</button></header>{query && results.length === 0 ? <div className="search-empty">没有匹配的菜单或功能</div> : (results.length ? results : (["opportunity-list","project-list","my-tasks","my-work-orders"] as PageId[]).map(id => [id,pageMeta[id]] as [PageId,typeof pageMeta[PageId]])).map(([id,item]) => <button key={id} onClick={() => onNavigate(id)}><span>⌕</span><div><strong>{item.title}</strong><small>{item.group} / {item.module}</small></div><b>↵</b></button>)}</div>; }
function StateSamples() { return <section className="state-samples"><h3>统一状态规范</h3><div><article><span className="state-icon">○</span><strong>暂无数据</strong><p>当前暂无内容，可通过主操作开始创建。</p></article><article><span className="state-loader" /><strong>正在加载</strong><p>保持页面结构稳定，仅更新内容区域。</p></article><article><span className="state-icon error">!</span><strong>加载异常</strong><p>说明原因，并提供明确的重试入口。</p></article></div></section>; }

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSA 专业服务自动化系统",
  description: "面向商机、项目、任务、工单与员工资源协同的专业服务自动化工作台。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

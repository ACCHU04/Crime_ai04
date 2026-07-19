import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useSidebar } from "@/hooks/useSidebar";
import { FloatingCopilot } from "@/features/intelligence/components/FloatingCopilot";

const Dashboard = lazy(() => import("@/routes/Dashboard"));
const Investigation = lazy(() => import("@/routes/Investigation"));
const Analytics = lazy(() => import("@/routes/Analytics"));
const Network = lazy(() => import("@/routes/Network"));
const Copilot = lazy(() => import("@/routes/Copilot"));
const Settings = lazy(() => import("@/routes/Settings"));
const NotFound = lazy(() => import("@/routes/NotFound"));

function PageLoader() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="card" count={3} />
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <Header />
      <main
        className="transition-[margin] duration-200"
        style={{ marginLeft: collapsed ? 64 : 256 }}
      >
        <div className="p-6 pt-[calc(var(--header-height)+1.5rem)]">
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </div>
      </main>
      <FloatingCopilot />
    </div>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investigation" element={<Investigation />} />
          <Route path="/investigation/:caseId" element={<Investigation />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/network" element={<Network />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

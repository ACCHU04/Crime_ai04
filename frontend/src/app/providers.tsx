import { QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/hooks/useSidebar";
import queryClient from "./queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{children}</SidebarProvider>
    </QueryClientProvider>
  );
}

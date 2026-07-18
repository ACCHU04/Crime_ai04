import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Settings"
        description="Platform configuration and preferences"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Platform</dt>
              <dd className="font-medium text-[var(--text-primary)]">
                Crime Intelligence Platform
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Version</dt>
              <dd className="font-medium text-[var(--text-primary)]">1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Hackathon</dt>
              <dd className="font-medium text-[var(--text-primary)]">
                Karnataka Police Datathon 2026
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </motion.div>
  );
}

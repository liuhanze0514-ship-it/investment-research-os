import Link from "next/link";
import { BarChart3, Building2, CalendarDays, FileText, KanbanSquare, ListChecks, Search, Settings, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/projects", label: "Pipeline", icon: KanbanSquare },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "#", label: "Companies", icon: Building2 },
  { href: "#", label: "Contacts", icon: Users },
  { href: "#", label: "Meetings", icon: CalendarDays },
  { href: "#", label: "Documents", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card/80 px-3 py-4 lg:block">
      <div className="mb-5 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          PM
        </div>
        <div>
          <div className="text-sm font-semibold">Primary Market</div>
          <div className="text-xs text-muted-foreground">Workflow MVP</div>
        </div>
      </div>

      <Button variant="outline" className="mb-4 w-full justify-start text-muted-foreground">
        <Search className="h-4 w-4" />
        Search projects
      </Button>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <Separator className="my-4" />

      <div className="space-y-3 px-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Workspace</div>
          <div className="mt-2 rounded-md border bg-background p-3">
            <div className="text-sm font-medium">Northstar Capital</div>
            <div className="mt-1 text-xs leading-5 text-muted-foreground">Local SQLite demo data. No external APIs.</div>
          </div>
        </div>
        <Link className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" href="#">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

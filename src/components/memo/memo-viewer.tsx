"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MemoViewer({ markdown, downloadHref }: { markdown: string; downloadHref: string }) {
  const [copied, setCopied] = useState(false);

  async function copyMemo() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={copyMemo}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy memo"}
        </Button>
        <Button asChild>
          <a href={downloadHref}>
            <Download className="h-4 w-4" />
            Export .md
          </a>
        </Button>
      </div>
      <pre className="max-h-[760px] overflow-auto whitespace-pre-wrap rounded-lg border bg-card p-5 text-sm leading-6 text-foreground">
        {markdown}
      </pre>
    </div>
  );
}

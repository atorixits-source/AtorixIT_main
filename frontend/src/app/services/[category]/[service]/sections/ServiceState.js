"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServiceLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-8 w-48 bg-primary/20 rounded mb-4 mx-auto" />
        <div className="h-4 w-64 bg-muted-foreground/20 rounded mx-auto" />
      </div>
    </div>
  );
}

export function ServiceNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="text-center max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the service you're looking for.
        </p>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    </div>
  );
}

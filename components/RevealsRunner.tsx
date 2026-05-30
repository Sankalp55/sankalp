"use client";

import { useReveals } from "@/hooks/useReveals";

export default function RevealsRunner({ id }: { id: string }) {
  useReveals([id]);
  return null;
}

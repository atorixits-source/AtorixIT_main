"use client";

import { useParams } from "next/navigation";
import IndustriesWeServe from "./IndustriesWeServe";

export default function IndustriesWeServeRenderer() {
  const { service } = useParams();

  // Safety check
  if (!service) return null;

  // service slug === serviceKey in JSON
  return <IndustriesWeServe serviceKey={service} />;
}

"use client";

import { useParams } from "next/navigation";

export default function ProjectGenerationsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return <div>Project Settings of {projectId}</div>;
}

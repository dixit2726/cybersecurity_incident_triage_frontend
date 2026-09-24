import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/playbooks")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

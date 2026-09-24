import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mitre")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

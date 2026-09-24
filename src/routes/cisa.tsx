import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cisa")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

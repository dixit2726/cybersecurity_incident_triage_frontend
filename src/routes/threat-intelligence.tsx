import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/threat-intelligence")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

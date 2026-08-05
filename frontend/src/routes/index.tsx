import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "AutoStock — Vehicle Parts Inventory Management" },
      {
        name: "description",
        content:
          "AutoStock is an inventory, sales, purchasing and supplier management system built for vehicle parts shops.",
      },
      { property: "og:title", content: "AutoStock — Vehicle Parts Inventory Management" },
      {
        property: "og:description",
        content: "Manage parts stock, sales, purchases, suppliers and customers in one dashboard.",
      },
    ],
  }),
  component: () => null,
});

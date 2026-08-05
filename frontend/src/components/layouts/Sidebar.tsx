import { Link } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/",
  },

  {
    name: "Products",
    path: "/products",
  },

  {
    name: "Categories",
    path: "/categories",
  },

  {
    name: "Sales",
    path: "/sales",
  },

  {
    name: "Customers",
    path: "/customers",
  },

  {
    name: "Suppliers",
    path: "/suppliers",
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
w-64
bg-slate-900
text-white
min-h-screen
p-5
"
    >
      <h1
        className="
text-xl
font-bold
mb-8
"
      >
        Nihon Inventory
      </h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="
block
px-4
py-3
rounded-lg
hover:bg-slate-800
"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

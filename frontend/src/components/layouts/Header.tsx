import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      className="
h-16
bg-white
border-b
flex
items-center
justify-between
px-6
"
    >
      <h2
        className="
font-semibold
"
      >
        Vehicle Parts Management
      </h2>

      <div
        className="
flex
items-center
gap-4
"
      >
        <div>{user?.name}</div>

        <button
          onClick={logout}
          className="
bg-red-500
text-white
px-3
py-1
rounded-lg
"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

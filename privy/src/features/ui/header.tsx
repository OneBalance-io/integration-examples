export const Header = ({
  logout,
  authenticated,
}: {
  logout: () => void;
  authenticated: boolean;
}) => {
  return (
    <header className="p-4 max-w-screen-xl mx-auto">
      <div className="flex justify-end">
        {authenticated ? (
          <button
            className="text-sm bg-surface-level-2 py-2 px-4 rounded-full font-medium text-white/80"
            onClick={logout}
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
};

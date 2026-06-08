import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function SiteNav() {
  const { user } = useAuth();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2">
        <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
          <div className="size-4 bg-black rounded-sm rotate-45" />
        </div>
        <span className="font-display text-xl font-extrabold tracking-tight">MINDSYNC</span>
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        {user ? (
          <>
            <Link to="/discover" className="hidden sm:inline text-sm font-medium hover:text-brand transition-colors">
              Discover
            </Link>
            <Link to="/circles" className="hidden sm:inline text-sm font-medium hover:text-brand transition-colors">
              Circles
            </Link>
            <Link
              to="/profile"
              className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-brand transition"
            >
              My Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="hidden sm:inline text-sm font-medium hover:text-brand transition-colors">
              Manifesto
            </Link>
            <Link to="/login" className="text-sm font-medium hover:text-brand transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-brand transition"
            >
              Join Platform
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

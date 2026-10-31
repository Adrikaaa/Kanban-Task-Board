import { Link } from "react-router";
import { SITE_NAME } from "../../../app/constants/site";

// Three bars of decreasing height: the columns of a board.
export const LogoMark = ({ className = "size-7" }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
    <rect width="32" height="32" rx="7" fill="var(--brand)" />
    <rect x="7" y="8" width="5" height="16" rx="1.5" fill="#fff" />
    <rect x="13.5" y="8" width="5" height="11" rx="1.5" fill="#fff" opacity=".85" />
    <rect x="20" y="8" width="5" height="7" rx="1.5" fill="#fff" opacity=".7" />
  </svg>
);

const Logo = () => {
  return (
    <Link
      to="/board"
      className="flex min-h-11 items-center gap-2 rounded-control px-1.5 text-[15px] font-semibold text-ink-700 hover:bg-neutral md:min-h-9"
    >
      <LogoMark />
      <span>{SITE_NAME}</span>
    </Link>
  );
};

export default Logo;

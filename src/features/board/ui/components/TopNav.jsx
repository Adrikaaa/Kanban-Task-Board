import { Plus } from "lucide-react";
import Button from "../../../../shared/ui/components/Button";
import Logo from "../../../../shared/ui/components/Logo";
import { useBoard } from "../../hooks/useBoard";

// Global bar: product name on the left, Create on the right (like Jira's top nav).
const TopNav = () => {
  let { openCreate } = useBoard();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 md:px-4">
      <Logo />
      <span aria-hidden="true" className="hidden h-6 w-px bg-line sm:block" />
      <p className="hidden text-sm text-ink-500 sm:block">Plan, track and finish your work</p>
      <Button
        variant="primary"
        onClick={() => openCreate()}
        icon={<Plus size={16} strokeWidth={2.5} aria-hidden="true" />}
        className="ml-auto"
        aria-keyshortcuts="c"
        title="Create task (C)"
      >
        Create
      </Button>
    </header>
  );
};

export default TopNav;

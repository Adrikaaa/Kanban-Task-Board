import { Outlet } from "react-router";
import { useBoard } from "../../features/board/hooks/useBoard";
import BoardProvider from "../../features/board/state/BoardProvider";
import ProjectHeader from "../../features/board/ui/components/ProjectHeader";
import TopNav from "../../features/board/ui/components/TopNav";
import DeleteTaskDialog from "../../features/tasks/ui/components/DeleteTaskDialog";
import TaskDialog from "../../features/tasks/ui/components/TaskDialog";
import { useShortcut } from "../../shared/hooks/useShortcut";
import Toast from "../../shared/ui/components/Toast";

// Phones scroll the page; from `md` up the app fills the viewport and columns scroll on their own.
const Shell = () => {
  let { toast, dismissToast, openCreate, focusSearch } = useBoard();

  useShortcut("c", () => openCreate());
  useShortcut("/", focusSearch);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas md:h-dvh">
      <TopNav />
      <main className="flex flex-1 flex-col md:min-h-0">
        <ProjectHeader />
        <Outlet />
      </main>
      <TaskDialog />
      <DeleteTaskDialog />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

const AppLayout = () => {
  return (
    <BoardProvider>
      <Shell />
    </BoardProvider>
  );
};

export default AppLayout;

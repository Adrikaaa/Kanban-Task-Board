import { useEffect } from "react";
import { useDocumentTitle } from "../../../../shared/hooks/useDocumentTitle";
import TaskTable from "../../../tasks/ui/components/TaskTable";
import { useBoard } from "../../hooks/useBoard";
import { BoardEmpty, NoResults } from "../components/BoardStates";
import FilterBar from "../components/FilterBar";

const ListPage = () => {
  let { tasks, visible, focusTaskRef } = useBoard();
  useDocumentTitle("List");

  // Rows don't remount when their status changes, so a pending card focus
  // must not carry over to the board view.
  useEffect(() => () => {
    focusTaskRef.current = null;
  }, [focusTaskRef]);

  if (tasks.length === 0) return <BoardEmpty />;

  return (
    <>
      <FilterBar />
      <div className="thin-scroll flex-1 px-4 pb-6 md:min-h-0 md:overflow-y-auto md:px-6">
        {visible.length === 0 ? <NoResults /> : <TaskTable tasks={visible} />}
      </div>
    </>
  );
};

export default ListPage;

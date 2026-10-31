import { useDocumentTitle } from "../../../../shared/hooks/useDocumentTitle";
import { useBoard } from "../../hooks/useBoard";
import { BoardEmpty, NoResults } from "../components/BoardStates";
import FilterBar from "../components/FilterBar";
import KanbanBoard from "../components/KanbanBoard";

const BoardPage = () => {
  let { tasks, visible } = useBoard();
  useDocumentTitle("Board");

  if (tasks.length === 0) return <BoardEmpty />;

  return (
    <>
      <FilterBar />
      {visible.length === 0 ? <NoResults /> : <KanbanBoard />}
    </>
  );
};

export default BoardPage;

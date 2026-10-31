import { TriangleAlert } from "lucide-react";
import { useRef } from "react";
import Button from "../../../../shared/ui/components/Button";
import Modal from "../../../../shared/ui/components/Modal";
import { useBoard } from "../../../board/hooks/useBoard";
import { taskKey } from "../../utils/selectors";

// Cancel gets initial focus so a stray Enter never deletes anything.
const DeleteTaskDialog = () => {
  let { deleting, cancelDelete, confirmDelete } = useBoard();
  let cancelRef = useRef(null);

  return (
    <Modal open={Boolean(deleting)} onClose={cancelDelete} labelledBy="delete-task-title" initialFocusRef={cancelRef}>
      {deleting && (
        <div className="p-5 md:p-6">
          <h2 id="delete-task-title" className="flex items-center gap-2 text-lg font-semibold text-ink">
            <TriangleAlert size={20} aria-hidden="true" className="text-danger" />
            Delete {taskKey(deleting)}?
          </h2>
          <p className="mt-3 text-ink-700">
            <span className="font-semibold text-ink">"{deleting.title}"</span> will be permanently
            deleted. You can't undo this.
          </p>
          <div className="mt-6 flex justify-end gap-2 pb-[env(safe-area-inset-bottom)]">
            <Button ref={cancelRef} variant="subtle" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteTaskDialog;

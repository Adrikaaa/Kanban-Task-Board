import { ArrowRight, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { STATUSES, STATUS_LABELS } from "../../../../app/constants/taskOptions";
import IconButton from "../../../../shared/ui/components/IconButton";
import Menu, { MenuDivider, MenuItem, MenuLabel } from "../../../../shared/ui/components/Menu";
import { useBoard } from "../../../board/hooks/useBoard";
import { taskKey } from "../../utils/selectors";

// "..." actions on a card or row. "Move to" is the keyboard and touch
// alternative to dragging a card between columns.
const TaskMenu = ({ task, tone = "card", className = "" }) => {
  let { openEdit, changeStatus, requestDelete } = useBoard();

  return (
    <Menu
      align="end"
      button={(props) => (
        <IconButton
          {...props}
          label={`Actions for ${taskKey(task)}`}
          tone={tone}
          icon={<Ellipsis size={16} aria-hidden="true" />}
          className={className}
        />
      )}
    >
      <MenuItem icon={<Pencil size={16} aria-hidden="true" className="text-ink-500" />} onSelect={() => openEdit(task.id)}>
        Edit
      </MenuItem>
      <MenuDivider />
      <MenuLabel>Move to</MenuLabel>
      {STATUSES.filter((s) => s !== task.status).map((status) => (
        <MenuItem
          key={status}
          icon={<ArrowRight size={16} aria-hidden="true" className="text-ink-500" />}
          onSelect={() => changeStatus(task.id, status)}
        >
          {STATUS_LABELS[status]}
        </MenuItem>
      ))}
      <MenuDivider />
      <MenuItem tone="danger" icon={<Trash2 size={16} aria-hidden="true" />} onSelect={() => requestDelete(task.id)}>
        Delete
      </MenuItem>
    </Menu>
  );
};

export default TaskMenu;

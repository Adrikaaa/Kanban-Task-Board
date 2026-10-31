import { ChevronDown } from "lucide-react";
import Button from "../../../../shared/ui/components/Button";
import Menu, { MenuItem } from "../../../../shared/ui/components/Menu";

// Jira-style filter dropdown: grey when unset, blue with the chosen value when set.
const FilterMenu = ({ label, value, options, onChange }) => {
  let active = value !== "all";
  let selected = options.find((o) => o.value === value);

  return (
    <Menu
      className="w-52"
      button={(props) => (
        <Button
          {...props}
          variant={active ? "selected" : "default"}
          trailingIcon={<ChevronDown size={16} aria-hidden="true" />}
          aria-label={active ? `${label}: ${selected.label}` : `${label}: any`}
        >
          {active ? (
            <>
              <span className="hidden sm:inline">{label}:</span> {selected.label}
            </>
          ) : (
            label
          )}
        </Button>
      )}
    >
      <MenuItem checked={value === "all"} onSelect={() => onChange("all")}>
        Any {label.toLowerCase()}
      </MenuItem>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          checked={value === option.value}
          icon={option.icon}
          onSelect={() => onChange(option.value)}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default FilterMenu;

import { Link } from "react-router";

const variants = {
  // Jira blue: Create, Save. One per view.
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed",
  // Grey "default" button: filters, Cancel.
  default: "bg-neutral text-ink-700 hover:bg-neutral-hover hover:text-ink",
  // Selected filter / active toggle.
  selected: "bg-brand-subtle text-brand-hover hover:bg-progress",
  subtle: "text-ink-700 hover:bg-neutral hover:text-ink",
  danger: "bg-danger text-white hover:bg-danger-hover",
};

const sizes = {
  sm: "min-h-11 px-2.5 text-sm md:min-h-8",
  md: "min-h-11 px-3 text-sm md:min-h-9",
};

let classes = (variant, size, className) =>
  `inline-flex items-center justify-center gap-1.5 rounded-control font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;

// Renders a router Link when `to` is set, otherwise a button. `ref` is passed through.
const Button = ({
  children,
  icon,
  trailingIcon,
  variant = "default",
  size = "md",
  type = "button",
  to,
  className = "",
  ...props
}) => {
  let content = (
    <>
      {icon}
      {children}
      {trailingIcon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes(variant, size, className)} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes(variant, size, className)} {...props}>
      {content}
    </button>
  );
};

export default Button;

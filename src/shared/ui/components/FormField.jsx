import { ChevronDown } from "lucide-react";

let borderClass = (hasError) =>
  hasError
    ? "border-danger bg-danger-subtle/40"
    : "border-line-strong/60 hover:bg-surface-hover focus:bg-surface";

const controlBase =
  "w-full rounded-control border-2 bg-surface text-base text-ink placeholder:text-ink-500 transition-colors focus:border-brand focus:shadow-none md:text-sm";

// Label above, control, then hint or error underneath.
const Field = ({ id, label, required, hint, error, counter, children }) => {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-ink-700">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          )}
        </label>
        {counter && <span className="text-xs text-ink-500 tabular-nums">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-danger-text">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

let describedBy = (id, { error, hint }) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export const TextField = ({ id, label, required, hint, error, counter, inputRef, ...props }) => {
  return (
    <Field {...{ id, label, required, hint, error, counter }}>
      <input
        id={id}
        ref={inputRef}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error, hint })}
        className={`${controlBase} ${borderClass(error)} h-11 px-2.5 md:h-10`}
        {...props}
      />
    </Field>
  );
};

export const TextAreaField = ({ id, label, required, hint, error, counter, ...props }) => {
  return (
    <Field {...{ id, label, required, hint, error, counter }}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error, hint })}
        className={`${controlBase} ${borderClass(error)} min-h-[112px] resize-y px-2.5 py-2`}
        {...props}
      />
    </Field>
  );
};

// Native select with a custom chevron. `options` is a list of {value, label}.
export const SelectField = ({ id, label, required, error, options, ...props }) => {
  return (
    <Field {...{ id, label, required, error }}>
      <div className="relative min-w-0">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { error })}
          className={`${controlBase} ${borderClass(error)} h-11 appearance-none pr-9 pl-2.5 md:h-10`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-500"
        />
      </div>
    </Field>
  );
};

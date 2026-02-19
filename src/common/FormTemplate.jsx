import React from "react";

/* ==========================
   INPUT
========================== */
export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  name,
  className = "form-input",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      className={className}
    />
  );
};

/* ==========================
   TEXTAREA
========================== */
export const TextArea = ({
  value,
  onChange,
  placeholder,
  name,
  className = "form-textarea",
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      className={className}
    />
  );
};

/* ==========================
   SELECT
========================== */
export const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  name,
  className = "form-input",
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      name={name}
      className={className}
    >
      <option value="">{placeholder}</option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

/* ==========================
   CHECKBOX
========================== */
export const Checkbox = ({
  checked,
  onChange,
  label,
  name,
  className = "checkbox-row",
}) => {
  return (
    <label className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
      />
      {label}
    </label>
  );
};

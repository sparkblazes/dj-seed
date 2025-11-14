import React, { useEffect, useState, useCallback } from "react";

interface DynamicDropdownProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  required?: boolean;
  fetchData: (search: string) => Promise<{ _id: string; name: string }[]>; // async fetch function
  debounceTime?: number; // optional debounce time in ms
}

const DynamicDropdown: React.FC<DynamicDropdownProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder = "Select an option",
  isLoading = false,
  className = "form-select",
  required = false,
  fetchData,
  debounceTime = 300,
}) => {
  const [options, setOptions] = useState<{ _id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeout: number | undefined;
    return (...args: any) => {
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), delay);
    };
  };

  const loadOptions = useCallback(
    async (search: string) => {
      setLoading(true);
      try {
        const result = await fetchData(search);
        if (Array.isArray(result)) setOptions(result);
      } catch (err) {
        console.error("Failed to fetch options:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const debouncedLoadOptions = useCallback(
    debounce(loadOptions, debounceTime),
    [loadOptions, debounceTime]
  );

  // initial load and search
  useEffect(() => {
    debouncedLoadOptions(searchTerm);
  }, [searchTerm, debouncedLoadOptions]);

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-2"
        placeholder={`Search ${label || "options"}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
      />

      <select
        name={name}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || isLoading}
        required={required}
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {options.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicDropdown;

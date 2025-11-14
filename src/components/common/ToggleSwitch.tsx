interface ToggleSwitchProps {
  id: string;
  label?: string;
  checked: boolean; // ✅ boolean
  onChange: (checked: boolean) => void; // ✅ passes boolean
  onText?: string;
  offText?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  onText = "On",
  offText = "Off",
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label small d-block mb-2" htmlFor={id}>
          {label}
        </label>
      )}

      <label className="switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)} // ✅ always boolean
        />
        <span className="slider round"></span>
      </label>

      <div className="mt-1 small text-muted">
        {checked ? onText : offText}
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: #0d6efd; }
        input:checked + .slider:before { transform: translateX(22px); }
        .slider.round { border-radius: 24px; }
      `}</style>
    </div>
  );
};

export default ToggleSwitch;
export default function CustomInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border px-4 py-3 rounded-md text-black"
    />
  );
}

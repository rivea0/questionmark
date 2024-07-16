export default function URLInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (x: { target: { value: string } }) => void;
}) {
  return (
    <div className="url-input">
      <input
        type="url"
        placeholder="https://example.com"
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}

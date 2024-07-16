export default function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (x: { target: { value: string } }) => void;
}) {
  return (
    <div className="textarea">
      <textarea
        value={value}
        rows={3}
        onChange={onChange}
        placeholder="Enter text"
        required
      ></textarea>
    </div>
  );
}

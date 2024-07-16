export default function QuestionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (x: { target: { value: string } }) => void;
}) {
  return (
    <div className="question-input">
      <input
        type="text"
        placeholder="What is going on?"
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}

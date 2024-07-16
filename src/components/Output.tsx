import AnswerSvg from './AnswerSvg';

export default function Output({
  result,
  score,
}: {
  result: string;
  score: number | null;
}) {
  return (
    <div className="output-container">
      <div className="output">
        <AnswerSvg />
        {typeof result === 'string' && <p>{result ? result : '...'}</p>}
        {score && (
          <p style={{ color: 'gray' }} data-testid="score">
            <em>Score: </em>
            {score?.toFixed(3)}
          </p>
        )}
      </div>
    </div>
  );
}

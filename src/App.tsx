import { useEffect, useRef, useState, MouseEvent } from 'react';
import URLInput from './components/URLInput';
import TextInput from './components/TextInput';
import QuestionInput from './components/QuestionInput';
import Progress from './components/Progress';
import Output from './components/Output';
import Footer from './components/Footer';
import { getHTMLContent, sanitizeStr } from './utils';
import { Readability } from '@mozilla/readability';
import './App.css';

type DataType = {
  status: 'initiate' | 'progress' | 'done' | 'ready' | 'complete';
  file: string;
  progress: number;
  output: {
    answer: string;
    score: number;
  };
};

function App() {
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);
  // Model loading
  const [ready, setReady] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [progressItems, setProgressItems] = useState<DataType[]>([]);

  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState('url');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState<null | number>(null);

  const aboutRef = useRef<HTMLDivElement | null>(null);

  function handleAboutClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module',
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: { data: DataType }) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'complete':
          // Generation complete: re-enable the "Find answer" button
          setDisabled(false);
          setOutput(e.data.output.answer);
          setScore(e.data.output.score);
          break;
      }
    };
    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current?.removeEventListener('message', onMessageReceived);
  });

  const answer = async () => {
    setDisabled(true);
    if (mode === 'url') {
      const htmlContent = await getHTMLContent(urlInput);
      // TODO: Better handling of none htmlContent
      if (!htmlContent) {
        setOutput('Content cannot be retrieved');
        setDisabled(false);
        return;
      }
      // Create a document from the html string for Readability
      const template = document.createElement('template');
      const body = document.createElement('body');
      template.innerHTML = htmlContent;
      body.appendChild(template.content);
      const doc = document.implementation.createHTMLDocument();
      doc.body = body;
      const article = new Readability(doc).parse();
      if (article === null) {
        setOutput('Article cannot be parsed');
        return;
      }

      worker.current?.postMessage({
        content: article.textContent,
        question: sanitizeStr(question),
      });
    } else if (mode === 'text') {
      worker.current?.postMessage({
        content: sanitizeStr(textInput),
        question: sanitizeStr(question),
      });
    }
  };

  return (
    <>
      <h1 className="h1">
        Question Mark
        <span className="qmark-span">
          &nbsp;
          <a href="#about" onClick={handleAboutClick}>
            (?)
          </a>
        </span>
      </h1>
      <h2>
        <em>Try to</em> find an answer.
      </h2>
      <div className="container">
        <div className="tabs">
          <button
            className={mode === 'url' ? 'active-btn' : ''}
            onClick={() => {
              setMode('url');
              setTextInput('');
              setOutput('');
              setScore(null);
              setQuestion('');
            }}
          >
            FROM URL
          </button>
          <button
            className={mode === 'text' ? 'active-btn' : ''}
            onClick={() => {
              setMode('text');
              setUrlInput('');
              setOutput('');
              setScore(null);
              setQuestion('');
            }}
          >
            FROM TEXT
          </button>
        </div>
        <div className="inputs">
          {mode === 'url' && (
            <div className="url-container">
              <URLInput
                onChange={(x) => setUrlInput(x.target.value)}
                value={urlInput}
              />
              <QuestionInput
                onChange={(x) => setQuestion(x.target.value)}
                value={question}
              />
            </div>
          )}

          {mode === 'text' && (
            <div className="text-container">
              <TextInput
                onChange={(x) => setTextInput(x.target.value)}
                value={textInput}
              />
              <QuestionInput
                onChange={(x) => setQuestion(x.target.value)}
                value={question}
              />
            </div>
          )}
        </div>
      </div>
      <button disabled={disabled} onClick={answer}>
        Find answer
      </button>
      <Output result={output} score={score} />
      <div className="progress-bars-container">
        {ready === false && (
          <label>Loading models... This might take a while.</label>
        )}
        {progressItems.map((data) => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
      <div ref={aboutRef} className="about">
        <p>
          QuestionMark uses HuggingFace's{' '}
          <a href="https://huggingface.co/docs/transformers.js">
            <code>transformers.js</code>
          </a>{' '}
          under the hood.
        </p>
        <p>
          The pretrained question-answering model{' '}
          <a href="https://huggingface.co/Xenova/distilbert-base-cased-distilled-squad">
            Xenova/distilbert-base-cased-distilled-squad
          </a>{' '}
          is used to retrieve the answer to a question from the context obtained
          from a URL or text.
        </p>
        <p>The model is loaded and run directly in the browser.</p>
        <p>
          <b>
            Note that the answer is not generated but extracted from the
            context.
          </b>
        </p>
        <br />
        <p>
          <a href="https://github.com/rivea0/questionmark">View source</a>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default App;

<img src="./public/questionmark.svg" width="80px" />

## QuestionMark

> Retrieve an answer to a question given the context of a webpage or text, using a pretrained machine learning model that runs in the browser.

QuestionMark uses HuggingFace's [Transformers.js](https://huggingface.co/docs/transformers.js) under the hood.

The question-answering model [Xenova/distilbert-base-cased-distilled-squad](https://huggingface.co/Xenova/distilbert-base-cased-distilled-squad) is used to retrieve the answer.

Note that it is an *extractive question-answering* model, so the answer is not generated but extracted from the given context. Therefore, it tends to be [better with factoid questions instead of open-ended ones](https://huggingface.co/learn/nlp-course/chapter7/7#question-answering).
A confidence score for the predicted answer is shown along with the resulting answer.

The model is loaded and run directly in the browser in a separate thread from the main thread, using a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

> [!IMPORTANT]  
> For now, the models have to be re-downloaded on each HMR reload instead of loading from browser cache because of an issue that seems to be occurring with bundlers, which [may be fixed in Transformers.js V3](https://github.com/xenova/transformers.js/pull/545).
>
> See: https://github.com/xenova/transformers.js/issues/366.

### From URL
From a given URL, the HTML string of a website is first sanitized using [`isomorphic-dompurify`](https://github.com/kkomelin/isomorphic-dompurify), then the text content is parsed with [`Mozilla's Readability.js`](https://github.com/mozilla/readability). The result is the context of the question the user provides, both of which are passed as arguments to the [`QuestionAnsweringPipeline`](https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.QuestionAnsweringPipeline).


### From Text
A given text is first sanitized using [`isomorphic-dompurify`](https://github.com/kkomelin/isomorphic-dompurify) which is the context of the question the user provides, both of which are passed as arguments to the [`QuestionAnsweringPipeline`](https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.QuestionAnsweringPipeline).

### To run locally:

Clone the repository:

```
git clone git@github.com:rivea0/questionmark.git
```

`cd` into it:

```
cd questionmark
```

Install dependencies:

```
npm install
```

Run the server:

```
npm run dev
```

#### License
MIT

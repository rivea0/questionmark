import { pipeline, env } from '@xenova/transformers';
// This is a workaround for an issue that seems to occur with bundlers.
// The models are re-downloaded on each HMR reload (at least for now).
// See: https://github.com/xenova/transformers.js/issues/366
env.allowLocalModels = false;
env.useBrowserCache = false;

class MyAnswererPipeline {
  static task = 'question-answering';
  static model = 'Xenova/distilbert-base-cased-distilled-squad';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  // Retrieve the answerer pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const answerer = await MyAnswererPipeline.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  const output = await answerer(event.data.question, event.data.content);

  // Send the output back to the main thread
  self.postMessage({
    status: 'complete',
    output: output,
  });
});

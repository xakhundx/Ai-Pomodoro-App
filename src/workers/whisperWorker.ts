// Dedicated Web Worker for Off-Main-Thread Local Whisper Speech-to-Text
// Prevents any UI freezes on Microsoft Edge, Brave, Firefox, Chrome & Mobile.

interface TranscribeJob {
  id: number;
  audio: Float32Array;
  autoAdd: boolean;
}

let transcriber: any = null;
let loadingPromise: Promise<any> | null = null;
const jobQueue: TranscribeJob[] = [];
let isProcessing = false;

async function getTranscriber() {
  if (transcriber) return transcriber;
  if (loadingPromise) return loadingPromise;

  self.postMessage({ type: 'status', status: 'loading' });

  loadingPromise = (async () => {
    const transformersUrl = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
    const mod: any = await import(/* @vite-ignore */ transformersUrl);

    if (mod.env) {
      mod.env.allowLocalModels = false;
      mod.env.useBrowserCache = true;
      if (mod.env.backends?.onnx?.wasm) {
        mod.env.backends.onnx.wasm.numThreads = 1;
        mod.env.backends.onnx.wasm.proxy = false;
      }
    }

    const pipe = await mod.pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en',
      { quantized: true }
    );

    transcriber = pipe;
    self.postMessage({ type: 'status', status: 'ready' });
    return pipe;
  })().catch((err) => {
    loadingPromise = null;
    self.postMessage({
      type: 'status',
      status: 'error',
      message: err?.message || 'Failed to load speech engine',
    });
    throw err;
  });

  return loadingPromise;
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    while (jobQueue.length > 0) {
      const job = jobQueue.shift()!;
      try {
        const pipe = await getTranscriber();

        // IMPORTANT: Xenova/whisper-tiny.en is an English-only (.en) model.
        // Do NOT pass { language, task } options or Transformers.js throws an error.
        const output = await pipe(job.audio);

        const rawText = (typeof output?.text === 'string' ? output.text : '')
          .replace(/\[.*?\]|\(.*?\)/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const isHallucinatedSilence =
          !rawText ||
          /^(you\.?|thank you\.?|thanks for watching\.?|\.+|-+)$/i.test(rawText);

        self.postMessage({
          type: 'result',
          id: job.id,
          text: isHallucinatedSilence ? '' : rawText,
          autoAdd: job.autoAdd,
        });
      } catch (err: any) {
        self.postMessage({
          type: 'error',
          id: job.id,
          message: err?.message || 'Transcription failed',
          autoAdd: job.autoAdd,
        });
      }
    }
  } finally {
    isProcessing = false;
  }
}

self.onmessage = (event: MessageEvent) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === 'preload') {
    void getTranscriber().catch(() => {});
    return;
  }

  if (data.type === 'transcribe' && data.audio instanceof Float32Array) {
    jobQueue.push({
      id: data.id,
      audio: data.audio,
      autoAdd: Boolean(data.autoAdd),
    });
    void processQueue();
  }
};

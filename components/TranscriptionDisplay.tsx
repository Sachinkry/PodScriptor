// components/TranscriptionDisplay.tsx
import clsx from 'clsx';
import Loader from '@/components/ui/Loader';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptionResult {
  utterances: Utterance[];
}


interface TranscriptionDisplayProps {
  file: File | null;
  transcript: string | TranscriptionResult | null;  
  status: string;
  error: string;
}

const formatTimestamp = (ms:number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const displayMinutes = minutes % 60;
  const displaySeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  } else {
    return `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }
};

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ file, transcript, status, error }) => {
  // Common container styles for all states
  const containerStyles = "w-full rounded-md p-3 flex flex-col justify-center  border-dashed border-2 min-h-96";

  return (
    <div className="mx-4 w-full max-w-4xl p-4">
      {file ? (
        <div
          className={clsx(
            containerStyles,
            error ? "border-red-500 bg-red-100" : "border-neutral-300 bg-neutral-100 dark:bg-neutral-700" // Conditional styling for error state
          )}
        >
          {transcript && !error ? (
            typeof transcript === 'string' ? (
              <span className="text-neutral-700 dark:text-neutral-200">{transcript}</span>
            ) : (
              transcript.utterances.map((utterance, index) => (
                <div 
                  key={index} 
                  className="text-neutral-700 dark:text-neutral-200 my-2"
                >
                  <strong className="text-sm">Speaker {utterance.speaker} </strong> <em className="ml-2 text-xs italic">{formatTimestamp(utterance.start)}</em>
                  <p className="text-sm">{utterance.text}</p>
                </div>
              ))
            )
          ) : (
            // Handle loading, status, and error display
            <>
              {status && !error && (
                <>
                  <Loader />
                  <span className="ml-2 capitalize text-neutral-700 dark:text-neutral-200">{status}...</span>
                </>
              )}
              {error && <span className="text-red-500">{error}</span>}
              {!status && !error && (
                <span className="text-neutral-700 dark:text-neutral-200">File "{file.name}" is ready for transcription</span>
              )}
            </>
          )}
        </div>
      ) : (
        // Default state when no file is selected
        <div 
          className={`${containerStyles} border-neutral-300 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-center`}
        >
          Transcripts will show here
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;

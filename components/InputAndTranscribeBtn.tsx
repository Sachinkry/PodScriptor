// components/InputAndTranscribe.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputAndTranscribeBtnProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTranscribeClick: () => void;
  isDisabled: boolean;
}

const InputAndTranscribeBtn: React.FC<InputAndTranscribeBtnProps> = ({ onFileChange, onTranscribeClick, isDisabled }) => {
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-4 px-4 sm:flex-row mt-4">
      <Input
        placeholder="Upload Audio File"
        className="flex-1 cursor-pointer bg-neutral-100 hover:bg-neutral-300 "
        type="file"
        onChange={onFileChange}
      />
      <Button 
        variant="default" 
        size="default"
        onClick={onTranscribeClick}
        disabled={isDisabled}
        className={`${
          isDisabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed" // for disabled state
            : "bg-blue-500 hover:bg-blue-700 text-white" // for default/enabled state
        }`}
      >
        Transcribe
      </Button>
    </div>
  );
};

export default InputAndTranscribeBtn;

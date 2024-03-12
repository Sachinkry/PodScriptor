// components/InputAndTranscribe.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputAndTranscribeBtnProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTranscribeClick: () => void;
}

const InputAndTranscribeBtn: React.FC<InputAndTranscribeBtnProps> = ({ onFileChange, onTranscribeClick }) => {
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
      >
        Transcribe
      </Button>
    </div>
  );
};

export default InputAndTranscribeBtn;

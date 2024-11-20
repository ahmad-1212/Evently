import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { convertFileToUrl } from '@/lib/utils';
import { Button } from '../ui/button';
import Image from 'next/image';

type FileUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

const FileUploader = ({
  onFieldChange,
  imageUrl,
  setFiles,
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return; // Prevent errors if no files are accepted
      setFiles(acceptedFiles);
      onFieldChange(convertFileToUrl(acceptedFiles[0]));
    },
    [onFieldChange, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
      aria-label="File uploader. Drag and drop an image here, or select from the computer."
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full justify-center">
          <Image
            src={imageUrl}
            alt="Uploaded preview"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">Supported formats: SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

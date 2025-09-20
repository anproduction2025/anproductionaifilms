// FIX: Removed extra file content markers from the original file.
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageGallery } from './components/ImageGallery';
import { GenerationMode, GenerationOptions } from './types';
import { generateNewImages, generateConsistentImages, generatePoseReferenceImages, generateSetupImages } from './services/geminiService';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (mode: GenerationMode, options: GenerationOptions) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      let images: string[] = [];
      if (mode === GenerationMode.New) {
        if (!options.prompt && !options.newReferenceImage && !options.newReferenceImage2) {
          throw new Error("Vui lòng nhập prompt hoặc tải lên ít nhất một ảnh tham chiếu.");
        }
        images = await generateNewImages(options);
      } else if (mode === GenerationMode.Consistency) {
        if (!options.referenceImage) {
          throw new Error("Vui lòng tải lên ảnh tham chiếu nhân vật để sử dụng tính năng này.");
        }
        images = await generateConsistentImages(options);
      } else if (mode === GenerationMode.PoseReference) {
        if (!options.referenceImage || !options.characterReferenceImage) {
          throw new Error("Vui lòng tải lên cả ảnh tham chiếu dáng và ảnh tham chiếu nhân vật.");
        }
        images = await generatePoseReferenceImages(options);
      } else if (mode === GenerationMode.Setup) {
         if (!options.sceneImage || !options.characterImages || options.characterImages.length === 0) {
          throw new Error("Vui lòng tải lên ít nhất một ảnh nhân vật và một ảnh bối cảnh.");
        }
        images = await generateSetupImages(options);
      }
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <ImageGallery images={generatedImages} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default App;
import { FC, useState, useCallback } from 'react';
import ModalCustom from '../Modal/ModalCustom';

interface ImageCardInterfaceProps {
    images: string[];
    alt: string;
}

const ImageCard: FC<ImageCardInterfaceProps> = ({ images, alt }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    return (
        <div>
            {images.map((src, index) => (
                <img
                    src={src}
                    onClick={() => openImageViewer(index)}
                    width="50"
                    height="50"
                    className="rounded-full cursor-pointer"
                    key={index}
                    style={{ margin: '2px' }}
                    alt={alt}
                />
            ))}
            
            <ModalCustom
                id={alt}
                title="Image"
                isOpen={isViewerOpen}
                onClose={() => closeImageViewer()}
                children={
                    <figure className="max-w-lg">
                    <img className="h-auto max-w-full rounded-lg"       src={images[currentImage]} 
                                          width="250"
                                          height="250"
                                          alt={alt}/>
                    <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Image caption</figcaption>
                  </figure>
                }
            />
        </div>
    );
};

export default ImageCard;

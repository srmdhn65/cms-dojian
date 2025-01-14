import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface CardImageProps {
    images: string[];
    preview?: boolean;
}

const CardImage: React.FC<CardImageProps> = ({ images, preview = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const handleImageClick = (image: string) => {
        if (preview) {
            setCurrentImage(image);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentImage(null);
    };

    return (
        <>
            <div className="d-flex flex-wrap">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="img-fluid rounded m-2"
                        style={{ width: "100px", height: "100px", cursor: preview ? "pointer" : "default" }}
                        onClick={() => handleImageClick(image)}
                    />
                ))}
            </div>

            {preview && currentImage && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Image Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="img-fluid"
                            style={{ maxHeight: "80vh" }}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default CardImage;

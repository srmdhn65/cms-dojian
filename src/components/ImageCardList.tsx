import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ImageCardListProps {
    images: string[]; // List of image URLs
    setImagesUrl: (images: string[]) => void; // Function to update the images array
}

const ImageCardList: React.FC<ImageCardListProps> = ({ images, setImagesUrl }) => {
    /**
     * Extracts the name from the last "/" in the URL.
     */
    const getFileNameFromURL = (url: string) => {
        return url.substring(url.lastIndexOf("/") + 1);
    };

    /**
     * Removes an image by index.
     */
    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImagesUrl(updatedImages);
    };

    return (
        <div className="image-card-list mt-3">
            {images.map((url, index) => (
                <Card className="mt-1 mb-0 shadow-none border" key={index}>
                    <div className="p-2">
                        <Row className="align-items-center">
                            <Col className="col-auto">
                                <img
                                    className="avatar-sm rounded bg-light"
                                    alt={getFileNameFromURL(url)}
                                    src={url}
                                />
                            </Col>
                            <Col className="ps-0">
                                <Link to="#" className="text-muted fw-bold">
                                    {getFileNameFromURL(url)}
                                </Link>
                            </Col>
                            <Col className="text-end">
                                <Link
                                    to="#"
                                    className="btn btn-link btn-lg text-muted shadow-none"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <i className="dripicons-cross"></i>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ImageCardList;

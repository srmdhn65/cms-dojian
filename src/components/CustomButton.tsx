import React from "react";
import { Button, Spinner } from "react-bootstrap";

interface CustomButtonProps {
    label: string; // Text to display on the button
    type?: "button" | "submit" | "reset"; // Button type
    color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"; // Bootstrap color variant
    loading?: boolean; // Show loading spinner
    disabled?: boolean; // Disable button
    onClick?: () => void; // Optional click handler
}

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    type = "button",
    color = "primary",
    loading = false,
    disabled = false,
    onClick,
}) => {
    return (
        <Button
            type={type}
            variant={color}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading && (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2" // Add spacing between spinner and label
                    />
                    Loading...
                </>
            )}
            {!loading && label}
        </Button>
    );
};

export default CustomButton;

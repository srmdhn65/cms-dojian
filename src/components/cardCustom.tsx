import classNames from 'classnames';
import { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Define the types for Card props
interface CardCustomProps {
    color: string;
    text: string;
    onDelete: () => void;
    isSelected: boolean;
    onSelect: (value: string) => void;
}

// CardCustom Component
const CardCustom: FC<CardCustomProps> = ({ color, text, onDelete, isSelected, onSelect }) => {
    return (
        <div className="relative flex items-center justify-center w-40 h-48 rounded-lg text-center cursor-pointer">
            <Card
                className={classNames("text-white", "text-xs-center", [
                    `bg-${color} bg-opacity-50`, // Transparent background
                ])}
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }} // Optional: Add a subtle border
            >
                <Card.Body>
                    <Card.Text>
                        <input
                            className="bg-transparent text-center w-full rtext-lg font-medium text-white border border-transparent focus:border-white focus:ring-0"
                            placeholder="Type answer option here"
                            defaultValue={text}
                            onChange={(e) => {
                                onSelect(e.target.value);
                            }}
                        />
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* Delete Icon */}
            <Button variant="danger"
                className='mr-2'
                onClick={onDelete}
                type='button'
            >
                <i className="mdi mdi-delete"></i>
            </Button>


            {/* Select Icon */}
            <Button variant="success"
                className='ml-2'
                onClick={() => onSelect(text)}
                type='button'
            >
                {isSelected ? (
                    <i className="mdi mdi-check-circle"></i>
                ) : (
                    <i className="mdi mdi-circle-outline"></i>
                )}
            </Button>
        </div>
    );
};

export default CardCustom;

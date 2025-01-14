const isBase64Image = (image: string): boolean => {
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    return base64Pattern.test(image);
};

const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export { isBase64Image, convertToBase64 };
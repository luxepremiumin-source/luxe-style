/**
 * Compresses an image file using the browser's Canvas API.
 * @param file The original file
 * @param quality JPEG quality (0 to 1)
 * @param maxWidth Maximum width of the output image
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(file: File, quality = 0.8, maxWidth = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob/file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new file with the same name but jpeg extension/type
            // We use jpeg for better compression of photos
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const newFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
  });
}

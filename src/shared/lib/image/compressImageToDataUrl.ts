/**
 * Сжимает изображение до JPEG data URL для отправки в теле сообщения (ограничение БД).
 */
export async function compressImageToDataUrl(
	file: File,
	maxWidth = 960,
	quality = 0.82,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(url);
			let { width, height } = img;
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas unsupported'));
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', quality));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load image'));
		};
		img.src = url;
	});
}

export function isDataImageContent(content: string | undefined): boolean {
	return (
		typeof content === 'string' &&
		content.startsWith('data:image/') &&
		content.length < 2_500_000
	);
}

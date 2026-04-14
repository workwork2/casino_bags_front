import type { NextConfig } from 'next';
import path from 'path';

const sassOptions = {
	includePaths: [path.join(process.cwd(), 'styles')],
	prependData: "@use '@/shared/styles/main' as *;",
};

const nextConfig: NextConfig = {
	reactStrictMode: false,
	reactCompiler: true,
	typescript: { ignoreBuildErrors: true },
	sassOptions: {
		...sassOptions,
	},
	images: {																					
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'http',
				hostname: 'localhost', 
				pathname: '/currenciesIcons/**', 
			},
			{
				protocol: 'https',
				hostname: 'static.cdneu-stat.com',
			},
            // ДОБАВЛЕНО СЮДА: Разрешаем тестовые картинки с picsum.photos
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
		],
	},
};

export default nextConfig;
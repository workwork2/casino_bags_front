'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './LoyaltyCarousel.module.scss';
import StatusCard from '../StatusCard/StatusCard';

type EmblaApi = NonNullable<
	ReturnType<typeof useEmblaCarousel>[1]
>;

export default function LoyaltyCarousel({ levels }: { levels: any[] }) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'start',
		loop: false,
		slidesToScroll: 1,
		containScroll: 'trimSnaps',
	});
	const [api, setApi] = useState<EmblaApi | null>(null);

	useEffect(() => {
		setApi(emblaApi);
	}, [emblaApi]);

	const handlePrev = useCallback(() => api?.scrollPrev(), [api]);
	const handleNext = useCallback(() => api?.scrollNext(), [api]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.controls}>
					<button type='button' onClick={handlePrev} className={styles.btn}>
						←
					</button>
					<button type='button' onClick={handleNext} className={styles.btn}>
						→
					</button>
				</div>
			</div>

			<div className={styles.carouselRoot} ref={emblaRef}>
				<div className={styles.emblaContainer}>
					{levels.map((level, idx) => (
						<div className={styles.carouselSlide} key={idx}>
							<StatusCard {...level} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

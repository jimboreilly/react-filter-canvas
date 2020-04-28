import React, { useState, useEffect, useRef } from 'react';

const FilteredCanvas = ({ imageRef }) => {
	const canvas = useRef(null);

	const [imageData, setImageData] = useState();

	useEffect(() => {
		const current = canvas.current;
		const context = current.getContext('2d')

		const image = imageRef.current

		image.onload = function () {
			current.width = image.width;
			current.height = image.height;
			context.drawImage(image, 0, 0)
			setImageData(context.getImageData(0, 0, current.width, current.height))
		}
	}, [])


	return (
		<div>
			<canvas id="test" ref={canvas}></canvas>
		</div >
	)
}


export default FilteredCanvas;
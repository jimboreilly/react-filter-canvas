import React, { useState, useEffect, useRef } from 'react';

const FilteredCanvas = ({ imageRef }) => {
	const canvas = useRef(null);

	const [imageData, setImageData] = useState(new Uint8ClampedArray());
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const currentCanvas = canvas.current;
		const context = currentCanvas.getContext('2d')

		const image = imageRef.current

		image.onload = function () {
			currentCanvas.width = image.width;
			currentCanvas.height = image.height;
			context.drawImage(image, 0, 0)
			setImageData(context.getImageData(0, 0, currentCanvas.width, currentCanvas.height).data)
			setWidth(currentCanvas.width);
			setHeight(currentCanvas.height);
			console.log(imageData)
			console.log(context.getImageData(0, 0, currentCanvas.width, currentCanvas.height).data)
		}
	}, [])


	const getPixelStartIndex = (x, y) => y * (width * 4) + x * 4;

	const getRGBForCoordinate = (x, y) => {
		const redIndex = getPixelStartIndex(x, y)
		return {
			red: imageData[redIndex],
			green: imageData[redIndex + 1],
			blue: imageData[redIndex + 2],
			alpha: imageData[redIndex + 3],
		}
	}

	const rgbToGray = (data) => {
		const gray = Math.floor((data.red + data.green + data.blue) / 3)
		return {
			red: gray,
			green: gray,
			blue: gray,
			alpha: data.alpha
		}
	}

	const draw = () => {
		const currentCanvas = canvas.current;
		const context = currentCanvas.getContext('2d')

		const newImageData = Uint8ClampedArray.from(imageData)

		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				const redIndex = getPixelStartIndex(i, j);
				const gray = rgbToGray(getRGBForCoordinate(i, j))
				newImageData[redIndex] = gray.red;
				newImageData[redIndex + 1] = gray.green;
				newImageData[redIndex + 2] = gray.blue;
				newImageData[redIndex + 3] = gray.alpha;
			}
		}

		setImageData(newImageData)
		context.putImageData(new ImageData(newImageData, width, height), 0, 0)
	}

	return (
		<div>
			<canvas id="test" ref={canvas} onClick={() => draw()}></canvas>
		</div >
	)
}


export default FilteredCanvas;
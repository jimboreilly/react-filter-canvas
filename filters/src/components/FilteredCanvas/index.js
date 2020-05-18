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

		image.onload = () => {
			currentCanvas.width = image.width;
			currentCanvas.height = image.height;
			context.drawImage(image, 0, 0)
			setImageData(context.getImageData(0, 0, currentCanvas.width, currentCanvas.height).data)
			setWidth(currentCanvas.width);
			setHeight(currentCanvas.height);
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

	const getConvulotionAreaAboutAnchor = (x, y) => {
		const anchor = getPixelStartIndex(x, y)
		return [
			[anchor - (width * 4) - 4, anchor - (width * 4), anchor - (width * 4) + 4],
			[anchor - 4, anchor, anchor + 4],
			[anchor + (width * 4) - 4, anchor + (width * 4), anchor + (width * 4) + 4]
		]
	}

	const convolveAboutAnchor = (row, column, kernal) => {
		const neighborhood = getConvulotionAreaAboutAnchor(row, column);
		return (kernal[0][0] * imageData[neighborhood[0][0]]) +
			(kernal[0][1] * imageData[neighborhood[0][1]]) +
			(kernal[0][2] * imageData[neighborhood[0][2]]) +
			(kernal[1][0] * imageData[neighborhood[1][0]]) +
			(kernal[1][1] * imageData[neighborhood[1][1]]) +
			(kernal[1][2] * imageData[neighborhood[1][2]]) +
			(kernal[2][0] * imageData[neighborhood[2][0]]) +
			(kernal[2][1] * imageData[neighborhood[2][1]]) +
			(kernal[2][2] * imageData[neighborhood[2][2]])
	}

	const sobelX = [
		[1, 0, -1],
		[2, 0, -2],
		[1, 0, -1]
	]

	const sobelY = [
		[1, 2, 1],
		[0, 0, 0],
		[-1, -2, -1]
	]

	const sobel = (i, j) => {
		const Gx = convolveAboutAnchor(i, j, sobelX);
		const Gy = convolveAboutAnchor(i, j, sobelY);

		return 255 - Math.sqrt(Math.pow(Gx, 2) + Math.pow(Gy, 2))
	}

	const smoothKernal = [
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1]
	]

	const smooth = (i, j) => {
		return convolveAboutAnchor(i, j, smoothKernal) / 9;
	}

	const identityKernal = [
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0]
	]
	const doubleOriginalKernal = [
		[0, 0, 0],
		[0, 2, 0],
		[0, 0, 0]
	]

	const sharpen = (i, j) => {
		const doubleOriginal = convolveAboutAnchor(i, j, doubleOriginalKernal);
		const smoothed = smooth(i, j)
		return doubleOriginal - smoothed;
	}

	const convolve = (transformation) => {
		const currentCanvas = canvas.current;
		const context = currentCanvas.getContext('2d')

		const newImageData = Uint8ClampedArray.from(imageData)

		for (var i = 1; i < (width - 1); i++) {
			for (var j = 1; j < (height - 1); j++) {
				const G = transformation(i, j);
				const redIndex = getPixelStartIndex(i, j);
				newImageData[redIndex] = G;
				newImageData[redIndex + 1] = G;
				newImageData[redIndex + 2] = G;
			}
		}

		setImageData(newImageData)
		context.putImageData(new ImageData(newImageData, width, height), 0, 0)
	}

	const reset = () => {
		const currentCanvas = canvas.current;
		const context = currentCanvas.getContext('2d')

		const image = imageRef.current

		currentCanvas.width = image.width;
		currentCanvas.height = image.height;
		context.drawImage(image, 0, 0)
		setImageData(context.getImageData(0, 0, width, height).data)
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
			<div>
				<button onClick={() => reset()}>Reset</button>
				<span> | </span>
				<button onClick={() => draw()}>Grayscale</button>
				<button onClick={() => convolve(sobel)}>Sobel</button>
				<button onClick={() => convolve(smooth)}>Smooth</button>
				<button onClick={() => convolve(sharpen)}>Sharpen</button>
			</div>
			<canvas id="filtered" ref={canvas}></canvas>
		</div >
	)
}


export default FilteredCanvas;
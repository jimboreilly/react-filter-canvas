import React, { useState, useEffect, useRef } from 'react';

const FilteredCanvas = ({ src }) => {
	const canvas = useRef(null);

	const test = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"

	useEffect(() => {
		const current = canvas.current;
		const context = current.getContext('2d')
		const img = new Image();
		img.src = test
		img.onload = function () {
			current.width = img.width;
			current.height = img.height;
			context.drawImage(img, 0, 0)
		}
	})


	return (
		<div>
			<canvas id="test" ref={canvas}></canvas>
		</div >
	)
}


export default FilteredCanvas;
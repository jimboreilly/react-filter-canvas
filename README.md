# react-filter-canvas
In the past, I have written a lot of image processing code using various filters in both C++ and C#. Thinking about how DOM manipulation works (or doesn't) in React, I thought it would be interesting to try some of the same pixel calculations.

WIP...

Filters are applied hackily via putImageData on the `onClick`

All processing algorithms are naively assuming they're operating on a greyscale image, or that `R == G == B`

Convolution requires the neighboring values of a particular pixel, which if performed on the image boundary would require pixels outside of the image. Right now I am just ignoring the edges (similar to cropping).
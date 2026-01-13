# Particle Analysis

Our particle analysis module uses a customized Mask R-CNN network optimized for spherical and irregular particles.

## Features

1.  **Segmentation**: Pixel-perfect masking of individual particles.
2.  **Sphericity Calculation**: Automated shape factor analysis.
3.  **D10/D50/D90**: Statistical distribution metrics calculated automatically.


## Example Analysis

Here is a comparison of the raw input image and the detected result. Hover over the image to see the detection mask.

```hover-image
{
  "original": "/docs/core-concepts/particle-analysis/img/original.svg",
  "result": "/docs/core-concepts/particle-analysis/img/result.svg",
  "alt": "Particle Analysis Comparison"
}
```

| Metric | Description |
| :--- | :--- |
| **D50** | Median particle diameter |
| **Circularity** | Measure of how close the shape is to a perfect circle (0-1) |

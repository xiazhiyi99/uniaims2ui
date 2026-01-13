# Irregular Particle Mode

This mode employs a Mask R-CNN deep learning model to segment particles with arbitrary shapes.

## Capabilities
*    Handles overlapping particles via instance segmentation.
*    Calculates shape descriptors like aspect ratio, solidity, and circularity.

## Performance
*   **Inference Time**: ~200ms per image (on GPU).
*   **Accuracy**: >95% IoU on standard datasets.

## Example

```hover-image
{
  "original": "/docs/core-concepts/particle-analysis/irregular/img/original.svg",
  "result": "/docs/core-concepts/particle-analysis/irregular/img/result.svg",
  "alt": "Irregular Analysis Result"
}
```

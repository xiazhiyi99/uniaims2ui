# Spherical Particle Mode

This mode is optimized for perfectly spherical particles, such as silica nanospheres or standard calibration beads.

## Algorithm
It uses a specialized Hough Transform combined with edge detection to find circular shapes with high precision.

## Parameters
*   **Min Radius**: Minimum expected radius in pixels.
*   **Max Radius**: Maximum expected radius in pixels.
*   **Sensitivity**: Edge detection threshold.

## Example

```hover-image
{
  "original": "/docs/core-concepts/particle-analysis/spherical/img/original.svg",
  "result": "/docs/core-concepts/particle-analysis/spherical/img/result.svg",
  "alt": "Spherical Analysis Result"
}
```

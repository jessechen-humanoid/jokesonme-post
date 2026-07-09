## MODIFIED Requirements

### Requirement: IG post background image

The system SHALL let the user provide a background photo by dragging an image file onto the page. The image MUST NOT be uploaded to any server. When the provided image is a PNG containing transparency, the processed background image SHALL preserve that transparency; the system MUST NOT flatten transparent regions onto an opaque backing color. When the provided image does not exceed the maximum-edge limit, the system SHALL keep the original image data without re-encoding it.

#### Scenario: Drag a background image for an IG post

- **WHEN** the user drags an image file onto the IG post drop area
- **THEN** the preview SHALL render that image as the background, cover-fitted to 1080×1350

#### Scenario: Transparent PNG keeps its transparency

- **WHEN** the user drags a PNG file with transparent regions onto the IG post drop area
- **THEN** the preview and the exported PNG SHALL show the transparent regions as transparent over the template background, not as black or any opaque fill

#### Scenario: Small image is not re-encoded

- **WHEN** the user provides an image whose longest edge does not exceed the maximum-edge limit
- **THEN** the system SHALL use the original image data as-is, without downscaling or lossy re-encoding

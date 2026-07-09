## MODIFIED Requirements

### Requirement: Banner background image

The system SHALL let the user provide a background photo by dragging an image file onto the page. The image SHALL be used as the Banner background and MUST NOT be uploaded to any server. When the provided image is a PNG containing transparency, the processed background image SHALL preserve that transparency; the system MUST NOT flatten transparent regions onto an opaque backing color. When the provided image does not exceed the maximum-edge limit, the system SHALL keep the original image data without re-encoding it.

#### Scenario: Drag a background image

- **WHEN** the user drags an image file onto the Banner drop area
- **THEN** the preview SHALL render that image as the Banner background, cover-fitted to 3200×1200

#### Scenario: Transparent PNG keeps its transparency

- **WHEN** the user drags a PNG file with transparent regions onto the Banner drop area
- **THEN** the preview and the exported PNG SHALL show the transparent regions as transparent over the template background, not as black or any opaque fill

## ADDED Requirements

### Requirement: Background image aspect ratio preserved in export

The exported PNG SHALL render the background image with its original aspect ratio preserved. When the background image's aspect ratio differs from the template canvas ratio, the system SHALL scale the image uniformly to cover the canvas and crop the overflow centered (cover semantics), and SHALL NOT stretch or squash the image. The exported composition SHALL match the on-screen preview, which already applies CSS object-fit cover.

#### Scenario: Export a background whose ratio differs from the canvas

- **WHEN** the user exports an asset whose background image aspect ratio differs from the template canvas ratio
- **THEN** the exported PNG SHALL show the background scaled uniformly and center-cropped to fill the canvas, with no aspect-ratio distortion

##### Example: cover crop regions per template

| Source image | Template canvas | Visible source region (centered) | Cropped away |
| ------------ | --------------- | -------------------------------- | ------------ |
| 1080×1920 (9:16 phone shot) | 1080×1350 (IG) | 1080×1350 | 285 px top + 285 px bottom |
| 4032×3024 (4:3 photo) | 1080×1350 (IG) | 2419×3024 | ~806 px left + ~806 px right |
| 4032×3024 (4:3 photo) | 3200×1200 (banner) | 4032×1512 | 756 px top + 756 px bottom |

#### Scenario: Export matches preview composition

- **WHEN** the user compares the exported PNG against the on-screen preview of the same asset
- **THEN** the background framing in the PNG SHALL match the preview's cover-cropped framing, and faces or objects SHALL keep the same proportions as in the preview

#### Scenario: Background ratio already matches the canvas

- **WHEN** the background image aspect ratio equals the template canvas ratio
- **THEN** the exported PNG SHALL contain the full image scaled to the canvas with no cropping and no distortion

# image-rasterization Specification

## Purpose

TBD - created by archiving change 'web-asset-generator'. Update Purpose after archive.

## Requirements

### Requirement: In-browser DOM to PNG rendering

The system SHALL rasterize the live preview DOM node into a PNG entirely in the browser, without any server-side rendering. The rendered PNG SHALL match the on-screen preview layout.

#### Scenario: Render preview to PNG

- **WHEN** the user triggers an export
- **THEN** the system SHALL produce a PNG generated from the preview DOM node in the browser

---
### Requirement: Embedded fonts independent of the user's machine

The system SHALL embed the Noto Sans TC font (Black 900 and Medium 500 weights) shipped with the application, and SHALL embed the font data into the rasterization so that text renders correctly on machines that do not have the font installed.

#### Scenario: Render on a machine without the font

- **WHEN** a user whose machine has no Noto Sans TC font installed exports an asset containing Traditional Chinese text
- **THEN** the produced PNG SHALL render the Chinese text with Noto Sans TC and SHALL NOT show missing-glyph or fallback-font output

---
### Requirement: Wait for fonts before capture

The system SHALL ensure all embedded fonts are loaded before capturing. Capture MUST NOT occur while fonts are still loading.

#### Scenario: Fonts not yet ready

- **WHEN** an export is requested before the embedded fonts have finished loading
- **THEN** the system SHALL wait until fonts are ready and only then capture the PNG

---
### Requirement: Exact output dimensions at 2x

The system SHALL render each asset at its template base size scaled by 2, producing crisp retina output.

#### Scenario: Dimension mapping

- **WHEN** an asset is exported
- **THEN** its PNG dimensions SHALL equal the template base size multiplied by 2

##### Example: base sizes to output

| Template base | Output PNG |
| ------------- | ---------- |
| 1080×1350 | 2160×2700 |
| 3200×1200 | 6400×2400 |

---
### Requirement: Guard against empty background

The system SHALL prevent export when no background image has been provided, and SHALL inform the user instead of producing an empty image.

#### Scenario: Export without background

- **WHEN** the user requests an export but has not provided a background image
- **THEN** the system SHALL block the export and display a prompt to add a background

---
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

<!-- @trace
source: fix-export-bg-aspect-ratio
updated: 2026-07-19
code:
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-verify/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-analyze/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-archive/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
-->
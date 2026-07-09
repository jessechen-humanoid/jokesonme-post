# banner-composer Specification

## Purpose

TBD - created by archiving change 'web-asset-generator'. Update Purpose after archive.

## Requirements

### Requirement: Banner brand selection

The system SHALL let the user choose one of two brands for a Banner: 看我笑話 or 現代問題維修中心. The selected brand's standard-word logo SHALL be used as the Banner's main title artwork.

#### Scenario: Selecting a brand sets the main title logo

- **WHEN** the user selects the brand 現代問題維修中心 for a Banner
- **THEN** the preview SHALL show the 現代問題維修中心 standard-word logo as the main title

#### Scenario: Switching brand updates the logo

- **WHEN** the user changes the brand from 現代問題維修中心 to 看我笑話
- **THEN** the preview SHALL replace the main title logo with the 看我笑話 standard-word logo

---
### Requirement: Banner background image

The system SHALL let the user provide a background photo by dragging an image file onto the page. The image SHALL be used as the Banner background and MUST NOT be uploaded to any server. When the provided image is a PNG containing transparency, the processed background image SHALL preserve that transparency; the system MUST NOT flatten transparent regions onto an opaque backing color. When the provided image does not exceed the maximum-edge limit, the system SHALL keep the original image data without re-encoding it.

#### Scenario: Drag a background image

- **WHEN** the user drags an image file onto the Banner drop area
- **THEN** the preview SHALL render that image as the Banner background, cover-fitted to 3200×1200

#### Scenario: Transparent PNG keeps its transparency

- **WHEN** the user drags a PNG file with transparent regions onto the Banner drop area
- **THEN** the preview and the exported PNG SHALL show the transparent regions as transparent over the template background, not as black or any opaque fill


<!-- @trace
source: fix-transparent-png-resize-outro
updated: 2026-07-10
code:
  - web/src/styles/templates.css
  - web/public/shots/buy-1.png
  - web/src/main.js
  - web/src/templates.js
-->

---
### Requirement: Banner text fields

The system SHALL provide editable fields for a subtitle and an optional tag label. The tag label SHALL be omitted from the output when left empty.

#### Scenario: Fill subtitle and tag

- **WHEN** the user enters a subtitle "8 月號 EP5 & EP6" and a tag "付費會員限定"
- **THEN** the preview SHALL show the subtitle text and the tag badge

#### Scenario: Empty tag is omitted

- **WHEN** the user leaves the tag field empty
- **THEN** the output SHALL NOT render any tag badge

---
### Requirement: Banner output dimensions

The system SHALL produce Banner output at 3200×1200 base resolution, rendered at 2x scale, matching the existing banner template layout.

#### Scenario: Export a Banner

- **WHEN** the user exports a Banner
- **THEN** the produced PNG SHALL be 6400×2400 pixels
## ADDED Requirements

### Requirement: Banner brand selection

The system SHALL let the user choose one of two brands for a Banner: 看我笑話 or 現代問題維修中心. The selected brand's standard-word logo SHALL be used as the Banner's main title artwork.

#### Scenario: Selecting a brand sets the main title logo

- **WHEN** the user selects the brand 現代問題維修中心 for a Banner
- **THEN** the preview SHALL show the 現代問題維修中心 standard-word logo as the main title

#### Scenario: Switching brand updates the logo

- **WHEN** the user changes the brand from 現代問題維修中心 to 看我笑話
- **THEN** the preview SHALL replace the main title logo with the 看我笑話 standard-word logo

### Requirement: Banner background image

The system SHALL let the user provide a background photo by dragging an image file onto the page. The image SHALL be used as the Banner background and MUST NOT be uploaded to any server.

#### Scenario: Drag a background image

- **WHEN** the user drags an image file onto the Banner drop area
- **THEN** the preview SHALL render that image as the Banner background, cover-fitted to 3200×1200

### Requirement: Banner text fields

The system SHALL provide editable fields for a subtitle and an optional tag label. The tag label SHALL be omitted from the output when left empty.

#### Scenario: Fill subtitle and tag

- **WHEN** the user enters a subtitle "8 月號 EP5 & EP6" and a tag "付費會員限定"
- **THEN** the preview SHALL show the subtitle text and the tag badge

#### Scenario: Empty tag is omitted

- **WHEN** the user leaves the tag field empty
- **THEN** the output SHALL NOT render any tag badge

### Requirement: Banner output dimensions

The system SHALL produce Banner output at 3200×1200 base resolution, rendered at 2x scale, matching the existing banner template layout.

#### Scenario: Export a Banner

- **WHEN** the user exports a Banner
- **THEN** the produced PNG SHALL be 6400×2400 pixels

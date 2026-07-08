## ADDED Requirements

### Requirement: Per-brand preset background picker

The system SHALL present a set of preset background photos as selectable thumbnails, bundled with the app. For Banner, the thumbnails SHALL be those of the currently selected brand. For IG posts, the thumbnails SHALL include presets from both brands.

#### Scenario: Banner shows current brand presets

- **WHEN** the user is composing a Banner with brand 現代問題維修中心
- **THEN** the preset background thumbnails shown SHALL be the 現代問題維修中心 preset photos

#### Scenario: IG shows presets from both brands

- **WHEN** the user is composing an IG post
- **THEN** the preset background thumbnails SHALL include presets from both 看我笑話 and 現代問題維修中心

### Requirement: Selecting a preset sets the base image

Selecting a preset thumbnail SHALL set it as the current base image, equivalent to uploading that image, and the preview SHALL update to use it.

#### Scenario: Click a preset thumbnail

- **WHEN** the user clicks a preset background thumbnail
- **THEN** the preview SHALL render that preset photo as the background, using the same base-image slot as a dragged/selected upload

## ADDED Requirements

### Requirement: IG post template selection

The system SHALL require the user to select an IG post template before entering content. The available templates SHALL be 公告型 (announcement) and 主視覺型 (key-visual). The set of editable fields SHALL depend on the selected template.

#### Scenario: Selecting announcement template

- **WHEN** the user selects the 公告型 template
- **THEN** the system SHALL present fields for title, body text (內文/細節), and an optional numbered list

#### Scenario: Selecting key-visual template

- **WHEN** the user selects the 主視覺型 template
- **THEN** the system SHALL present fields for title and an optional badge

### Requirement: IG post background image

The system SHALL let the user provide a background photo by dragging an image file onto the page. The image MUST NOT be uploaded to any server.

#### Scenario: Drag a background image for an IG post

- **WHEN** the user drags an image file onto the IG post drop area
- **THEN** the preview SHALL render that image as the background, cover-fitted to 1080×1350

### Requirement: Announcement template content

For the 公告型 template, the system SHALL render a centered title, a body paragraph, and an optional numbered list, matching the existing 純文字公告 template layout. The numbered list SHALL be omitted when no list items are provided.

#### Scenario: Announcement with list

- **WHEN** the user enters a title, body text, and three list items
- **THEN** the preview SHALL show the centered title, the body paragraph, and a numbered list of three items

#### Scenario: Announcement without list

- **WHEN** the user provides no list items
- **THEN** the output SHALL NOT render a numbered list

### Requirement: Key-visual template content

For the 主視覺型 template, the system SHALL render a centered title over the photo and an optional orange circular badge. The badge SHALL accept free-form multi-line text and SHALL be omitted when its content is empty.

#### Scenario: Key-visual with badge

- **WHEN** the user enters a title and badge text "本期報修人\n竹節蟲 & 傑哥"
- **THEN** the preview SHALL show the title and an orange circular badge containing the two lines

#### Scenario: Key-visual without badge

- **WHEN** the user leaves the badge empty
- **THEN** the output SHALL NOT render the orange circular badge

### Requirement: IG post output dimensions

The system SHALL produce IG post output at 1080×1350 base resolution, rendered at 2x scale.

#### Scenario: Export an IG post

- **WHEN** the user exports a single IG post
- **THEN** the produced PNG SHALL be 2160×2700 pixels

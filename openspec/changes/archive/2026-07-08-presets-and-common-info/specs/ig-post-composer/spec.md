## MODIFIED Requirements

### Requirement: Announcement template content

For the 公告型 template, the system SHALL render a centered title, a body paragraph, and an optional numbered list, matching the existing 純文字公告 template layout. The numbered list SHALL be omitted when no list items are provided. The template SHALL additionally support an optional inset screenshot: when a screenshot is provided, it SHALL render as a rounded card centered below the text; when no screenshot is provided, no card SHALL render and the layout SHALL match the prior text-only appearance.

#### Scenario: Announcement with list

- **WHEN** the user enters a title, body text, and three list items
- **THEN** the preview SHALL show the centered title, the body paragraph, and a numbered list of three items

#### Scenario: Announcement without list

- **WHEN** the user provides no list items
- **THEN** the output SHALL NOT render a numbered list

#### Scenario: Announcement with inset screenshot

- **WHEN** the announcement post carries a screenshot
- **THEN** the preview SHALL show the title and body text with the screenshot as a rounded card centered below the text

#### Scenario: Announcement without screenshot

- **WHEN** the announcement post carries no screenshot
- **THEN** the output SHALL NOT render a screenshot card and SHALL match the text-only layout

# ig-post-composer Specification

## Purpose

TBD - created by archiving change 'web-asset-generator'. Update Purpose after archive.

## Requirements

### Requirement: IG post template selection

The system SHALL require the user to select an IG post template before entering content. The available templates SHALL be 公告型 (announcement) and 主視覺型 (key-visual). The set of editable fields SHALL depend on the selected template.

#### Scenario: Selecting announcement template

- **WHEN** the user selects the 公告型 template
- **THEN** the system SHALL present fields for title, body text (內文/細節), and an optional numbered list

#### Scenario: Selecting key-visual template

- **WHEN** the user selects the 主視覺型 template
- **THEN** the system SHALL present fields for title and an optional badge

---
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


<!-- @trace
source: presets-and-common-info
updated: 2026-07-08
code:
  - web/public/presets/mprc/mprc-4.jpg
  - Reference/常用資訊/Instagram post - 31.png
  - Reference/預設圖片/現代問題維修中心/DSC03425.jpg
  - web/public/shots/enter-1.png
  - web/public/presets/mprc/thumb/mprc-3.jpg
  - web/public/presets/mprc/thumb/mprc-1.jpg
  - web/public/presets/mprc/thumb/mprc-4.jpg
  - web/public/presets/mprc/mprc-1.jpg
  - web/public/shots/buy-1.png
  - Reference/常用資訊/Instagram post - 25.png
  - Reference/常用資訊/Instagram post - 27.png
  - Reference/預設圖片/看我笑話/看我笑話四月號-248.jpg
  - Reference/常用資訊/Instagram post - 28.png
  - Reference/常用資訊/Instagram post - 58.png
  - Reference/常用資訊/Instagram post - 23.png
  - Reference/常用資訊/Instagram post - 56.png
  - web/public/presets/kwxh/kwxh-1.jpg
  - web/public/presets/kwxh/thumb/kwxh-1.jpg
  - web/public/shots/buy-2.png
  - web/public/presets/kwxh/thumb/kwxh-2.jpg
  - web/src/styles/templates.css
  - Reference/預設圖片/看我笑話/老婆拍的照片 09.jpg
  - Reference/預設圖片/現代問題維修中心/DSC03540.jpg
  - Reference/預設圖片/看我笑話/看我笑話五月號-5.jpg
  - Reference/常用資訊/Instagram post - 29.png
  - Reference/預設圖片/現代問題維修中心/DSC03342.jpg
  - web/public/presets/kwxh/kwxh-4.jpg
  - Reference/預設圖片/現代問題維修中心/DSC03457.jpg
  - web/public/presets/kwxh/thumb/kwxh-3.jpg
  - web/public/presets/mprc/mprc-2.jpg
  - Reference/常用資訊/Instagram post - 55.png
  - web/public/presets/mprc/thumb/mprc-2.jpg
  - web/public/presets/kwxh/thumb/kwxh-4.jpg
  - web/public/shots/refund-1.png
  - web/public/shots/buy-4.png
  - Reference/常用資訊/Instagram post - 24.png
  - web/src/main.js
  - web/src/presets.js
  - web/src/styles/app.css
  - web/public/presets/kwxh/kwxh-2.jpg
  - Reference/預設圖片/看我笑話/老婆拍的照片 11.jpg
  - web/public/presets/kwxh/kwxh-3.jpg
  - Reference/常用資訊/Instagram post - 42.png
  - web/public/shots/social-1.png
  - web/public/shots/buy-3.png
  - web/public/presets/mprc/mprc-3.jpg
  - web/src/templates.js
  - Reference/常用資訊/Instagram post - 26.png
-->

---
### Requirement: Key-visual template content

For the 主視覺型 template, the system SHALL render a centered title over the photo and an optional orange circular badge. The badge SHALL accept free-form multi-line text and SHALL be omitted when its content is empty.

#### Scenario: Key-visual with badge

- **WHEN** the user enters a title and badge text "本期報修人\n竹節蟲 & 傑哥"
- **THEN** the preview SHALL show the title and an orange circular badge containing the two lines

#### Scenario: Key-visual without badge

- **WHEN** the user leaves the badge empty
- **THEN** the output SHALL NOT render the orange circular badge

---
### Requirement: IG post output dimensions

The system SHALL produce IG post output at 1080×1350 base resolution, rendered at 2x scale.

#### Scenario: Export an IG post

- **WHEN** the user exports a single IG post
- **THEN** the produced PNG SHALL be 2160×2700 pixels
# preset-backgrounds Specification

## Purpose

TBD - created by archiving change 'presets-and-common-info'. Update Purpose after archive.

## Requirements

### Requirement: Per-brand preset background picker

The system SHALL present a set of preset background photos as selectable thumbnails, bundled with the app. For Banner, the thumbnails SHALL be those of the currently selected brand. For IG posts, the thumbnails SHALL include presets from both brands.

#### Scenario: Banner shows current brand presets

- **WHEN** the user is composing a Banner with brand 現代問題維修中心
- **THEN** the preset background thumbnails shown SHALL be the 現代問題維修中心 preset photos

#### Scenario: IG shows presets from both brands

- **WHEN** the user is composing an IG post
- **THEN** the preset background thumbnails SHALL include presets from both 看我笑話 and 現代問題維修中心


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
### Requirement: Selecting a preset sets the base image

Selecting a preset thumbnail SHALL set it as the current base image, equivalent to uploading that image, and the preview SHALL update to use it.

#### Scenario: Click a preset thumbnail

- **WHEN** the user clicks a preset background thumbnail
- **THEN** the preview SHALL render that preset photo as the background, using the same base-image slot as a dragged/selected upload

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
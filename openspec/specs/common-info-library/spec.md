# common-info-library Specification

## Purpose

TBD - created by archiving change 'presets-and-common-info'. Update Purpose after archive.

## Requirements

### Requirement: Common info topic library

The system SHALL provide a bundled library of common-info topics. Each topic SHALL have a display label and consist of one or more slides. Each slide SHALL carry announcement text (a title and body text, and optionally a numbered list) and MAY carry one App screenshot image.

#### Scenario: Browse topics

- **WHEN** the user opens the common-info selector on an IG post
- **THEN** the system SHALL list the available topics by their labels


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
### Requirement: Adding a topic appends its slides to the IG list

Selecting a topic and adding it SHALL append one IG post per slide to the IG post list, in slide order. Each appended post SHALL use the announcement (公告型) template and SHALL carry that slide's text and screenshot.

#### Scenario: Add a multi-slide topic

- **WHEN** the user adds a topic that has two slides
- **THEN** the IG post list SHALL gain two announcement posts, in the topic's slide order, each carrying its slide's title and screenshot

##### Example: adding 怎麼退票

- **GIVEN** topic "怎麼退票" with slides [ {title:"怎麼退票？", shot:"refund-1"}, {title:"怎麼退票？", shot:"refund-2"} ]
- **WHEN** the user adds this topic
- **THEN** two posts are appended, the first carrying shot "refund-1" and the second "refund-2"


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
### Requirement: Base image stays user-chosen for added slides

Appending a topic's slides SHALL NOT use the topic's original image as the background. Each appended post SHALL take the user's currently selected IG base image (which MAY be empty), and the user SHALL be able to change each post's base image afterward.

#### Scenario: Slides use the current base image

- **WHEN** the user has selected a base photo and adds a topic
- **THEN** each appended post SHALL use that selected photo as its background, not any image from the common-info source


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
### Requirement: Added slides remain editable

Posts appended from a common-info topic SHALL remain fully editable in the interface, not read-only snapshots. Selecting an appended post SHALL load its text into the editable fields, and edits SHALL update that post in place.

#### Scenario: Edit an added slide's text

- **WHEN** the user adds a common-info topic and then selects one of the appended posts and changes its title or body text
- **THEN** that post's text SHALL update to the edited content, and its export SHALL reflect the edits

#### Scenario: Edited text persists in the list

- **WHEN** the user edits an appended post and then selects a different post
- **THEN** the previously edited post SHALL retain its edited text in the list

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
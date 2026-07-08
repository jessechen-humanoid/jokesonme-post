## ADDED Requirements

### Requirement: Common info topic library

The system SHALL provide a bundled library of common-info topics. Each topic SHALL have a display label and consist of one or more slides. Each slide SHALL carry announcement text (a title and body text, and optionally a numbered list) and MAY carry one App screenshot image.

#### Scenario: Browse topics

- **WHEN** the user opens the common-info selector on an IG post
- **THEN** the system SHALL list the available topics by their labels

### Requirement: Adding a topic appends its slides to the IG list

Selecting a topic and adding it SHALL append one IG post per slide to the IG post list, in slide order. Each appended post SHALL use the announcement (公告型) template and SHALL carry that slide's text and screenshot.

#### Scenario: Add a multi-slide topic

- **WHEN** the user adds a topic that has two slides
- **THEN** the IG post list SHALL gain two announcement posts, in the topic's slide order, each carrying its slide's title and screenshot

##### Example: adding 怎麼退票

- **GIVEN** topic "怎麼退票" with slides [ {title:"怎麼退票？", shot:"refund-1"}, {title:"怎麼退票？", shot:"refund-2"} ]
- **WHEN** the user adds this topic
- **THEN** two posts are appended, the first carrying shot "refund-1" and the second "refund-2"

### Requirement: Base image stays user-chosen for added slides

Appending a topic's slides SHALL NOT use the topic's original image as the background. Each appended post SHALL take the user's currently selected IG base image (which MAY be empty), and the user SHALL be able to change each post's base image afterward.

#### Scenario: Slides use the current base image

- **WHEN** the user has selected a base photo and adds a topic
- **THEN** each appended post SHALL use that selected photo as its background, not any image from the common-info source

### Requirement: Added slides remain editable

Posts appended from a common-info topic SHALL remain fully editable in the interface, not read-only snapshots. Selecting an appended post SHALL load its text into the editable fields, and edits SHALL update that post in place.

#### Scenario: Edit an added slide's text

- **WHEN** the user adds a common-info topic and then selects one of the appended posts and changes its title or body text
- **THEN** that post's text SHALL update to the edited content, and its export SHALL reflect the edits

#### Scenario: Edited text persists in the list

- **WHEN** the user edits an appended post and then selects a different post
- **THEN** the previously edited post SHALL retain its edited text in the list

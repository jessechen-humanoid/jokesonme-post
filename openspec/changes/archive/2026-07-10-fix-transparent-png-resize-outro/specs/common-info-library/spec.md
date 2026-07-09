## ADDED Requirements

### Requirement: Blank current post is replaced when adding a topic

When the user adds a common-info topic while the currently selected IG post is blank, the system SHALL remove that blank post so the list does not retain an empty entry. A post SHALL be considered blank only when ALL of its content fields are empty: title, intro body, list text, outro text, badge text, and screenshot. A post with content in any one of these fields SHALL NOT be removed.

#### Scenario: Blank post is replaced

- **WHEN** the currently selected IG post has no title, intro, list, outro, badge, or screenshot, and the user adds a common-info topic
- **THEN** the blank post SHALL be removed and the topic's slides SHALL be appended, with the first appended post selected

#### Scenario: Post with only an outro is preserved

- **WHEN** the currently selected IG post has outro text but all other content fields empty, and the user adds a common-info topic
- **THEN** that post SHALL remain in the list and the topic's slides SHALL be appended after it

##### Example: blank detection by field combination

| title | intro | list | outro | badge | screenshot | Considered blank? |
| ----- | ----- | ---- | ----- | ----- | ---------- | ----------------- |
| empty | empty | empty | empty | empty | none | yes — removed |
| empty | empty | empty | "感謝大家收看" | empty | none | no — preserved |
| "公告" | empty | empty | empty | empty | none | no — preserved |

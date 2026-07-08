# batch-packaging Specification

## Purpose

TBD - created by archiving change 'web-asset-generator'. Update Purpose after archive.

## Requirements

### Requirement: Multiple IG posts in one session

The system SHALL let the user create multiple IG posts and see them as an ordered list of thumbnails within the same session.

#### Scenario: Add multiple posts

- **WHEN** the user creates three IG posts
- **THEN** the system SHALL show three thumbnails in a list representing the current order

---
### Requirement: Drag to reorder

The system SHALL let the user reorder the IG posts by dragging their thumbnails. The displayed order SHALL reflect the intended export order.

#### Scenario: Reorder posts

- **WHEN** the user drags the third thumbnail to the first position
- **THEN** the list order SHALL update so that post becomes first

---
### Requirement: Ordered ZIP download

The system SHALL export all IG posts as PNG files packaged into a single ZIP, created entirely in the browser. Each file name SHALL carry a numeric prefix reflecting the user-defined order so that files sort in that order.

#### Scenario: Download an ordered ZIP

- **WHEN** the user downloads the set after ordering the posts
- **THEN** the system SHALL produce one ZIP containing one PNG per post, each name prefixed with a zero-padded sequence number matching the order

##### Example: file names for an ordered set

- **GIVEN** three posts ordered as [PostC, PostA, PostB]
- **WHEN** the user downloads the ZIP
- **THEN** the ZIP SHALL contain files named `01_...png`, `02_...png`, `03_...png` corresponding to PostC, PostA, PostB in that order

---
### Requirement: Single-asset direct download

The system SHALL allow downloading a single asset (Banner or one IG post) directly as a PNG without producing a ZIP.

#### Scenario: Download a single Banner

- **WHEN** the user exports one Banner
- **THEN** the system SHALL download a single PNG file and SHALL NOT create a ZIP

# Function Clusters

This file contains logical groupings of modular functions used to solve ARC puzzles.

## Grid Geometry and Transformation

This cluster focuses on the structural manipulation of grids, including resizing, reshaping, and basic linear transformations. Functions here handle the arithmetic of grid dimensions, the movement or duplication of data across cells, and the physical restructuring of data arrays. These are fundamental for tasks involving scaling, flipping, mirroring, or shifting components to create new patterns or expanded layouts based on the original grid's properties.

### Examples:
- **flipRow**: Reverses a 1D array to perform a horizontal flip.
- **repeatRow**: Expands row length by concatenating the row to itself.
- **getScaleFactor**: Calculates the ratio between output and input grid heights for magnification.
- **createEmptyGrid**: Initializes a new 2D array of zeros for workspace preparation.
- **cloneGrid**: Creates a deep copy of a 2D array for safe, immutable transformations.
- **copyGrid**: Creates a deep clone of a 2D grid to prevent mutation of source data.

---

## Pattern Recognition and Spatial Analysis

These functions are designed to extract abstract information from the grid's topology. They identify shapes, connected components, specific marker values, and relative geometric offsets. By analyzing how pixels relate to one another—such as identifying bounding boxes, tracing connected paths, or segmenting regions—these functions enable the system to 'understand' the existing structure before applying logic-based modifications or color-based filling.

### Examples:
- **getPattern**: Analyzes relative geometry of pixels to create a serialized representation.
- **findComponents**: Uses BFS to identify distinct contiguous clusters of a specific marker value.
- **getBounds**: Calculates the axis-aligned bounding box (AABB) for a set of points.
- **findBlocks**: Identifies and sorts connected components of non-zero pixels based on position.
- **findBoundingBox**: Determines the rectangular boundaries of all instances of a target value.
- **getConnectedComponent**: Isolates a single connected component of non-zero values using BFS.
- **isSurrounded**: Checks if a cell is enclosed by non-zero values in all directions.

---

## Tiling, Rendering, and Reconstruction

This cluster is dedicated to generative tasks where the input provides a base pattern or 'tile' that is replicated or reconstructed across a larger field. These functions handle the logic of taking sub-segments of a grid and tiling them according to discovered rules, such as frequency analysis, band segmentation, or majority voting. They are essential for tasks requiring the rebuilding of grids based on recurring motifs or signal density.

### Examples:
- **findThreshold**: Determines a cut-off point to separate signal density from noise.
- **getBands**: Segments density counts into continuous intervals.
- **extractTile**: Slices a specific sub-matrix or tile from a grid.
- **computeMajorityTile**: Aggregates multiple tiles into one canonical pattern using majority voting.
- **reconstructGrid**: Generates a full grid by placing canonical patterns into identified bands.
- **applyTiling**: Constructs a large grid by replicating a sub-matrix based on input grid non-zero cells.

---

## Rule-Based Transformation and Filling

This group encompasses functions that apply specific business logic to alter the content of the grid, such as color-replacement, filling rectangular regions, or moving 'agents' (like pushers or beams). These functions act upon identified structures to change their state, color, or position based on defined rules derived from the training data or local grid context.

### Examples:
- **buildPatternMap**: Creates a lookup table correlating input patterns to specific output colors.
- **transformGrid**: Applies a transformation by replacing specific values with mapped colors.
- **fillRectangle**: Fills empty cells within a defined rectangular boundary.
- **placeBlocksDiagonally**: Positions block objects onto a grid with cumulative diagonal offsets.
- **processVector**: Applies transformation logic to a row/column, including marker conversion and movement.
- **renderLines**: Fills defined line segments into a grid.

---

## Data Extraction and Context Prediction

These functions serve the intelligence layer of the system by scanning grids to find specific values, infer background colors, or predict missing information based on surrounding context. They perform statistical analysis or pattern matching (like finding the most frequent color or the first occurrence of a value) to provide the parameters needed by the transformation functions.

### Examples:
- **detectMarkerValue**: Determines the constant value used to define structural boundaries.
- **findPrimaryColor**: Finds the first non-zero cell value in a grid.
- **findDots**: Categorizes non-zero cell coordinates by their color value.
- **getBackgroundColor**: Infers the primary background color by frequency analysis.
- **getRowPrediction**: Predicts a missing row value based on contextual similarities.
- **extractSpiralParams**: Parses specific cells to identify colors and center points for spiral generation.

---
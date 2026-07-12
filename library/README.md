# Library

Modular functions for ARC puzzles.


### Task 00576224
- **flipRow**: Takes a 1D array of numbers and returns a new array with the elements in reverse order, effectively performing a horizontal flip.
- **repeatRow**: Concatenates a given row to itself a specified number of times to expand the row length.
- **getScaleFactor**: Calculates the ratio between the height of the output grid and the input grid to determine the magnification factor.

### Task 009d5c81
- **getPattern**: Analyzes a grid to identify the relative geometry of all pixels with a value of 1. It calculates the top-left offset, translates all coordinates to start from (0,0), and returns a serialized string representation for pattern comparison.
- **buildPatternMap**: Iterates through training pairs to correlate shape patterns found in input grids with the specific 'result' color used in the output grid. It creates a lookup table for pattern-to-color mapping.
- **transformGrid**: Applies a transformation to the grid based on a determined color. It replaces value '8' with the identified color, clears '1's, and preserves other grid values.

### Task 00dbd492
- **detectMarkerValue**: Scans the training data to determine the constant value used to define the boundaries/structures in the grid. In this specific task, it returns the constant integer 2.
- **findComponents**: Performs a Breadth-First Search (BFS) to identify all distinct contiguous clusters of cells containing the specified marker value.
- **getBounds**: Calculates the axis-aligned bounding box (AABB) for a collection of points representing a component.
- **calculateFillColor**: Determines the appropriate color value to fill a rectangle based on the inverse of its dimensions.
- **fillRectangle**: Fills the interior cells (where value is 0) of a defined rectangular boundary with a specific color.

### Task 03560426
- **findBlocks**: Scans a 2D grid to identify distinct connected components of non-zero pixels. It utilizes a BFS flood-fill algorithm to group connected pixels of the same color and calculates the bounding box and color properties for each identified block. Returns a list of blocks sorted by their original column and row positions.
- **createEmptyGrid**: Initializes a new 2D array of a specified size filled with zeros.
- **placeBlocksDiagonally**: Iterates through a list of block objects and places them onto the grid starting at a diagonal offset. The offset is calculated by tracking the cumulative height and width of previous blocks.

### Task 05a7bcf2
- **cloneGrid**: Performs a deep copy of a 2D number array to ensure the original data remains immutable during transformation.
- **getBarrierInfo**: Scans the grid to identify if there is a full-length row or column of the value '8', representing the partition/barrier.
- **processVector**: Applies the transformation logic to a 1D sequence (row or column). It converts markers (4) to 3, projects beams (4) toward the barrier, converts blocked zones to the barrier color (8), and relocates pushers (2) to the far edge of the opposite partition.

### Task 0607ce86
- **findThreshold**: Calculates a threshold value to separate signal regions from noise based on the gaps in density counts. It identifies the largest gap between sorted unique density values to partition the data effectively.
- **getBands**: Segments an array of density counts into continuous intervals (bands) where the count is greater than or equal to a provided threshold.
- **getMode**: Calculates the mode (most frequent value) from an array of numbers. Useful for determining the expected tile dimensions from varying band sizes.
- **extractTile**: Slices a sub-matrix (tile) from the original grid starting at a specific coordinate with defined height and width dimensions.
- **computeMajorityTile**: Aggregates multiple tiles into one 'canonical' tile. For every pixel position (r, c), it performs a majority vote across all tiles to determine the most likely correct pixel value.
- **reconstructGrid**: Generates a new grid by tiling the canonical pattern into the locations defined by the row and column bands, filling remaining areas with zero.

### Task 0692e18c
- **findPrimaryColor**: Scans a 2D grid from top-left to bottom-right and returns the value of the first cell that is not equal to zero. If the grid contains only zeros, returns zero.
- **invertGrid**: Generates a new square matrix of the same dimensions where original non-zero cells become 0, and original zero cells are replaced by a provided color constant.
- **applyTiling**: Constructs a larger output grid by tiling a provided sub-matrix. For every non-zero cell in the input grid, the entire 'tile' matrix is copied into the corresponding expanded area in the output.

### Task 070dd51e
- **findDots**: Scans the input grid and categorizes the coordinates of all non-zero cells by their color value. Returns a mapping where keys are color integers and values are arrays of [row, column] coordinate pairs.
- **extractLines**: Processes coordinate pairs to determine geometric orientation. It classifies dots into horizontal lines (same row) or vertical lines (same column) and calculates the inclusive start and end boundaries for each line.
- **renderLines**: Constructs a new grid based on existing data and defined line segments. It iterates through the line definitions and fills the grid cells between the start and end points with the specified color.

### Task 08573cc6
- **findFirstOccurrence**: Scans a 2D grid to locate the first cell containing the specified value, returning its [row, col] coordinates. Returns [0, 0] if the value is not found.
- **extractSpiralParams**: Parses specific cells from the input grid to determine the two colors used for the spiral pattern and the static center identification value.
- **generateSpiralPath**: Calculates a sequence of coordinates and colors representing a spiral expanding outward from a central point. The spiral alternates between two colors and stops when it reaches the grid boundaries.

### Task 0934a4d8
- **findBoundingBox**: Scans a 2D grid to determine the rectangular boundaries (minimum and maximum row and column indices) that encompass all instances of a specific target value. Returns null if the value is not present.
- **getRowPrediction**: Predicts a missing value in a row by finding another row in the grid that shares the same contextual values in non-occluded columns. It ignores the area defined by the bounding box during the search process.
- **getColPrediction**: Predicts a missing value in a column by finding another column in the grid that shares the same contextual values in non-occluded rows. It ignores the area defined by the bounding box during the search process.

### Task 09c534e7
- **copyGrid**: Creates a deep clone of a 2D number array to ensure that modifications to the result do not mutate the original input grid.
- **getBackgroundColor**: Analyzes the frequency of non-zero values in the grid to infer a primary background color. It identifies the non-zero value that appears most frequently.
- **getConnectedComponent**: Uses Breadth-First Search (BFS) to traverse and isolate a single connected component of non-zero values starting from a specific coordinate.
- **isSurrounded**: Checks if a specific cell at (r, c) is completely surrounded by non-zero values in all 8 adjacent directions (including diagonals).

### Task 135a2760
- **getBorderColor**: Calculates the dominant color used for grid boundaries. It ignores the background color and selects the most frequent pixel value present in the grid.
- **getIndices**: Identifies row or column indices that act as grid boundaries based on a density threshold of a specific color.
- **getRanges**: Converts a list of boundary indices into coordinate ranges representing the interior 'gaps' between those boundaries.
- **extractSubgrid**: Clones a specific portion of a 2D array defined by row and column boundaries.
- **updateGrid**: Writes the contents of a repaired subgrid back into the original master grid at specific coordinates.
- **repairInterior**: Analyzes an interior block to find the most likely repeating tile pattern and reconstructs the block to be perfectly periodic.

### Task 136b0064
- **findWhitePixel**: Scans the output region of the grid (to the right of the yellow divider column) to find the starting position (value 5). Returns the relative row and column indices.
- **extractBlocks**: Segments the source side of the grid (left of the yellow divider) into distinct vertical blocks based on rows that contain non-zero pixel data, effectively isolating individual instruction groups.
- **extractShapes**: Parses defined 3x3 pixel blocks into standardized string signatures. For each block, it identifies the primary color and creates a binary normalized representation to match against known movement patterns.
- **getPathParams**: A lookup utility that maps a normalized string signature of a shape to a specific movement instruction set including orientation (Horizontal/Vertical), direction, and length.
- **createEmptyGrid**: Initializes a 2D array of the specified dimensions, filled with zeroes.

### Task 13e47133
- **getMostFrequentColor**: Calculates the most frequent color value present in the entire grid, typically used to identify the canvas background color.
- **findDividerColor**: Scans the grid for the color that forms the longest continuous segments along rows and columns, effectively identifying the 'divider' lines or frame colors used to partition regions.
- **findRegions**: Performs a flood-fill or BFS traversal to partition non-divider cells of the grid into distinct, isolated spatial regions.
- **findCuts**: Analyzes the divider mask to identify continuous lines (rows or columns) of divider pixels, which act as boundaries for the internal regions.
- **getCandidateRects**: Generates all possible valid bounding boxes within the grid that do not overlap with the divider mask, serving as candidates for the concentric fill pattern.

### Task 142ca369
- **toKey**: Serializes a 2D coordinate into a string key for use in Set and Map collections.
- **fromKey**: Deserializes a string key back into a [row, col] coordinate tuple.
- **findConnectedComponents**: Uses Breadth-First Search (BFS) to identify clusters of adjacent same-colored cells and group them into distinct shape objects.
- **classifyShapes**: Performs geometric analysis on connected components to categorize them as single pixels, lines (horizontal/vertical), or L-shapes with defined bounce trajectories.
- **simulateBilliard**: Calculates the path of a diagonal ray, handling reflections off lines and color changes upon collision with structural components.
- **simulateLineExtension**: Projects a path from a line towards a target partner line, filling the intermediate cells.

### Task 16b78196
- **getMostCommon**: Calculates the mode of an array of numbers. Returns the most frequent element, or null if the array is empty.
- **groupContiguous**: Groups an array of integers into an array of sub-arrays, where each sub-array contains a sequence of consecutive integers.
- **noBlockOverlap**: Checks if a set of relative cells, when translated to a specific origin (rmin, cmin), overlaps with any existing cells belonging to the main structure (blockCells).
- **noConflict**: Verifies that a shape's cells, at a target position, stay within grid boundaries and do not collide with already placed shapes or the static block.

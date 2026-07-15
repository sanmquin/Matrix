# ARC Python Solutions Documentation

This file contains automatically generated explanations of ARC puzzle solutions in Python.


## Task 0934a4d8

### Strategy Overview
Task 0934a4d8 involves an image where a specific rectangular region (marked by the value '8') contains missing or corrupted information. The objective is to reconstruct the contents of this rectangular region by leveraging contextual clues from the rest of the grid. The solver treats the missing region as an inference problem based on row and column patterns.

### Key Logic and Steps
1. **Region Detection**: The code identifies the target area by locating all cells with the value '8'. It calculates the bounding box (`r_min`, `r_max`, `c_min`, `c_max`) defining the dimensions and position of the occluded area.
2. **Contextual Analysis**: 
   - For every cell $(r, c)$ inside the target rectangle, the algorithm extracts 'contexts'. 
   - The **row context** consists of values in the same row $r$ but outside the target column range. 
   - The **column context** consists of values in the same column $c$ but outside the target row range.
3. **Pattern Matching**: 
   - The solver iterates through all other rows/columns in the grid to find a 'twin' pattern. It calculates a score based on how many cells in the context match those of the candidate row or column.
   - If a row or column exists elsewhere in the grid that matches the context perfectly, the value at the target coordinate is predicted based on that match.
4. **Fallback Heuristics**:
   - **Confidence Scoring**: It prioritizes the prediction with the higher match score. If both row and column matches are available, it picks the one with the higher confidence.
   - **Transposition Symmetry**: If no perfect match is found in either orientation, it attempts to use the value from the transposed position $(c, r)$ of the original grid (assuming the grid patterns exhibit a symmetric relationship).

### Patterns and Transformations
- **Inference through Symmetry**: The solution relies on the property that the grid contains repeating patterns (rows or columns) that can be used to "fill in the blanks" for the occluded section.
- **Constraint Satisfaction**: By excluding the occluded '8' cells from the candidate search, the code ensures it only learns patterns from valid, existing data.
- **Output Construction**: A new grid of size `(oh, ow)` is generated, filling each cell with the best predicted value based on the row/column correlation scores.


## Task 135a2760

### Logic Overview
The task 135a2760 involves repairing corrupted periodic patterns within a grid subdivided by a consistent border structure. The algorithm identifies the grid's 'framework' (border color and positions), isolates rectangular panels bounded by these borders, and reconstructs each panel by inferring the underlying repeating unit (tile) through majority voting.

### Key Steps
1. **Framework Identification:**
   - Determines the `border_color` by counting the most frequent color forming lines that span more than 50% of the grid's height or width.
   - Identifies `border_rows` and `border_cols`—the horizontal and vertical lines formed by the border color.

2. **Panel Isolation:**
   - Divides the grid into interior sub-grids (panels) using the detected borders.

3. **Pattern Reconstruction (The Core Logic):**
   - For each panel, the code searches for a pattern of size `(pr, pc)` (periodicity).
   - It iterates through all possible period dimensions. To ensure robustness, it requires at least three samples for every cell within the tile (`min_reps >= 3`) to perform a valid statistical inference.
   - **Majority Vote:** For every pixel position `(tr, tc)` in the potential `(pr, pc)` tile, it collects values from all corresponding positions across the panel using the formula `(tr + n*pr, tc + m*pc)`.
   - It calculates an `error` score representing the number of pixels that deviate from the most common color in each tile position.

4. **Correction:**
   - The algorithm selects the tile pattern `(pr, pc)` that minimizes the total number of errors in the panel.
   - It then reconstructs the entire panel by tiling this optimal pattern, effectively overwriting any corrupted pixels with the majority-voted value.

### Summary of Transformations
- **Detection:** Converts the grid into a structured coordinate system based on the border lines.
- **Statistical Inference:** Uses the frequency of values in periodic offsets to filter out noise or corruption.
- **Restoration:** Replaces the panel content with a perfectly tiled version of the best-fit repeating pattern.


## Task 136b0064

### Strategy Overview
The task 136b0064 involves transforming a series of encoded geometric shapes found on the left side of a grid into a single continuous path starting from a designated 'white pixel' (value 5) on the right side of the grid. The grid is split into two halves by a vertical yellow column (value 4). The shapes on the left side function as instructions for how to extend the path from the starting point.

### Key Components & Logic

1.  **Grid Parsing**:
    *   **Separator Detection**: The code identifies the yellow column (value 4) to separate the instruction area (left) from the output canvas (right).
    *   **Start Point**: It locates the 'white' pixel (value 5), which marks the beginning of the path drawing.
    *   **Block Identification**: The code scans the input for non-zero blocks (separated by empty rows) to group the instruction patterns into sequential steps.

2.  **Shape Decoding (`SHAPE_MAP`)**:
    *   The task defines a set of 3x3 pixel patterns. Each pattern corresponds to a specific movement rule:
        *   **Type A (Red U-shape)**: Move 2 units horizontally to the LEFT.
        *   **Type B (Purple V-shape)**: Move 2 units vertically DOWN.
        *   **Type C (Blue shape)**: Move 3 units horizontally to the RIGHT.
        *   **Type D (Green shape)**: Move 4 units horizontally to the LEFT.
    *   The input uses these patterns to provide a sequence of movements that the path must follow.

3.  **Path Execution**:
    *   The solver extracts all shapes in sequence (processing the left column of instruction blocks then the right column of instruction blocks).
    *   It initializes a result grid of the same dimensions as the output area.
    *   It places the starting white pixel.
    *   It iterates through the sequence of instructions, updating the current row (`cur_r`) and column (`cur_c`) based on the orientation (vertical vs. horizontal) and direction (left vs. right) defined in the shape mapping.
    *   For every movement, it fills the corresponding pixels in the output grid with the shape's original color.

### Core Patterns
- The input acts as a **symbolic instruction set**. The geometry of the shapes (3x3 blocks) encodes relative spatial movements (displacement and direction).
- The solution demonstrates an algorithmic approach: **Deconstruct → Map → Reconstruct**. It interprets pixel arrangements as command codes, then performs a simulation to draw the final resulting line path.


## Task 13e47133

### Strategy Overview
The puzzle requires filling grid regions—separated by a specific 'divider' color—with concentric rectangle patterns based on seed pixels (dots) provided within those regions. The solution identifies the background and divider colors, segments the grid into isolated regions, determines the geometry of available sub-rectangles, and applies a periodic color-filling rule based on the distance from the edges of these rectangles.

### Core Logic Steps
1. **Color Identification:** 
   - Counts pixel frequencies to identify the `bg_color` (most frequent).
   - Scans rows and columns to find the longest contiguous segment of a non-background color, designating it the `divider_color`.
2. **Grid Segmentation:** 
   - Uses Breadth-First Search (BFS) to identify distinct, disconnected regions separated by the `divider_color`.
   - Identifies `cut_rows` and `cut_cols` (the lines defined by the divider) to bound valid rectangular spaces for filling.
3. **Bounding Box Extraction:** 
   - Determines candidate rectangles within the segmented areas that do not contain the divider color.
4. **Pattern Generation:** 
   - For each region, it identifies 'dots' (seed pixels with non-background/non-divider colors).
   - Calculates the 'distance' of these dots from the edges of the candidate rectangles (`min(r-r_s, r_e-r, c-c_s, c_e-c)`). 
   - Uses the distance of known seed pixels to determine a repeating color cycle.
5. **Filling:** 
   - Calculates the maximum distance for every pixel in a region from its nearest boundary and assigns a color based on the cycle derived from the seed pixels: `cycle_colors[max_d % cycle_len]`.

### Key Patterns
- **Concentricity:** The code assumes that pixels belonging to the same 'layer' of a rectangular shape share the same color.
- **Divider Geometry:** The divider acts as an impassable barrier, effectively partitioning the grid into independent sub-problems (the regions).
- **Distance-based Logic:** The filling pattern is essentially a 'Manhattan' distance to the nearest rectangle boundary, mapped to a circular sequence of colors found within the region.


## Task 142ca369

### Logic and Strategy
The ARC task 142ca369 involves simulating 'billiard ball' trajectories on a grid. Each task input contains colored shapes ('L' shapes, single pixels, and horizontal/vertical lines). The goal is to draw paths (trajectories) starting from the corner of 'L' shapes. These paths travel diagonally, bouncing off line segments and reflecting based on the positions of single pixels of the same color.

### Core Steps
1. **Grid Analysis (Connected Components):** The solver uses a BFS approach to group connected non-zero pixels. It classifies these shapes into four types: `pixel` (size 1), `L` (3-pixel shape with a corner), `hline`, and `vline`.
2. **Classification Logic:**
    * **L-shapes:** Identified by their bounding box and the presence of a corner cell adjacent to two others. The 'away_dir' (initial vector) is determined by the vector pointing away from the corner.
    * **Lines:** Identified by their orientation (rspan or cspan = 0).
    * **Pixels:** Single isolated cells used as reflection markers.
3. **Billiard Simulation (`fire_billiard` function):**
    * The simulation starts from the 'L' shape corner.
    * It moves step-by-step diagonally.
    * **Collisions:** If the ball encounters an `occupied` cell (like a line segment), it performs a bounce: if it hits a `vline`, the horizontal vector component flips; if it hits an `hline`, the vertical vector component flips.
    * **Reflection:** If the ball reaches the row or column of a `pixel` of the same color, it reflects (reverses the direction of that component).
4. **Handling Unhit Shapes:** If a line segment remains unvisited by a trajectory, the algorithm attempts to extend it toward other same-colored elements by calculating a path based on the line's position relative to the grid center and its partners.

### Key Patterns
* **Reflection Rules:** The game treats lines as hard barriers and single pixels as triggers for reflection, suggesting a physics-like interaction where the ball's trajectory is constrained by the grid's geometry.
* **Connectivity:** The simulation treats color as a key property; only elements of the same color interact to influence the path of a specific ball.


## Task 16b78196

### Strategy Overview
The task involves reassembling "plug-in" shapes into "notches" located on a large central block (the wall). The strategy involves three main phases: identifying shapes and notches, matching shapes to notches based on geometry, and stacking remaining shapes alongside these matches.

### Key Components
1.  **Shape Detection (`_find_shapes`)**: Uses BFS to isolate non-background, non-block components. Each shape is characterized by its relative cell coordinates, bounding box, and location relative to the central block (e.g., left/right for vertical blocks, top/bottom for horizontal).
2.  **Notch Detection (`_find_notches`)**: Identifies structural gaps in the central block. 
    *   For **vertical blocks**, it scans rows for inward deviations from the expected column boundaries.
    *   For **horizontal blocks**, it scans columns for inward deviations from the expected row boundaries.
3.  **Matching & Stacking (`_try_plug_match`, `_tetris_stack`)**:
    *   **Plug Matching**: Tries to fit shapes exactly into the detected notches by verifying if the shape's geometry aligns with the notch profile.
    *   **Tetris Stacking**: Once a primary shape (a "plug") is anchored in a notch, other shapes of the same group are "pushed" toward the block boundary until they collide with the block or already placed shapes.

### Core Logic Steps
*   **Grouping**: 
    *   **Horizontal**: Groups shapes by their bounding-box width. Shapes are assigned to the notch that fits their width and matches their relative position (above/below).
    *   **Vertical**: Assigns a "plug" shape to each available notch and then distributes remaining shapes to the group whose notch it is closest to, prioritizing filling the notches first.
*   **Placement**: Finalizes coordinates for all shapes based on the calculated offsets to ensure they interlock correctly with the central block without overlapping the block or other placed shapes.

### Patterns Identified
- The central block acts as a static anchor.
- Shapes are designed to fill specific irregular voids in the block's perimeter.
- Horizontal configurations favor grouping by width, while vertical configurations favor a proximity-based assignment to notch "plugs."


## Task 16de56c4

### Strategy Overview
The task 16de56c4 involves identifying arithmetic patterns of colored cells within rows or columns. A valid pattern consists of a set of cells of the same color spaced at regular intervals. The solver identifies these "sequences," detects if there is an "anomaly" (a singleton of a different color), and completes or modifies the grid based on whether the singleton disrupts the pattern or acts as a marker for a color change.

### Key Components

1.  **`analyze_line` Function**:
    *   **Goal**: Identify valid color patterns in a 1D slice (row or column).
    *   **Logic**: It groups non-zero cells by color. It looks for a "pattern color" that appears at least twice with a constant spatial gap (spacing). It checks for the presence of at most one "singleton" (a colored cell that doesn't match the primary pattern color).
    *   **Validation**: If a line contains multiple different pattern colors or more than one singleton, it is rejected as a candidate for the transformation.

2.  **`apply_pattern` Function**:
    *   **Goal**: Reconstruct the grid line based on the extracted pattern info.
    *   **Logic**: 
        *   **Standard Case**: If no singleton exists, it extends the pattern color across all positions in the line that follow the identified spacing.
        *   **Anomaly Case**: If a singleton exists, it determines if the singleton is located on the pattern grid. If it is, the code fills the interval between the existing pattern markers and the singleton with the singleton's color. If the singleton is off-pattern, it fills the pattern with the primary color while preserving the original singleton.

3.  **Pattern Execution**:
    *   The solver scans all rows and columns to gather `row_infos` and `col_infos`.
    *   It selects the dimension (rows or columns) with the higher count of valid identified patterns as the primary direction to process, assuming the grid transformations follow the dominant structural orientation.

### Transformation Rules
*   **Regularity**: The puzzle relies on the assumption that sequences of colors are infinite or periodic; the solver projects these sequences to fill the entire length of the row or column.
*   **Singleton Behavior**: Singletons act as indicators for either extending a pattern or defining a range, effectively serving as "instructions" for how the color should be applied within the established grid sequence.


## Task 1818057f

### Strategy Summary
The objective of task 1818057f is to identify specific geometric patterns—specifically 'plus' or 'cross' shapes—within a 2D grid and transform them. The transformation involves changing the color of the cells forming the plus sign from yellow (4) to azure (8).

### Logic and Transformation Steps
1. **Pattern Detection:** The algorithm iterates through every cell in the input grid, excluding the boundary cells (top, bottom, left, and right edges). This exclusion is necessary because a cross pattern requires at least one neighbor in every orthogonal direction (up, down, left, and right).
2. **Constraint Check:** For each cell at `(r, c)`, the code checks if it is yellow (`4`) and if its four immediate neighbors—`(r-1, c)`, `(r+1, c)`, `(r, c-1)`, and `(r, c+1)`—are also yellow (`4`).
3. **Transformation:** If the condition is met, the cell at the center of the cross and all four of its neighbors are updated in the output grid to the color azure (`8`).

### Key Mechanisms
* **Grid Copying:** The original input grid is copied into an `out` variable at the start of the process. This ensures that the transformation of one pattern does not interfere with the detection of overlapping or adjacent patterns during the single pass.
* **Boundary Awareness:** By iterating from `1` to `rows-1` and `1` to `cols-1`, the code safely avoids `IndexError` exceptions that would otherwise occur when checking the neighbors of edge cells.
* **Simultaneity:** Because the algorithm reads from the original `grid` while writing to the `out` grid, all transformations are applied based on the original state of the puzzle, ensuring consistent results regardless of the spatial order of the plus signs found.


## Task 195c6913

### Strategy Overview
The task requires propagating a repeating color pattern along 'snake-like' paths through a 'dark band' (a region of specific background colors). The puzzle uses existing 2x2 blocks of colors on the grid to derive the repeating pattern sequence and identify a terminator color. The solution treats grid-edge cells (markers) as entry points to fill the dark regions systematically.

### Key Components and Logic

1.  **Grid Analysis & Identification**:
    *   **Background Colors**: The code identifies the two most frequent colors as potential background colors to define the 'dark band'.
    *   **Template Extraction**: It searches for 2x2 blocks of rare colors to establish a sequence (pattern). The row containing the most 2x2 blocks is selected as the 'template row', defining the order of colors in the snake.
    *   **Terminator Identification**: A 2x2 block that does not belong to the template row is designated as the 'terminator color', which is placed whenever the path encounters a boundary or an obstacle.

2.  **Marker Detection**:
    *   The code identifies 'markers': specific cells on the grid boundary that match the first color of the template sequence. These serve as the starting points for path propagation.

3.  **Path Propagation (The Snake Logic)**:
    *   **Erasure**: Before propagation, the template and terminator blocks are removed (reset to a neutral/light background color) to prepare the grid for the generated pattern.
    *   **Snake Traversal**: For each marker, the algorithm determines a starting direction (based on its position on the grid edge). It then follows an alternating 'zigzag' movement pattern (e.g., RIGHT then UP) through the grid.
    *   **Filling Rules**: As it traverses, it fills empty dark-band cells with the sequence derived from the template. If it hits an edge or an obstacle, it stops the current leg of the path and, if a boundary was hit, marks the collision with the terminator color.

4.  **Transformation Rule**:
    *   The output grid is effectively a transformed version of the input where the 'dark' space is replaced by a directional, alternating sequence derived from the initial 2x2 block arrangements, successfully filling the negative space of the grid.


## Task 1ae2feb7

### Logic Summary
The puzzle involves a grid divided by a vertical wall (a column of uniform color). The task is to project colored segments found on one side of the wall onto the empty space on the opposite side. The projection follows a periodic pattern: each color group of width `N` repeats its color every `N` cells starting from the wall. If multiple color patterns overlap, those closer to the wall take priority.

### Key Steps & Implementation
1. **Identify the Wall**: The solver locates the wall by calculating the column with the highest frequency of a consistent non-zero color.
2. **Group Identification**: For every row, the algorithm scans for colored pixels on both sides of the wall. It stores the column indices for each unique color to determine the width `N` of each segment and its distance from the wall.
3. **Determine Projection Direction**: 
   - If colored pixels exist on the left, it projects them onto the empty cells to the right of the wall.
   - If pixels exist on the right, it projects them onto the empty cells to the left of the wall.
4. **Pattern Projection**: The projection logic uses the rule: `pos % n == 1`, where `pos` is the 1-based distance from the wall and `n` is the width of the pattern. This ensures the color repeats every `n` cells.
5. **Layering (Z-Ordering)**: The groups are sorted by their distance from the wall (descending). By applying the painting process in this order, colors closer to the wall are processed last, effectively overriding the colors projected from further away as required by the puzzle rules.


## Task 20270e3b

### Strategy Overview
The task requires 'stitching' two yellow (4) shapes together to close the gap between them. These shapes are marked with orange (7) pixels that serve as alignment points (ports). The solution involves identifying the mobile shape, calculating the translation vector needed to align its port with the base shape's port, and generating a tight bounding box filled with the combined geometry.

### Core Components and Logic

1.  **Component Identification (`_find_components`):** 
    The code uses a Breadth-First Search (BFS) to segment all yellow (4) pixels into distinct connected components. This allows the system to isolate the main shapes from potential background noise or disconnected fragments.

2.  **Port Mapping:** 
    The algorithm identifies 'main' components by finding yellow segments adjacent to orange (7) markers. It differentiates between the 'base' (the anchor) and the 'mobile' (the piece to be moved). A sort order is used to ensure the larger component is chosen as the base.

3.  **Translation Vector Calculation:** 
    It identifies the 'face' of the mobile shape (the pixels adjacent to its orange markers). The translation vector $T$ is computed by finding the difference in coordinates between the first orange marker of the base and the corresponding first orange marker of the mobile shape.

4.  **Spatial Reconciliation:** 
    The algorithm iterates through all secondary components. It calculates the minimum distance between each component and the base versus the mobile shape using `_min_dist`. Components are moved alongside the mobile shape if they are closer to it, effectively ensuring that small associated fragments follow their respective parent shapes.

5.  **Output Reconstruction:** 
    Finally, the combined set of points is normalized by finding the new bounding box dimensions (`min_r`, `max_r`, `min_c`, `max_c`). A new grid is created, initialized with blue (1) cells (the background), and the yellow (4) shapes are placed into their new, combined coordinate positions.


## Task 20a9e565

### Strategy Overview
Task 20a9e565 involves extending a pattern (or 'staircase') defined by colored cells into a target area marked by gray (color 5) cells. The solution identifies the geometric logic of the input pattern—specifically whether it is a periodic horizontal band, a nested set of frames, or a staircase tile progression—and recreates that logic within the bounding box of the target area.

### Key Logic Components
1. **Target Identification:** The code locates the output dimensions by finding the bounding box of all color 5 cells (the target area).
2. **Pattern Analysis:** It extracts the non-background, non-target cells to determine the underlying structure:
   - **Horizontal Bands:** If all pattern rows are single-colored, the code calculates the vertical ($y$) and horizontal ($x$) periodicity of the pattern. It then maps the color cycle across the vertical period and fills the target grid based on the derived motif.
   - **Nested Frames:** If the pattern represents concentric rectangles, the code calculates the step width and color alternation. It constructs the output by iteratively layering rectangular frames, alternating colors and increasing dimensions based on the identified pattern logic.
   - **Staircase Tiles:** If the pattern consists of repeating columnar blocks, the code calculates the dimensions and color cycle of these blocks. It then extrapolates the staircase sequence, either maintaining a constant width (handling color transitions) or growing the width/gaps to fit the output grid.

### Implementation Details
- **Helper Functions:** 
  - `_solve_horizontal_bands`: Uses modular arithmetic to determine placement within a repeating grid.
  - `_solve_nested_frames`: Calculates bar widths and alternating geometric centers to build recursive frame structures.
  - `_solve_staircase`: Extracts pattern 'tiles', determines the repetition cycle, and fills the target grid using the inferred progression logic.
- **Pattern Recognition:** The code relies heavily on finding relative distances between rows/columns to determine periods (`x_period`, `y_period`) and color cycles (`cycle_len`). It uses mathematical rounding and modulus operations to handle cases where the output grid size deviates from the input source pattern.


## Task 21897d95

### Strategy Overview
This puzzle involves identifying colored regions in a grid and "flow" operations dictated by T-shaped markers (arrows). The logic transforms the input by processing these markers to transfer colors between adjacent regions or rotating the grid structure.

### Core Logic and Steps
1.  **Region Identification:** The solver performs connected-components analysis to group the grid into distinct colored blocks. It identifies "marker" cells (color 1) which form the arrows.
2.  **Arrow Detection:** The function `_detect_t_arrows` scans the grid for T-shaped patterns (three cells surrounding a central cell). 
    *   The orientation of the "T" determines the arrow's direction.
    *   The central cell is checked for its color: if it is not 1, it acts as a 'payload' (the color to be transferred).
3.  **Grid Cleaning:** Since arrows are overlaid on the blocks, `_clean_grid` replaces these marker cells with the dominant color of their immediate neighborhood, effectively reconstructing the underlying geometric structure of the grid.
4.  **Flow Application:** The solver uses the detected arrow direction to find an adjacent region. The target region's color is then updated (overwritten) by the flow color, which is either the color of the payload or the source region's original color.
5.  **Output Transformation:**
    *   For **Square Grids**: It uses a per-pixel remapping approach to handle diagonal boundaries.
    *   For **Non-Square Grids**: It performs a grid rotation (90 degrees, CW or CCW) based on the aspect ratio and detected block patterns, then expands the modified block grid back into the final output dimensions.

### Key Helpers
*   `_detect_t_arrows`: Identifies the direction, location, and potential color payload of all arrow markers.
*   `_clean_grid`: A recovery heuristic that fills in "holes" left by markers using spatial consensus (the most common neighbor color).
*   `_solve_square`: A specialized function for uniform square grids that avoids block-alignment issues by operating directly on individual pixels.


## Task 221dfab4

### Strategy Overview
The task involves identifying a 'marker' (a small set of colored pixels) on the edge of the grid that initiates a 'beam' traveling across the grid. This beam follows a periodic 6-step pattern. When the beam hits a specific phase (index 4 in the 0-5 cycle), it interacts with existing shapes in the grid by recoloring them to green (3).

### Core Logic
1. **Identify Background and Colors**: The solution first identifies the background color (most frequent) and distinguishes between the 'marker color' (least frequent among non-background cells) and the 'shape color' (most frequent among non-background cells).
2. **Determine Beam Direction**: By grouping the marker coordinates, the code determines if the marker lies on a row (horizontal marker causing a vertical beam) or a column (vertical marker causing a horizontal beam).
3. **Beam Propagation**: The beam travels across the grid starting from the marker's edge. It moves cell by cell in the determined direction, tracking a `phase` using `d % 6`.
4. **Pattern Application**:
   - **Phase 0 & 2**: The beam line is painted with the `marker_color`.
   - **Phase 4**: The beam line is painted green (`3`).
   - **Interaction**: At `phase == 4`, the logic checks if any 'shape' pixels lie on the current beam row/column. If they do, those shape pixels are also turned green (`3`).
   - **Other Phases**: The beam line is reset/painted with the background color.

### Key Functions/Variables
- `bg`: Most frequent color in the grid.
- `marker_cells` & `shape_set`: Categorizes grid pixels into the triggering mechanism and the targets to be modified.
- `phase`: A modulo-6 counter that dictates the beam's visual state as it propagates.
- `step`: Determines the direction (+1 or -1) the beam moves based on whether the marker is on the lower or upper half of the grid.

### Rule Summary
The beam acts as a scanner. The repetition pattern (Marker-BG-Marker-BG-Green-BG) means every 6th step is a 'Green' event that transforms any object segment it overlaps into a green segment.


## Task 247ef758

### Strategy Summary
The task 247ef758 involves transforming an input grid that contains 'shapes' on the left side and 'marker' coordinates defined by the borders on the right side. The goal is to clear the original shapes and reproduce them at the grid intersections defined by the rows marked on the left border and the columns marked on the top border, matching the shape's color to the corresponding border marker.

### Core Logic and Steps
1. **Identify Grid Sections**: The code identifies a vertical divider (a column of identical, non-zero values) which splits the grid into the 'source' area (left) and the 'target' area (right).
2. **Extract Markers**: It scans the left and top borders of the target area. Any value differing from the most common border color is treated as a marker, mapping a specific color to a set of row indices (`left_markers`) or column indices (`top_markers`).
3. **Extract Shapes**: It identifies distinct colored shapes in the left area, grouping pixels by their color.
4. **Shape Normalization**: For each shape found, the code calculates its geometric center. It converts the absolute coordinates of the pixels into relative coordinates (`pixel_row - center_row`, `pixel_col - center_col`) to allow the shape to be moved while maintaining its relative structure.
5. **Placement**: For every color that has markers on both the left and top borders, the code:
   - Erases the original shape from the left area.
   - Iterates through all intersections (`marker_row`, `marker_col`).
   - Projects the normalized shape pixels onto the grid centered at each intersection, ensuring the new shape is placed correctly within the target bounds.

### Key Patterns and Transformations
- **Intersection Logic**: The logic assumes that if a specific color exists in both border sets, it serves as a coordinate signal. The intersection of the row defined by the left border and the column defined by the top border acts as the anchor point (center) for the shape.
- **Overwriting**: The shapes are processed in a specific order (sorted by their original vertical position) to ensure that when shapes overlap in the target area, the intended visibility is maintained.
- **Geometric Centering**: By calculating the bounding box and shifting coordinates to a relative system, the code ensures that shapes are perfectly reconstructed regardless of their original position or size.


## Task 269e22fb

### Logic and Strategy
The ARC task 269e22fb involves identifying a hidden 20x20 structure within a smaller input grid. The core insight is that every input grid is a sub-region (a crop) of a single, fixed, global 20x20 pattern (defined as `MASTER` in the code). The solution strategy is to brute-force all possible transformations and sub-grid alignments of the `MASTER` pattern to match the provided input grid.

### Key Components
*   **The Master Pattern**: A static 20x20 grid containing values 7 and 8. The task assumes that all input grids are derived from this matrix.
*   **Orientations (`_orientations`)**: Since the target pattern can be rotated or reflected, the code generates all 8 symmetries of the `MASTER` grid (4 rotations $\times$ 2 reflections/flips).
*   **Color Mapping**: The input grids use two colors. Because the original `MASTER` grid uses colors 7 and 8, the solver iterates through the two possible color mappings (swapping the input colors to match the master colors) to account for variations in palette assignment.
*   **Sliding Window Search (`solve`)**: 
    1. It iterates through all 8 orientations of the `MASTER` grid.
    2. It tests both possible color assignments.
    3. For every orientation, it treats the master grid as a search space and checks every possible sub-rectangle (window) of size `rows x cols` (the dimensions of the input grid).
    4. If the sub-rectangle matches the input grid perfectly, it returns that full 20x20 transformed grid as the output.

### Pattern Transformations
*   **Rotations**: The `_rot90` helper function rotates the grid 90 degrees clockwise.
*   **Reflections**: The `_fliph` helper function performs a horizontal reflection.
*   **Alignment**: The nested loops `range(21 - rows)` and `range(21 - cols)` effectively perform a sliding window scan across the 20x20 space to find where the input grid "fits" into the larger master structure.


## Task 271d71e2

### Strategy Overview
The solution treats the ARC task 271d71e2 as a physical simulation where rectangular 'boxes' move along 'rails' (maroon lines). The core logic is to detect each box, determine its potential slide distance based on the position of distant rail lines, and update its interior state (filling grey cells with orange cells) proportionally to the distance moved. 

### Core Steps
1. **Box Detection**: The code uses a BFS (Breadth-First Search) approach to identify contiguous regions of '0' (border), '5' (grey interior), and '7' (orange interior). It computes the bounding box for each structure.
2. **Movement Analysis**: For every box, it checks the four cardinal directions to see if it is adjacent to a continuous 'maroon rail' (color 9) of equal width or height. If such a rail exists, it identifies the distance to the next rail in that direction.
3. **Constraint Resolution**: The movement distance is capped by the number of grey cells currently inside the box, effectively limiting how far it can slide before it is 'full'.
4. **Grid Reconstruction**:
   - **Slide**: The box coordinates are shifted based on the calculated movement.
   - **Fill**: The box interior is populated with orange cells (7) based on a specific sweep order (e.g., top-to-bottom for UP-moving boxes, right-to-left for RIGHT-moving boxes). The number of orange cells becomes `original_orange_count + movement`.
   - **Render**: The new rail positions are updated on the grid, ensuring the 'far' and 'near' rails are maintained according to the simulation result.

### Patterns and Transformations
- **Directional Fill**: The filling pattern is deterministic and dependent on the direction of movement. This mimics a 'sliding' mechanism where the new orange space is created at the side of the box opposite to the movement direction.
- **Rail Dynamics**: The maroon lines (color 9) act as tracks. When a box moves, the rail configuration is updated to reflect the new box position, effectively 'clamping' the box between its start and end points.
- **Constraint Rules**: The transformation is strictly limited by the available grey (empty) space, implying that a box cannot slide further than its capacity to fill its interior with orange cells.


## Task 28a6681f

### Strategy Overview
The task 28a6681f, "Staircase Interior Fill," involves identifying and filling the interior gaps of staircase-like structures with the color blue (1). The core constraint is that the total count of blue pixels in the output must equal the count of blue pixels found in the input grid.

### Logic Steps
1. **Pre-processing**: The original blue pixels are removed from the input grid, creating a 'clean' background. The number of blue pixels ($N$) is cached to act as a quota.
2. **Cell Classification**: Every empty cell (0) is classified based on its horizontal neighbors:
   - **Type A**: Cells positioned between two non-background cells of the *same color*. These represent the "interior" of the staircase.
   - **Type B**: Cells that have a wall to their left but no corresponding same-color wall to the right. These represent "open side" extensions.
3. **Validation**: Since Type A cells could represent gaps anywhere, the algorithm applies a spatial constraint: a Type A cell is only considered valid if it sits on the bottom edge of the grid or directly on top of another filled interior cell (or wall). This ensures the fill propagates upward from the base of the structure.
4. **Filling Strategy**:
   - All validated Type A cells are filled first, provided the pixel quota $N$ is not exceeded.
   - Any remaining pixel count is filled into Type B cells, starting from the bottom of the grid and moving upwards (row by row), until the total count matches $N$.

### Key Mechanisms
- **Bottom-to-Top Filling**: By iterating through coordinates with a negative row index sort key (`-x[0]`), the algorithm ensures the staircase fills from the ground up, maintaining the structure's physical integrity.
- **Conservation of Matter**: The algorithm strictly enforces the total blue count ($N$), using it as a stopping condition for both Type A and Type B filling processes. This ensures the output is neither over-filled nor under-filled.


## Task 291dc1e1

### Overview
This solution addresses ARC task 291dc1e1 by treating the input grid as a layout containing scattered objects (blocks) defined by background-color (8) boundaries. The goal is to identify these objects, sort them based on their original spatial configuration relative to colored borders, and stack them vertically in a centered format.

### Core Strategy
1.  **Coordinate & Orientation Sensing**: The code identifies a corner of the grid containing a 0, then checks the adjacent colored borders (Blue/1 and Red/2) to determine the reading order and orientation. 
2.  **Object Extraction**: Using Breadth-First Search (BFS), the algorithm isolates connected non-background regions into individual blocks, capturing their spatial bounding box coordinates.
3.  **Spatial Sorting**: 
    *   It determines a 'Primary' axis (along the blue border) and a 'Secondary' axis (along the red border).
    *   It groups objects into bands (rows or columns) based on their positions and sorts them within those groups according to the identified grid orientation.
4.  **Transformation & Stacking**: If the primary axis is vertical (column-based), objects are rotated 90° CCW to ensure they are presented horizontally. Finally, all objects are stacked vertically, centered horizontally within a canvas defined by the widest object.

### Key Helper Functions
*   `_group_by_rows` / `_group_by_cols`: These functions perform range clustering to identify 'bands' of objects. By calculating the row/column spans of objects and merging overlapping intervals, the code organizes the objects into the sequence they appear on the input grid.
*   **BFS Logic**: The nested loop iterates through the interior grid to find connected components of non-8 values, treating them as individual entities.
*   **Rotation & Centering**: The use of `np.rot90` adjusts the orientation of objects, while simple arithmetic (`(max_w - w) // 2`) handles the padding required for centering the blocks in the output grid.

### Patterns Identified
*   **Reading Order**: The placement of colors 1 and 2 on the borders serves as a coordinate system mapping. If blue is on the row, the layout follows a left-to-right (or right-to-left) progression; if on the column, it follows a top-to-bottom (or bottom-to-top) progression.
*   **Spatial Context**: The task assumes that objects should be re-ordered based on their original grid position and transformed into a unified, centered vertical list.


## Task 2b83f449

### Strategy Overview
The task 2b83f449 involves transforming a grid characterized by alternating rows of patterns. The logic identifies sequences of `777` as anchor points on odd-numbered rows, replaces them with `868`, and then propagates information vertically to even-numbered rows. The primary goal is to reconfigure `3`s into `8`s or maintain specific spatial relationships based on the placement of these anchors.

### Core Steps and Logic
1.  **Anchor Identification**: The algorithm scans odd rows for `777` patterns. It records the center column index of these patterns to create a reference map (`centers`).

2.  **Odd-Row Transformation**: 
    - Each identified `777` is transformed into `868` (setting the center index to color `6`).

3.  **Even-Row Processing**:
    - **Vertical Propagation**: It checks columns aligned with the `6`s found in adjacent odd rows. These positions in the even row are also marked as `6`.
    - **Segment Analysis**: Even rows are split into segments by `0` (black) cells. Within these segments, the algorithm determines the influence of anchors from the row above ('A') versus the row below ('B').
    - **Transformation**: 
        - Existing `3`s that are not occupied by the propagated `6`s are converted to `8`s.
        - It selectively places `3`s at the edges of segments based on whether an anchor from 'A' is present and whether the segment is considered "pairable" (i.e., not on the final row and meeting width constraints).

4.  **Boundary Suppression**: 
    - To resolve conflicts where two segments meet at a `0` cell, the algorithm evaluates the proximity of 'A'-anchors. If a boundary exists between two segments that both contain anchors from the row above, it intelligently suppresses one of the anchors (setting it to `8`) based on distance, ensuring the output structure remains consistent with the observed pattern rules.


## Task 2ba387bc

### Overview
The task involves identifying pairs of 4x4 rectangular structures within a larger grid and rearranging them into a new output grid. The objects are classified into two categories: **solid blocks** (all cells are the same color) and **frames** (a hollow 4x4 square with a border of one color and an empty 2x2 center). The solution extracts these objects, pairs them by their appearance order, and arranges them into a consolidated 4x8-width output grid.

### Core Logic and Strategy
1. **Object Detection**: The algorithm scans the input grid to find 4x4 blocks. It uses a `visited` mask to ensure each block is only processed once.
2. **Classification**: 
   - A **solid block** is identified if every cell within the 4x4 area matches the color of the top-left corner.
   - A **frame** is identified if the outermost 12 cells form a border of the same color, while the inner 2x2 square consists of 0s (background).
3. **Sorting**: Detected objects are collected into lists and sorted by their row and column coordinates (top-to-bottom, left-to-right).
4. **Reconstruction**: The algorithm creates a new grid with a height of `4 * number_of_pairs` and a width of 8. It then places the `i-th` frame in the left 4x4 quadrant and the `i-th` solid block in the right 4x4 quadrant of the corresponding row segment.

### Key Steps
- **Iteration**: The code traverses the input grid using a sliding window of 4x4 pixels.
- **Filtering**: By explicitly checking for `border_ok` (for frames) and `all == color` (for solids), the code effectively ignores background noise or partial shapes.
- **Mapping**: The output format standardizes the relationship between the 'frame' and 'solid' types found in the messy input grid, essentially organizing the extracted components into a clean side-by-side array.


## Task 2c181942

### Strategy Overview
The goal of task 2c181942 is to identify a central cross pattern made of four distinct colored arms and to 'extend' each arm by attaching an external shape of the same color, effectively mapping specific color-coded pieces onto the corresponding sides of the cross.

### Key Logic and Steps
1. **Pattern Detection:** 
   - The algorithm searches for a 4x4 subgrid representing the 'hub' of a cross. 
   - It identifies the background color (8) and ensures the four arms (top, bottom, left, right) have distinct non-background colors.
   - It defines the center and captures the colors and coordinates of these arms.

2. **Shape Extraction:**
   - It scans the rest of the grid for non-background cells that are not part of the central cross.
   - These cells are grouped by color into individual `color_cells` lists, representing the shapes waiting to be attached.

3. **Alignment and Rotation:**
   - For each color arm, the solver treats the color-coded shape as a bounding box.
   - It attempts all 4 rotations (90-degree increments) for each shape.
   - It checks if a specific side of the rotated shape matches the interface dimension and 'flatness' required to attach to the corresponding arm of the cross hub.

4. **Transformation:**
   - Once the best-fitting rotation is determined, the shape is placed adjacent to the corresponding side of the hub. 
   - The new grid (`out`) is initialized with the background color, the central cross is preserved, and the newly oriented shapes are added according to their calculated alignment offsets.

### Patterns and Rules
- **Color Mapping:** Each arm color acts as a unique identifier for a specific piece scattered elsewhere in the grid.
- **Geometric Matching:** The interface of the piece must align with the flat edge of the hub arm. The solution assumes that if a shape is a perfect match for that arm's orientation, it will be added to the output. 
- **Spatial Placement:** Shapes are placed precisely adjacent to their respective arms, maintaining the spatial logic established by the hub's orientation.


## Task 2d0172a1

### Strategy Overview
The goal of task 2d0172a1 is to reconstruct a symmetrical, ring-based geometric pattern from a noisy or simplified input grid. The solution approach interprets the grid as a layering of concentric "rings" or "depths" defined by the foreground-background structure. It calculates a distance-like metric from the edges and the foreground object to identify the topological structure, then projects this structure onto a clean, smoothed coordinate system.

### Core Components

1.  **Grid Analysis (`compute_ring_grid` & `transition_depth`):**
    *   `ring_1d`: Calculates a depth-based ring value for a sequence, incrementing the value each time a foreground color block is encountered.
    *   `compute_ring_grid`: Extends this to 2D by calculating ring values from all four directions (left, right, top, bottom) for every cell and taking the minimum of these values to determine the "ring depth" of each pixel.
    *   `transition_depth`: Uses a Dijkstra-like algorithm to determine the minimum number of color transitions needed to reach each pixel from the boundary, providing a secondary measure of depth.

2.  **Structuring the Interior (`get_interior` & `collapse`):**
    *   `get_interior`: Identifies the internal core of the foreground object, ignoring the background noise outside.
    *   `collapse`: Reduces sequences of ring values to unique, monotonic segments by removing consecutive identical values.

3.  **Profile Merging & Smoothing (`dedup_merge_with_gaps` & `compute_smooth_ring`):**
    *   The solution extracts "profiles" for each row and column. These profiles are merged and de-duplicated to handle potential irregularities.
    *   `compute_smooth_ring` ensures that the ring structure is symmetrical around a central "peak" by smoothing out secondary bumps, maintaining a consistent growth/decay of the ring pattern.

4.  **Grid Reconstruction (`solve`):**
    *   The code identifies a `peak_row` and `peak_col` corresponding to the center of the geometric feature.
    *   It reconstructs the grid by comparing the smoothed row and column profiles. A pixel at `(r, c)` is colored foreground if the `min` of the current row and column's ring profiles indicates it belongs to a "foreground" layer (i.e., odd-numbered ring values).
    *   Special handling is provided for peak rows/columns to maintain the integrity of the center lines.


## Task 31f7f899

### Strategy Overview
The task involves identifying vertical colored bars that intersect a horizontal purple (color 6) line. The transformation requires reordering these bars based on their vertical length (extent) such that the total length of the bars increases from left to right across the grid. The azure (color 8) background is treated as empty space.

### Key Steps of the Solution
1. **Locate the Axis:** The algorithm identifies the 'center row'—the row containing the most purple cells. This serves as the anchor point for all vertical lines.
2. **Identify Vertical Lines:** For each column, the algorithm checks for a color other than purple or background. It calculates the vertical extent above and below the center row to determine the total length of each line segment.
3. **Extraction & Sorting:**
   - Each line is stored as a tuple containing its original column index, color, and its 'above' and 'below' extents.
   - The list of extents (pairs of above/below lengths) is extracted and sorted in ascending order based on the sum of the lengths (total size).
4. **Grid Reconstruction:**
   - A new grid is initialized with the background color (8) and the central purple line.
   - The algorithm iterates through the original column positions and assigns the sorted extent pairs to the columns in their original sequence, effectively 'reordering' the lengths while keeping the colors in their original horizontal slots.

### Patterns & Transformations
- **Spatial Invariance:** The horizontal position of each colored bar remains constant; only the vertical extents are permuted.
- **Sorting Criterion:** The complexity of the puzzle lies in recognizing that the relative vertical dimensions of the lines are 'shuffled' or 'sorted' to form a specific progression (e.g., shortest to longest) across the grid.


## Task 332f06d7

### Strategy Overview
Task 332f06d7 involves identifying a square block of black cells (0) and moving it to a new location in the grid. The puzzle logic determines the size of this block, identifies a target 'path' color (the dominant color excluding the background and specific markers), performs a BFS to find all reachable valid positions, and moves the black square to the furthest valid position or a position determined by a red marker.

### Key Steps and Logic
1. **Identify Environment and Objects**: 
   - The code calculates the **background color (`bg`)** by finding the most common color on the grid border.
   - It locates the **black square** by finding all cells with value `0` and determining its dimensions `N` based on the bounding box of these cells.
   - It identifies the **path color** by counting occurrences of all non-background, non-black, and non-red colors; the most frequent one is selected as the fill color.

2. **Pathfinding (BFS)**:
   - The code uses a Breadth-First Search (BFS) to map all valid positions where the `N x N` square can exist. 
   - `is_valid(r, c)` checks if the square can fit within the grid boundaries and ensures it does not overlap with any background cells.

3. **Determine Target Destination**:
   - It tracks the maximum distance reached during the BFS.
   - If a **red cell** (marker) is present in the input, the destination is chosen as the valid `N x N` location that is closest to the red cell's position.
   - If no red marker is found, it defaults to the furthest reachable valid position found during the search.

4. **Grid Transformation**:
   - The original position of the black square is filled with the identified **path color**.
   - The target position (the selected `dest`) is then filled with `0` (black).

### Patterns Identified
- The black square acts as a movable object that 'paints' its previous location with the background path color.
- The grid's empty or path-like spaces define the bounds for movement, often restricted by the 'background' color which acts as an obstacle for the black square.


## Task 35ab12c3

### Strategy Overview
The task requires reconstructing geometric shapes (polygons or paths) defined by sparse points of a specific color and then propagating 'companion' colors based on a fixed spatial offset relative to the primary shape. The solution treats the grid as a graph where vertices of the same color are connected if they form straight, diagonal, or orthogonal lines.

### Key Steps

1.  **Color Grouping**: The code first identifies all non-zero cells and groups them by their color. Colors represented by only one cell are flagged as potential 'companions'.

2.  **Companion Mapping**: For single-cell colors, the script searches for an adjacent multi-cell color ('primary color'). It records the spatial offset (`dr`, `dc`) between the single cell and the neighboring primary color cell. This defines the 'shadow' relationship.

3.  **Shape Reconstruction**:
    *   **Graph Construction**: For each multi-cell color, it builds an adjacency list by checking if pairs of cells of that color lie on a straight line (orthogonal or diagonal).
    *   **Path/Cycle Finding**: It determines the optimal order of vertices to connect the cells. It checks if the vertices can form a closed polygon (cycle) using angular sorting around a centroid or a Hamiltonian path using Depth-First Search (DFS).
    *   **Drawing**: Once the order is determined, it draws lines between consecutive vertices, filling the grid with the primary color.

4.  **Shadow Propagation**: Finally, the code iterates over the newly drawn primary shapes. For every cell belonging to a primary color, it looks for the defined 'companion' offset. If the calculated position in the grid is empty, it places the companion color there, effectively 'shadowing' the primary shape.

### Core Rules
*   **Connectivity**: A 'line' exists between two cells if they are on the same row, column, or diagonal.
*   **Geometric Priority**: Closed shapes (cycles) are prioritized over simple paths to correctly draw complex boundaries.
*   **Dependency**: Companion colors are dependent on the final placement of the primary color shapes; thus, primary shape reconstruction must finish before the companion shadows are rendered.


## Task 36a08778

### Strategy Overview
Task 36a08778 involves extending vertical "purple" lines (color 6) downward from their starting positions until they encounter "red" barriers (color 2). When a line hits a red barrier, it acts like a light beam hitting an obstacle: it creates a horizontal connection (a bracket) along the top of the barrier and then reflects or splits to the sides of that barrier, continuing its downward path from the new positions.

### Core Logic
1. **Initialization**: Identify all initial purple cells (color 6) and note their column indices. These act as the starting 'active' columns.
2. **Barrier Detection**: Map all contiguous segments of red cells (color 2) row by row. These define the horizontal obstacles that trigger the redirection of the purple lines.
3. **Propagation (The Loop)**:
   - Iterate row-by-row starting from the purple markers.
   - **Filling**: For every active column, if the cell is not blocked by a red bar, paint it purple.
   - **Collision & Redirection**: If a red bar exists in the next row, determine which active columns will strike the bar (those with indices between the bar's start and end).
   - **Bracket Creation**: Upon collision, draw a horizontal bracket across the top of the bar (including the edges) to color it purple.
   - **State Update**: Remove the columns that hit the center of the bar from the active set and add the columns corresponding to the left and right edges of the bar, effectively moving the 'flow' to the outside of the obstacles.

### Key Transformations
- **Vertical Extension**: The purple lines naturally move downward through empty space.
- **Lateral Redirection**: The logic implements a specific rule where hitting a red segment causes the 'beam' to spread to the boundary of the red segment, changing the active column tracking from the interior of the bar to the outer edges.
- **Persistence**: Once a column is added to the `extending` set, it continues to propagate downward through all subsequent rows unless it encounters another obstruction.


## Task 38007db0

### Strategy Overview
The task involves identifying a grid partitioned into smaller, uniform rectangular panels by divider lines (the `border_color`). Within each horizontal strip of panels, there is exactly one panel that contains a unique pattern compared to the others. The goal is to identify these 'odd-one-out' panels and stack them vertically to form the final output grid.

### Core Logic
1. **Segmentation**: The code first identifies the `border_color` from the corner of the input grid. It scans for rows and columns consisting entirely of this color to determine the grid segments (panels).
2. **Extraction**: Using the identified border lines, the code defines boundaries for each panel. Two helper functions are used:
   - `get_panel`: Extracts the full contents of the panel, including its internal border.
   - `get_panel_interior`: Extracts only the content inside the panel, excluding the surrounding border lines.
3. **Pattern Identification**: For each row of panels (a horizontal sequence of panels separated by vertical dividers), the code collects the 'interior' patterns and uses a `Counter` to determine which interior occurs only once. 
4. **Reconstruction**: 
   - The code selects the full panel (including its border) for every identified 'odd-one-out' panel.
   - These selected panels are concatenated vertically.
   - It performs a final cleanup to remove redundant border lines that occur where the selected panels join, ensuring the final output adheres to the expected grid structure.

### Key Patterns and Transformations
- **Odd-One-Out Rule**: This is the primary logic constraint. In every horizontal segment of the input, the puzzle implicitly asks to classify the variations and discard the repeats, keeping only the unique pattern.
- **Border Handling**: The solution correctly recognizes that borders are metadata defining the structure and must be handled carefully when extracting and re-stacking components to avoid duplication of separator lines.


## Task 3a25b0d8

### Logic Overview
The ARC task 3a25b0d8 involves two distinct shapes within a grid that share a common 'border' color. One shape is 'filled' (containing regions of varying colors), and the other is an 'outline' (containing empty background interior chambers). The goal is to transfer the interior colors from the filled shape to the corresponding chambers in the outline shape based on their spatial position.

### Core Strategy
1. **Identify Components**: The solver determines the background and border colors using frequency counting. It then separates the grid into two distinct shapes—a 'filled' shape and an 'outline' shape—using BFS to identify connected components of non-background cells.
2. **Isolate Regions**: 
   - For the **filled shape**, it extracts contiguous, same-colored internal regions.
   - For the **outline shape**, it identifies empty 'chambers' (background cells completely enclosed by the border).
3. **Coordinate Matching**: The solver calculates the **normalized centroid** for each colored region in the filled shape and each empty chamber in the outline shape. Normalization ensures that shapes of different sizes or aspect ratios can be mapped to one another consistently.
4. **Color Transfer**: For every chamber in the outline shape, the solver finds the closest colored region from the filled shape by minimizing the Euclidean distance between their normalized centroids. The chamber is then filled with the corresponding color from the matched region.

### Key Helpers & Steps
- **`bbox` function**: Calculates the rectangular bounding box for a set of coordinates to isolate the two shapes into subgrids.
- **Flood-fill (BFS)**: Used twice—once to group cells by shape connectivity, and again to isolate specific internal chambers versus external background areas.
- **Normalized Centroids**: `(row_centroid / height, col_centroid / width)` is used to map spatial features between the filled shape and the outline shape, even if the shapes have different dimensions.
- **Distance Mapping**: Uses a simple nearest-neighbor approach in the normalized coordinate space to determine which color from the source shape belongs in which cavity of the target outline.

# UML Class Diagram Generator

An interactive, responsive, web-based **UML Class Diagram Generator** built with React.js, Vite, and React Flow. This tool enables software engineers, students, and system architects to visually design UML class diagrams and automatically generate production-ready **Java source code** in real-time.

---

## Features

- **Interactive UML Diagramming**:
  - Drag-and-drop canvas powered by React Flow with custom UML class nodes and relation connectors.
  - Standard 3-section UML Class notation (Class Name, Attributes, Methods).
  - UML visibility indicators (`+` public, `-` private, `#` protected, `~` package-private).
  - Visual indicators for `static` (underlined), `final` (constant), and `abstract` members.
  - Interactive connection handles allowing intuitive drag-to-connect relationship creation.

- **Standard UML Relationships**:
  - **Association**: Solid line with customizable labels and multiplicity indicators (`1`, `*`, `0..1`, `1..*`, `0..*`).
  - **Inheritance**: Solid line ending with a standard UML hollow triangular arrowhead pointing toward the superclass (`Dog extends Animal`).
  - **Dependency**: Dashed connector line with an open arrow pointing to the depended-upon class (`Order ---> PaymentService`).

- **Live Java Code Generation Engine**:
  - Real-time generation of clean, idiomatic Java source files for every class in the diagram.
  - Translates inheritance into `public class Child extends Parent`.
  - Translates associations into strongly typed fields (e.g., `private List<Course> courses;` for `*` multiplicity or `private Course course;` for single multiplicity).
  - Automatically imports required Java packages (`java.util.List`, `java.util.ArrayList`, `java.util.Map`, `java.util.Date`, `java.math.BigDecimal`) without redundant imports.
  - Generates getters, setters, and constructors for attributes.
  - Generates dependency methods for service/utility interactions.

- **Built-in Java Code Viewer**:
  - Integrated Monaco Editor with full Java syntax highlighting, line numbers, and dark/light mode synchronization.
  - Multi-file tabs (`User.java`, `Order.java`, `Product.java`).
  - One-click **Copy to Clipboard**.
  - **Single File Download** (`.java`) and **Download All as ZIP** (`JavaSources.zip`) using JSZip.

- **State Management & History**:
  - Centralized Zustand store for robust state management.
  - Full **Undo (`Ctrl+Z`)** and **Redo (`Ctrl+Y`)** support across all diagram operations.
  - Automatic relationship cascading (deleting a class automatically deletes connected relationships and alerts the user).

- **Persistence & Export**:
  - **Local Storage Persistence**: Save and reload your diagram anytime (`Ctrl+S`).
  - **JSON Export / Import**: Export complete diagram models as JSON and import existing diagram files.
  - **High-Resolution PNG Export**: Export clear diagram images directly from the canvas via `html-to-image`.

- **Layout & Productivity**:
  - **Auto Layout**: Uses the Dagre hierarchical graph layout engine to automatically align and space classes.
  - **Pre-configured Sample Diagrams**: E-Commerce System, Animal Hierarchy (Inheritance), University Management, and Blank Canvas.
  - **Keyboard Shortcuts**: Delete, Undo, Redo, Save, and Escape shortcuts for maximum efficiency.
  - **Dark & Light Mode**: Seamless theme toggle with CSS variable design system, persisted in localStorage.
  - **Responsive Design**: Adapts fluidly across desktop, laptop, tablet, and mobile devices.

---

## Technologies Used

- **Frontend Core**: React 19, Vite, HTML5, CSS3
- **Canvas / Diagramming**: `@xyflow/react` (React Flow v12)
- **State Management**: `zustand`
- **Code Viewer**: `@monaco-editor/react` (Monaco Editor)
- **Automatic Graph Layout**: `dagre`
- **Exporting**: `html-to-image` (PNG Export), `jszip` (ZIP Archive Download)
- **Icons**: `lucide-react`

---

## Installation

Ensure you have **Node.js** (v18 or newer) installed on your machine.

1. Clone or navigate to the repository directory:
   ```bash
   cd UMLGenerator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open the displayed local server address in your web browser (typically `http://localhost:5173/`).

---

## Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx             # Top bar: Brand, New, Save, Load, Examples, Export, Theme
│   │   ├── Toolbar.jsx            # Action bar: Add Class, Relationships, Auto Layout, Undo/Redo
│   │   ├── Sidebar.jsx            # Left panel: Elements tree, search, quick actions
│   │   └── PropertiesPanel.jsx    # Right panel: Inspector for classes, relationships, and stats
│   │
│   ├── uml/
│   │   ├── UMLCanvas.jsx          # React Flow canvas with custom nodes, edges, and controls
│   │   ├── UMLClassNode.jsx       # 3-section standard UML Class node with handles
│   │   ├── RelationshipEdge.jsx   # Association, Inheritance (triangle), Dependency (dashed)
│   │   ├── ClassEditor.jsx        # Class property inspector & inline editor
│   │   ├── AttributeEditor.jsx    # Attribute listing and action controls
│   │   ├── MethodEditor.jsx       # Method listing and action controls
│   │   └── RelationshipEditor.jsx # Relationship inspector & multiplicity editor
│   │
│   ├── code/
│   │   ├── CodePanel.jsx          # Bottom panel with file tabs, copy, download, zip export
│   │   └── CodeViewer.jsx         # Monaco Editor wrapper with Java syntax highlighting
│   │
│   ├── dialogs/
│   │   ├── AddClassDialog.jsx     # Modal for creating new classes with validation
│   │   ├── EditClassDialog.jsx    # Modal for editing class name and abstract status
│   │   ├── AttributeModal.jsx     # Add/edit attribute dialog with types and modifiers
│   │   ├── MethodModal.jsx        # Add/edit method dialog with multi-parameter list
│   │   ├── RelationshipModal.jsx  # Add/edit relationship dialog with types and multiplicities
│   │   ├── ConfirmDeleteDialog.jsx# Warning modal showing connected relationship count
│   │   ├── ShortcutsDialog.jsx    # Keyboard shortcuts cheatsheet
│   │   └── ModalManager.jsx       # Global dialog router
│   │
│   └── common/
│       ├── Button.jsx             # Reusable button with variants and icons
│       ├── Input.jsx              # Form input with validation states
│       ├── Select.jsx             # Styled select dropdown
│       ├── Modal.jsx              # Accessible modal dialog with backdrop & ESC support
│       └── Toast.jsx              # Lightweight notification toast system
│
├── store/
│   └── umlStore.js                # Centralized Zustand store with undo/redo & localStorage
│
├── utils/
│   ├── codeGenerator.js           # Java source code generation engine
│   ├── umlValidation.js           # Java identifier, keyword, and relationship validation
│   ├── exportUtils.js             # PNG, JSON, and ZIP export utilities
│   ├── layoutUtils.js             # Dagre graph auto-layout algorithm
│   └── sampleData.js              # Pre-loaded sample UML diagrams
│
├── data/
│   └── defaultDiagram.js          # Initial default diagram (E-Commerce)
│
├── App.jsx                        # Main application layout and global shortcut listeners
├── App.css                        # Layout utilities
├── main.jsx                       # React root entry point
└── index.css                      # Design system and theme variables (Dark/Light)
```

---

## How to Use

1. **Creating a Class**:
   - Click **"+ Add Class"** in the toolbar or sidebar.
   - Enter a valid Java class name (e.g., `Customer`, `Invoice`).
   - Check **Abstract Class** if this is an abstract superclass.
   - Click **Create Class**. The class appears on the canvas.

2. **Adding Attributes and Methods**:
   - Select the class on the canvas or in the left sidebar to open the **Class Inspector** on the right.
   - Under **Attributes**, click **Add** to specify name, data type, visibility (`public`, `private`, `protected`, `package`), and modifiers (`static`, `final`).
   - Under **Methods**, click **Add** to specify method name, return type, visibility, modifiers, and parameters.

3. **Connecting Classes**:
   - **Method A (Handle Drag)**: Drag a connection line from any handle (circle on top, bottom, left, or right) of a class node to a handle of another class node.
   - **Method B (Toolbar)**: Click **Association**, **Inheritance**, or **Dependency** in the toolbar, select Source and Target, and customize labels or multiplicities.

4. **Arranging Elements**:
   - Drag class nodes anywhere on the canvas.
   - Click **Auto Layout** in the toolbar to automatically organize and space all nodes hierarchically.

5. **Inspecting Generated Java Code**:
   - View the generated code in the bottom **Java Code Panel**.
   - Switch between file tabs (e.g., `User.java`, `Order.java`).
   - Click **Copy** to copy source code to clipboard.
   - Click **Download** for a single `.java` file or **Download All (ZIP)** for all project files in a single archive.

---

## UML Relationships

| Relationship | Canvas Representation | Generated Java Equivalent |
|---|---|---|
| **Association** | Solid line with multiplicity (`1`, `*`, `0..1`, `1..*`) and label | Generates typed fields (e.g., `private List<Course> courses;` or `private Course course;`) with getter and setter methods. |
| **Inheritance** | Solid line with a hollow triangular arrowhead pointing to the parent class | `public class Dog extends Animal { ... }` |
| **Dependency** | Dashed line with open arrowhead pointing to depended-on class | Generates dependency usage methods (e.g., `public void process(PaymentService paymentService) { ... }`). |

---

## Java Code Generation

The code generation engine in `src/utils/codeGenerator.js` follows standard Java conventions:
- **Visibility Translation**: `+` becomes `public`, `-` becomes `private`, `#` becomes `protected`, `~` becomes package-private (no modifier).
- **Modifiers**: Properly emits `static`, `final`, and `abstract`.
- **Constructors**: Automatically generates default no-arg constructors and full-field parameterized constructors.
- **Getters & Setters**: Automatically creates idiomatic getters and setters (`getX()`, `isX()` for booleans, `setX(...)`).
- **Required Imports**: Only imports necessary classes (such as `java.util.List`, `java.util.ArrayList`) without cluttering source files.

---

## Save / Load & Export

- **Save Diagram**: Press `Ctrl+S` or click **Save** in the header to store the current diagram in browser `localStorage`.
- **Load Diagram**: Click **Load** in the header to restore the saved diagram.
- **Export as PNG**: Click **Export -> Export as PNG Image** to download a high-definition image of your diagram.
- **Export as JSON**: Click **Export -> Export as JSON** to download a portable diagram file.
- **Import JSON**: Click **Export -> Import JSON Diagram** to load any previously exported JSON file.

---

## Testing Scenarios

The application is verified against 20 key functional scenarios:
1. **Single Class Creation**: Class renders with standard UML borders and title.
2. **Attributes & Methods**: Added attributes and methods appear with correct UML visibility prefixes (`- id: int`, `+ study(): void`).
3. **Class Renaming**: Inline class rename propagates immediately to diagram node and generated Java file name.
4. **Attribute / Method Deletion**: Deletion immediately removes elements from canvas and updates Java source code.
5. **Association Creation**: Solid line with source/target multiplicities renders correctly between classes.
6. **Inheritance Creation**: Solid line with hollow triangular arrowhead points directly to the parent class.
7. **Dependency Creation**: Dashed line with open arrowhead connects dependent classes.
8. **Drag & Drop**: Moving nodes updates positions smoothly in canvas and stores coordinates.
9. **Cascade Deletion**: Deleting a class triggers a warning dialog showing the exact count of connected relationships and deletes both upon confirmation.
10. **Java Code Generation**: Accurate class definition with correct imports, fields, and constructors.
11. **Inheritance Java Code**: Correctly outputs `public class Dog extends Animal` (not reversed).
12. **Association Java Code**: Generates `private List<Item> items = new ArrayList<>();` when multiplicity is `*`.
13. **Local Storage Save & Restore**: Diagram state survives browser refresh.
14. **JSON Export & Import**: Exported JSON re-imports with 100% fidelity.
15. **Single & ZIP Download**: `.java` and `.zip` files download with correct MIME types and file structures.
16. **Dark / Light Mode**: Theme switch updates canvas background, node colors, text contrast, and Monaco editor theme.
17. **Undo / Redo**: Keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`) cleanly step through history states.
18. **Auto Layout**: Automatically calculates positions using Dagre without overlapping.
19. **Mobile / Tablet Responsiveness**: Panels collapse and stack gracefully on smaller viewports.
20. **Input Validation**: Prevents invalid Java identifiers and duplicate class names with clear error messages.

---

## Screenshots

*(Place application screenshots here)*

| Diagram Canvas & Inspector | Generated Java Code Panel |
|:---:|:---:|
| `![UML Canvas Placeholder](https://via.placeholder.com/600x350?text=UML+Class+Diagram+Canvas)` | `![Java Code Panel Placeholder](https://via.placeholder.com/600x350?text=Java+Code+Generation+Panel)` |

---

## License

MIT License. Designed and developed as a modern, educational, and production-grade UML modeling tool.

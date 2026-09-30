/**
 * Java Code Generator for UML Class Diagrams
 * Converts classes and relationships into idiomatic Java source files.
 */

/**
 * Maps UML visibility to Java access modifier keyword
 */
export function getJavaVisibility(visibility) {
  switch (visibility) {
    case 'public':
      return 'public ';
    case 'private':
      return 'private ';
    case 'protected':
      return 'protected ';
    case 'package':
    case 'package-private':
    default:
      return '';
  }
}

/**
 * Returns default return statement for a Java type
 */
function getDefaultReturnValue(returnType) {
  if (!returnType || returnType.trim() === 'void') {
    return '';
  }
  const type = returnType.trim();
  switch (type) {
    case 'boolean':
      return 'return false;';
    case 'int':
    case 'byte':
    case 'short':
    case 'char':
      return 'return 0;';
    case 'long':
      return 'return 0L;';
    case 'float':
      return 'return 0.0f;';
    case 'double':
      return 'return 0.0;';
    default:
      return 'return null;';
  }
}

/**
 * Capitalizes first letter of string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Pluralizes word for collection field names
 */
function pluralize(word) {
  if (!word) return 'items';
  const lower = word.toLowerCase();
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('ch') || lower.endsWith('sh')) {
    return lower + 'es';
  }
  if (lower.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lower.charAt(lower.length - 2))) {
    return lower.slice(0, -1) + 'ies';
  }
  return lower + 's';
}

/**
 * Determines if a multiplicity string represents a collection (many)
 */
export function isManyMultiplicity(mult) {
  if (!mult) return false;
  const m = mult.trim();
  return m === '*' || m.includes('*') || m.endsWith('n') || m.includes('..n');
}

/**
 * Generates Java source code for a single class within the diagram context
 */
export function generateClassCode(cls, allClasses = [], relationships = []) {
  const imports = new Set();
  const classMap = new Map(allClasses.map((c) => [c.id, c]));

  // 1. Detect Inheritance (where this class is the source child and extends target parent)
  const inheritanceRel = relationships.find(
    (rel) => rel.type === 'inheritance' && rel.source === cls.id
  );
  let extendsClause = '';
  if (inheritanceRel) {
    const parentClass = classMap.get(inheritanceRel.target);
    if (parentClass && parentClass.name) {
      extendsClause = ` extends ${parentClass.name}`;
    }
  }

  // 2. Detect Associations originating from or targeting this class
  // Outgoing associations where this class holds reference to target class
  const outgoingAssociations = relationships.filter(
    (rel) => rel.type === 'association' && rel.source === cls.id
  );

  // 3. Detect Dependencies
  const dependencies = relationships.filter(
    (rel) => rel.type === 'dependency' && rel.source === cls.id
  );

  // Check if class itself has abstract methods
  const hasAbstractMethod = cls.methods?.some((m) => m.abstract);
  const isAbstractClass = cls.isAbstract || hasAbstractMethod;

  const classDeclaration = `public ${isAbstractClass ? 'abstract ' : ''}class ${cls.name}${extendsClause} {`;

  // ================= ATTRIBUTES =================
  const attributeLines = [];
  if (cls.attributes && cls.attributes.length > 0) {
    for (const attr of cls.attributes) {
      // Check required imports
      if (attr.type.includes('List<') || attr.type === 'List') {
        imports.add('import java.util.List;');
      }
      if (attr.type.includes('Map<') || attr.type === 'Map') {
        imports.add('import java.util.Map;');
      }
      if (attr.type.includes('Date')) {
        imports.add('import java.util.Date;');
      }
      if (attr.type.includes('BigDecimal')) {
        imports.add('import java.math.BigDecimal;');
      }

      const vis = getJavaVisibility(attr.visibility);
      const isStatic = attr.static ? 'static ' : '';
      const isFinal = attr.final ? 'final ' : '';
      attributeLines.push(`    ${vis}${isStatic}${isFinal}${attr.type} ${attr.name};`);
    }
  }

  // Association-derived attributes (relations)
  const associationLines = [];
  const associationMethods = [];
  for (const rel of outgoingAssociations) {
    const targetClass = classMap.get(rel.target);
    if (!targetClass) continue;

    const isMany = isManyMultiplicity(rel.targetMultiplicity);
    const customFieldName = rel.label
      ? rel.label.replace(/[^a-zA-Z0-9_$]/g, '')
      : null;

    if (isMany) {
      imports.add('import java.util.List;');
      imports.add('import java.util.ArrayList;');
      const fieldName = customFieldName || pluralize(targetClass.name);
      associationLines.push(
        `    // Association with ${targetClass.name} (Multiplicity: ${rel.targetMultiplicity || '*'})`
      );
      associationLines.push(
        `    private List<${targetClass.name}> ${fieldName} = new ArrayList<>();`
      );

      // Getters, Setters, and Add helper
      const capField = capitalize(fieldName);
      const singularTarget = targetClass.name.charAt(0).toLowerCase() + targetClass.name.slice(1);
      associationMethods.push(
        `    public List<${targetClass.name}> get${capField}() {\n        return this.${fieldName};\n    }`
      );
      associationMethods.push(
        `    public void set${capField}(List<${targetClass.name}> ${fieldName}) {\n        this.${fieldName} = ${fieldName};\n    }`
      );
      associationMethods.push(
        `    public void add${capitalize(singularTarget)}(${targetClass.name} ${singularTarget}) {\n        this.${fieldName}.add(${singularTarget});\n    }`
      );
    } else {
      const fieldName =
        customFieldName ||
        targetClass.name.charAt(0).toLowerCase() + targetClass.name.slice(1);
      associationLines.push(
        `    // Association with ${targetClass.name} (Multiplicity: ${rel.targetMultiplicity || '1'})`
      );
      associationLines.push(
        `    private ${targetClass.name} ${fieldName};`
      );

      const capField = capitalize(fieldName);
      associationMethods.push(
        `    public ${targetClass.name} get${capField}() {\n        return this.${fieldName};\n    }`
      );
      associationMethods.push(
        `    public void set${capField}(${targetClass.name} ${fieldName}) {\n        this.${fieldName} = ${fieldName};\n    }`
      );
    }
  }

  // ================= CONSTRUCTORS =================
  const constructorLines = [];
  // Default no-arg constructor
  constructorLines.push(`    public ${cls.name}() {\n        // Default constructor\n    }`);

  // Parameterized constructor if attributes exist
  const validArgs = (cls.attributes || []).filter((a) => !a.static);
  if (validArgs.length > 0) {
    const params = validArgs.map((a) => `${a.type} ${a.name}`).join(', ');
    const assignments = validArgs
      .map((a) => `        this.${a.name} = ${a.name};`)
      .join('\n');
    constructorLines.push(
      `    public ${cls.name}(${params}) {\n${assignments}\n    }`
    );
  }

  // ================= METHODS =================
  const methodLines = [];
  if (cls.methods && cls.methods.length > 0) {
    for (const method of cls.methods) {
      if (method.returnType && method.returnType.includes('List<')) {
        imports.add('import java.util.List;');
      }
      if (method.returnType && method.returnType.includes('Map<')) {
        imports.add('import java.util.Map;');
      }

      const vis = getJavaVisibility(method.visibility);
      const isStatic = method.static ? 'static ' : '';
      const isAbstract = method.abstract ? 'abstract ' : '';

      const params = (method.parameters || [])
        .map((p) => `${p.type} ${p.name}`)
        .join(', ');

      if (method.abstract) {
        methodLines.push(
          `    ${vis}${isAbstract}${isStatic}${method.returnType} ${method.name}(${params});`
        );
      } else {
        const retStmt = getDefaultReturnValue(method.returnType);
        const bodyContent = retStmt ? `\n        ${retStmt}\n    ` : '\n        // TODO: Implement method\n    ';
        methodLines.push(
          `    ${vis}${isStatic}${method.returnType} ${method.name}(${params}) {${bodyContent}}`
        );
      }
    }
  }

  // ================= DEPENDENCY METHODS =================
  const dependencyLines = [];
  for (const dep of dependencies) {
    const targetClass = classMap.get(dep.target);
    if (!targetClass) continue;
    const paramName =
      targetClass.name.charAt(0).toLowerCase() + targetClass.name.slice(1);
    const actionName = dep.label
      ? dep.label.replace(/[^a-zA-Z0-9_$]/g, '')
      : `use${targetClass.name}`;
    dependencyLines.push(
      `    // Dependency injection/usage: ${cls.name} depends on ${targetClass.name}`
    );
    dependencyLines.push(
      `    public void ${actionName}(${targetClass.name} ${paramName}) {\n        // Uses ${targetClass.name} dependency\n    }`
    );
  }

  // ================= GETTERS & SETTERS FOR ATTRIBUTES =================
  const getterSetterLines = [];
  if (cls.attributes && cls.attributes.length > 0) {
    for (const attr of cls.attributes) {
      if (attr.static) continue;
      const capName = capitalize(attr.name);

      // Getter
      const getterPrefix = attr.type === 'boolean' ? 'is' : 'get';
      getterSetterLines.push(
        `    public ${attr.type} ${getterPrefix}${capName}() {\n        return this.${attr.name};\n    }`
      );

      // Setter (only if not final)
      if (!attr.final) {
        getterSetterLines.push(
          `    public void set${capName}(${attr.type} ${attr.name}) {\n        this.${attr.name} = ${attr.name};\n    }`
        );
      }
    }
  }

  // ASSEMBLE FILE
  let code = '';

  // 1. Imports
  if (imports.size > 0) {
    code += Array.from(imports).sort().join('\n') + '\n\n';
  }

  // 2. Class opening
  code += classDeclaration + '\n';

  // 3. Attributes
  if (attributeLines.length > 0) {
    code += '\n    // Attributes\n' + attributeLines.join('\n') + '\n';
  }

  // 4. Association Fields
  if (associationLines.length > 0) {
    code += '\n' + associationLines.join('\n') + '\n';
  }

  // 5. Constructors
  if (constructorLines.length > 0) {
    code += '\n    // Constructors\n' + constructorLines.join('\n\n') + '\n';
  }

  // 6. Methods
  if (methodLines.length > 0) {
    code += '\n    // Methods\n' + methodLines.join('\n\n') + '\n';
  }

  // 7. Dependency Operations
  if (dependencyLines.length > 0) {
    code += '\n' + dependencyLines.join('\n\n') + '\n';
  }

  // 8. Association Getters & Setters
  if (associationMethods.length > 0) {
    code += '\n    // Association Accessors\n' + associationMethods.join('\n\n') + '\n';
  }

  // 9. Attribute Getters & Setters
  if (getterSetterLines.length > 0) {
    code += '\n    // Getters and Setters\n' + getterSetterLines.join('\n\n') + '\n';
  }

  // 10. Class closing
  code += '}\n';

  return code;
}

/**
 * Generates all Java files from complete diagram state
 */
export function generateJavaFiles(diagram) {
  const { classes = [], relationships = [] } = diagram;

  if (!classes || classes.length === 0) {
    return [];
  }

  return classes.map((cls) => {
    const code = generateClassCode(cls, classes, relationships);
    return {
      id: cls.id,
      fileName: `${cls.name}.java`,
      className: cls.name,
      code
    };
  });
}

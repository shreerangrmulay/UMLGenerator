/**
 * Validation utilities for UML Class Diagram and Java code naming standards.
 */

export const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
  'package', 'private', 'protected', 'public', 'return', 'short', 'static',
  'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
  'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
]);

export const COMMON_JAVA_TYPES = [
  'void',
  'int',
  'String',
  'boolean',
  'double',
  'float',
  'long',
  'char',
  'byte',
  'short',
  'Object',
  'List<String>',
  'List<Integer>',
  'Map<String, Object>',
  'Date',
  'BigDecimal'
];

/**
 * Validates if a string is a valid Java identifier
 */
export function isValidJavaIdentifier(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length === 0) return false;
  
  // Java identifier regex: starts with letter, $, or _, followed by letters, digits, $, or _
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  if (!identifierRegex.test(trimmed)) return false;
  
  if (JAVA_KEYWORDS.has(trimmed.toLowerCase())) return false;
  
  return true;
}

/**
 * Validates Class Name
 */
export function validateClassName(name, existingClasses = [], currentClassId = null) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Class name is required.' };
  }
  const trimmed = name.trim();
  
  if (!isValidJavaIdentifier(trimmed)) {
    return {
      valid: false,
      error: 'Invalid Java identifier. Must begin with a letter or underscore, contain no spaces, and not be a Java keyword.'
    };
  }

  // Check duplicate
  const duplicate = existingClasses.some(
    (cls) => cls.name.toLowerCase() === trimmed.toLowerCase() && cls.id !== currentClassId
  );
  if (duplicate) {
    return { valid: false, error: `A class named "${trimmed}" already exists.` };
  }

  return { valid: true, error: null };
}

/**
 * Validates Attribute
 */
export function validateAttribute(attribute, existingAttributes = [], currentAttrId = null) {
  if (!attribute.name || !attribute.name.trim()) {
    return { valid: false, error: 'Attribute name is required.' };
  }
  const name = attribute.name.trim();

  if (!isValidJavaIdentifier(name)) {
    return {
      valid: false,
      error: 'Attribute name must be a valid Java identifier without spaces or reserved words.'
    };
  }

  if (!attribute.type || !attribute.type.trim()) {
    return { valid: false, error: 'Attribute type is required.' };
  }

  const duplicate = existingAttributes.some(
    (attr) => attr.name.toLowerCase() === name.toLowerCase() && attr.id !== currentAttrId
  );
  if (duplicate) {
    return { valid: false, error: `Attribute "${name}" already exists in this class.` };
  }

  return { valid: true, error: null };
}

/**
 * Validates Method
 */
export function validateMethod(method, existingMethods = [], currentMethodId = null) {
  if (!method.name || !method.name.trim()) {
    return { valid: false, error: 'Method name is required.' };
  }
  const name = method.name.trim();

  if (!isValidJavaIdentifier(name)) {
    return {
      valid: false,
      error: 'Method name must be a valid Java identifier without spaces or reserved words.'
    };
  }

  if (!method.returnType || !method.returnType.trim()) {
    return { valid: false, error: 'Return type is required.' };
  }

  // Validate parameters if any
  if (method.parameters && Array.isArray(method.parameters)) {
    const paramNames = new Set();
    for (const param of method.parameters) {
      if (!param.name || !param.name.trim()) {
        return { valid: false, error: 'All parameters must have a name.' };
      }
      const pName = param.name.trim();
      if (!isValidJavaIdentifier(pName)) {
        return { valid: false, error: `Parameter "${pName}" is not a valid Java identifier.` };
      }
      if (!param.type || !param.type.trim()) {
        return { valid: false, error: `Parameter "${pName}" requires a type.` };
      }
      if (paramNames.has(pName.toLowerCase())) {
        return { valid: false, error: `Duplicate parameter name "${pName}".` };
      }
      paramNames.add(pName.toLowerCase());
    }
  }

  // Check duplicate method signature (same name and same parameter types)
  const paramTypes = (method.parameters || []).map(p => (p.type || '').trim().toLowerCase()).join(',');
  const isDuplicateSignature = existingMethods.some((m) => {
    if (m.id === currentMethodId) return false;
    if (m.name.toLowerCase() !== name.toLowerCase()) return false;
    const mTypes = (m.parameters || []).map(p => (p.type || '').trim().toLowerCase()).join(',');
    return mTypes === paramTypes;
  });

  if (isDuplicateSignature) {
    return {
      valid: false,
      error: `A method "${name}" with identical parameter types already exists in this class.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates Relationship
 */
export function validateRelationship(rel, existingRelationships = [], currentRelId = null) {
  if (!rel.source || !rel.target) {
    return { valid: false, error: 'Both Source and Target classes are required.' };
  }

  if (rel.source === rel.target) {
    return { valid: false, error: 'A class cannot have a relationship with itself.' };
  }

  // Prevent duplicate same-type relation between the same pair
  const duplicate = existingRelationships.some((existing) => {
    if (existing.id === currentRelId) return false;
    return (
      existing.source === rel.source &&
      existing.target === rel.target &&
      existing.type === rel.type
    );
  });

  if (duplicate) {
    return {
      valid: false,
      error: `A relationship of type "${rel.type}" already exists between these classes.`
    };
  }

  return { valid: true, error: null };
}

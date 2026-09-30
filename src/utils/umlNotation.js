/**
 * UML Notation formatting helpers
 */

export function getVisibilitySymbol(visibility) {
  switch (visibility) {
    case 'public':
      return '+';
    case 'private':
      return '-';
    case 'protected':
      return '#';
    case 'package':
    case 'package-private':
      return '~';
    default:
      return '+';
  }
}

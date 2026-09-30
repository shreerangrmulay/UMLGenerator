import Modal from '../common/Modal';
import Button from '../common/Button';

const SHORTCUTS = [
  { key: 'Delete / Backspace', desc: 'Delete the currently selected class or relationship' },
  { key: 'Ctrl + Z / ⌘ + Z', desc: 'Undo the last action' },
  { key: 'Ctrl + Y / ⌘ + Shift + Z', desc: 'Redo previously undone action' },
  { key: 'Ctrl + S / ⌘ + S', desc: 'Save diagram to browser local storage' },
  { key: 'Escape', desc: 'Close open dialogs or deselect current item' },
  { key: 'Double Click Node', desc: 'Quickly open class editor modal' },
  { key: 'Drag Connection Handle', desc: 'Connect two classes with a new relationship' }
];

export function ShortcutsDialog({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts & Gestures"
      subtitle="Speed up your UML diagramming workflow"
      maxWidth="max-w-md"
      footer={
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Got it
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5">
        {SHORTCUTS.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-md bg-surface-secondary border border-border-subtle"
          >
            <span className="text-xs text-text-secondary">{item.desc}</span>
            <kbd className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-surface-tertiary border border-border-strong text-text-primary">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ShortcutsDialog;

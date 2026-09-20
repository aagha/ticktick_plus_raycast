import type { Keyboard } from "@raycast/api";

/**
 * Raycast treats `cmd`, `ctrl`, `opt` and `windows` as "ambiguous" modifiers: an
 * extension that declares Windows support has to spell a shortcut out for both
 * platforms, otherwise the Windows binding is undefined. Shortcuts are authored
 * here with the macOS modifiers the extension has always used and translated for
 * Windows, so existing macOS bindings stay exactly as they were.
 */
const WINDOWS_EQUIVALENT: Partial<Record<Keyboard.KeyModifier, Keyboard.KeyModifier>> = {
  cmd: "ctrl",
  opt: "alt",
};

export function hotkey(modifiers: Keyboard.KeyModifier[], key: Keyboard.KeyEquivalent): Keyboard.Shortcut {
  return {
    macOS: { modifiers, key },
    Windows: { modifiers: modifiers.map((modifier) => WINDOWS_EQUIVALENT[modifier] ?? modifier), key },
  };
}

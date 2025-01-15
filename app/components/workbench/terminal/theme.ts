import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--Terretacode-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--Terretacode-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--Terretacode-elements-terminal-textColor'),
    background: cssVar('--Terretacode-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--Terretacode-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--Terretacode-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--Terretacode-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--Terretacode-elements-terminal-color-black'),
    red: cssVar('--Terretacode-elements-terminal-color-red'),
    green: cssVar('--Terretacode-elements-terminal-color-green'),
    yellow: cssVar('--Terretacode-elements-terminal-color-yellow'),
    blue: cssVar('--Terretacode-elements-terminal-color-blue'),
    magenta: cssVar('--Terretacode-elements-terminal-color-magenta'),
    cyan: cssVar('--Terretacode-elements-terminal-color-cyan'),
    white: cssVar('--Terretacode-elements-terminal-color-white'),
    brightBlack: cssVar('--Terretacode-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--Terretacode-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--Terretacode-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--Terretacode-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--Terretacode-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--Terretacode-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--Terretacode-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--Terretacode-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}

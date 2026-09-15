import { ChevronLeftGlyph } from './glyphs/ChevronLeftGlyph';
import { LogOutGlyph } from './glyphs/LogOutGlyph';

/**
 * Immutable production registry of verified Figma glyph components.
 * Populated strictly and exclusively with VERIFIED_IMPLEMENTED glyphs.
 * Must contain zero placeholder, visual-approximation, or blocked candidate glyphs.
 *
 * Current State: 2 VERIFIED_IMPLEMENTED glyphs (chevronLeft, logOut).
 */
export const glyphs = {
  chevronLeft: ChevronLeftGlyph,
  logOut: LogOutGlyph,
} as const;

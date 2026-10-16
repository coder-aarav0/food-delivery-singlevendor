/**
 * Deprecated compatibility proxy for store order chimes.
 * All audio routines have been unified into UnifiedSoundEngine in lib/sound.ts
 * to prevent duplicate AudioContext instantiation and memory leaks.
 */

import { playNewOrderChime, playRiderAlertChime, sound } from './sound';

export { playNewOrderChime, playRiderAlertChime, sound };

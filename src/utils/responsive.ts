import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design dimensions (based on iPhone 11/X/12/13/14/15 size: 375x812)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Standard scaling based on width. 
 * Use for: widths, margins, padding, icon sizes.
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Vertical scaling based on height.
 * Use for: heights, top/bottom spacing.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Moderated scaling with a factor.
 * Use for: font sizes, border radius, and elements that should only expand slightly.
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Device specific constants
 */
export const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;
export const IS_LARGE_DEVICE = SCREEN_WIDTH > 450;

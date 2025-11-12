import { Dimensions, PixelRatio } from 'react-native';

export const itemMargin = 4;

export const containerPadding = 6;

export function calculateContainerSize() {
  return Dimensions.get('window').width - 20;
}

export function calculateItemSize(columns: number) {
  return PixelRatio.roundToNearestPixel(
    (calculateContainerSize() -
      containerPadding * 2 -
      itemMargin * (columns - 1)) /
    columns,
  );
}

export function calculateItemPosition(columns: number, index: number) {
  const itemSize = calculateItemSize(columns);

  return {
    top:
      containerPadding + Math.floor(index / columns) * (itemSize + itemMargin),
    left:
      containerPadding + Math.floor(index % columns) * (itemSize + itemMargin),
  };
}
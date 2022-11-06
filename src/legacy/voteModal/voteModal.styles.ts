import styled from 'styled-components';

const NoiseOverlay = styled.div<{
  Width?: string;
  Height?: string;
  Top?: string;
  zIndex?: string;
  Position?: string;
  Opacity?: string;
}>`
  z-index: ${({ zIndex }) => zIndex ?? '-1'};
  background-image: url('/UIParts/Noise.png');
  opacity: ${({ Opacity }) => Opacity ?? '0.25'};
  position: ${({ Position }) => Position ?? 'absolute'};
  width: ${({ Width }) => Width ?? 'inherit'};
  height: ${({ Height }) => Height ?? 'inherit'};
  top: ${({ Top }) => Top ?? '0'};
  left: 0;
`;

export { NoiseOverlay };

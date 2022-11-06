import styled, { css } from 'styled-components';

const LayoutWrapper = styled.div``;

const ConnectionZoneWrapper = styled.div<{ isReplaced?: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  color: white;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 20px;
  ${({ isReplaced }) => {
    if (isReplaced) {
      return css`
        top: 50px;
        @media screen and (max-width: 629px) {
          top: 10px;
        }
      `;
    }
  }};
`;

export { ConnectionZoneWrapper, LayoutWrapper };

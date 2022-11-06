import styled, { css } from 'styled-components';

const TabsBlock = styled.div<{
  flag?: boolean;
}>`
  position: fixed;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(25px);
  background: no-repeat url(../UIParts/mission_avatar.png);
  background-size: 100% 100%;
`;

const TabsWrapper = styled.div`
  display: flex;
  background: rgba(33, 35, 43, 0.6);
  width: 100%;
  height: 40px;
  justify-content: center;

  @media (max-width: 629px) {
    position: relative;
    top: 100px;
  }
`;

const TabList = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  @media (max-width: 425px) {
    width: 100vw;
    justify-content: space-around;
  }
`;

const TabHead = styled.div<{
  active?: string;
  flag?: boolean;
  isActive?: boolean;
}>`
  cursor: pointer;
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;

  //text-decoration: ${({ flag }) => (flag ? 'underline' : 'unset')};
  //text-underline-offset: ${({ flag }) => (flag ? '10px' : 'unset')};
  color: ${({ active }) => active ?? ''};

  @media (max-width: 425px) {
    display: flex;
    width: 100px;
    height: 35px;
    align-items: center;
    justify-content: center;
    ${({ isActive, active }) => {
      if (isActive) {
        return css`
          border-bottom: ${active === '#FFF' ? 'none' : `1px solid ${active}`};
        `;
      }
      return css`
        border-bottom: none;
      `;
    }}

  ${({ isActive }) => {
    if (!isActive) {
      return css`
        cursor: not-allowed;
        opacity: 0.4;
      `;
    }
  }}
`;

export { TabHead, TabList, TabsBlock, TabsWrapper };

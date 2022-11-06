import React from 'react';
import styled from 'styled-components';

type Props = {
  upside?: boolean;
  className?: string;
};

export const ArrowDown: React.FC<Props> = ({ upside = false, className }) => {
  return (
    <span className={`${className} common-icon-wrapper`}>
      {upside && (
        <svg
          width="15"
          height="8"
          viewBox="0 0 15 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.5"
            y1="-0.5"
            x2="9.69095"
            y2="-0.5"
            transform="matrix(0.707107 0.707107 0.707107 -0.707107 7.19995 -4.76837e-07)"
            stroke="#C4C4C4"
            strokeLinecap="round"
          />
          <line
            x1="7.20605"
            y1="0.707108"
            x2="0.70707"
            y2="7.20609"
            stroke="#C4C4C4"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!upside && (
        <svg
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="7.79395"
            y1="7.49899"
            x2="14.2929"
            y2="1"
            stroke="#C4C4C4"
            strokeLinecap="round"
          />
          <line
            x1="0.5"
            y1="-0.5"
            x2="9.69095"
            y2="-0.5"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 7.80005 8.20609)"
            stroke="#C4C4C4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
};

export const ArrowRight = styled(ArrowDown)`
  svg {
    transform: rotate(270deg);
  }
`;

export const ArrowLeft = styled(ArrowDown)`
  svg {
    transform: rotate(90deg);
  }
`;

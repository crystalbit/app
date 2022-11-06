import React from 'react';
import { NETWORK_DATA } from '@root/settings';

import { EnhButtonError, EnhButtonWrapper } from './enhButton.styles';

type Props = {
  handler: () => void;
  getWhat?: string;
  price: number;
  disabled: boolean;
  isGamePage?: boolean;
  isPending?: boolean;
};

export const EnhButton: React.FC<Props> = ({
  handler,
  getWhat = '',
  price,
  isGamePage,
  disabled,
  isPending = false
}) => {
  return (
    <EnhButtonWrapper
      onClick={() => handler()}
      disabled={disabled || isPending}
      isGamePage={isGamePage}
    >
      {!isPending && (
        <>
          <div className="enh_button__get">Get {getWhat}</div>
          <div className="enh_button__for">
            for {price} {NETWORK_DATA.TOKEN_NAME}
          </div>
        </>
      )}
      {!!isPending && <div className="enh_button__get">Pending...</div>}
      {disabled && !isPending && (
        <EnhButtonError isGamePage={isGamePage}>
          not enough {NETWORK_DATA.TOKEN_NAME}
        </EnhButtonError>
      )}
    </EnhButtonWrapper>
  );
};

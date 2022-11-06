import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { freeReserve } from '@features/globus/utils/reserveHelper';
import { WHITE } from '@global/styles/variables';
import { EMPTY_ADDRESS } from '@global/utils/etc';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import {
  cartClaimingSelector,
  cartItemsSelector
} from '@selectors/cartSliceSelectors';
import { userGameManagerSelector } from '@selectors/commonAppSelectors';
import { resetCart } from '@slices/cartSlice';
import styled from 'styled-components';
import useMetamask from '@features/global/hooks/useMetamask';

const CartContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const CartContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartContentTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 36px;
  line-height: 42px;
  text-transform: uppercase;
  color: ${WHITE};

  span {
    color: #34ff61;
  }
`;

const CartContentText = styled.p`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #34ff61;
  cursor: pointer;
`;

const CartContentParagraph = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.04em;
  color: #ffffff;
`;

const SubtotalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 5px;
  margin-bottom: 10px;

  button:disabled {
    color: #36363d !important;
    background: linear-gradient(
      90deg,
      #f5f0f0 -3.55%,
      #a4a5b2 107.42%
    ) !important;
  }
`;

const SubtotalTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #ffffff;

  span {
    color: #34ff61;
  }
`;

export const CartContent = ({ itemsCount }: { itemsCount: number }) => {
  const [finalPrice, setFinalPrice] = useState<string | null>('...');
  const cartItems = useSelector(cartItemsSelector) ?? [];
  const isClaiming = useSelector(cartClaimingSelector) ?? false;
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const gm = useSelector(userGameManagerSelector);
  const { makeCallRequest } = useMetamask();

  useEffect(() => {
    (async () => {
      const value = await makeCallRequest<string>({
        contract: gm,
        method: 'getFee',
        errorText: 'Fail getting claiming fees',
        params: [
          itemsCount,
          localStorage.getItem('referralAddress') ?? EMPTY_ADDRESS
        ],
        address
      });
      setFinalPrice((parseInt(value ?? '0') * 1e-18).toFixed(2));
    })();
  }, [addToast, gm, itemsCount]);

  const buttonAdditionalStyles = {
    fontSize: '12px',
    paddingLeft: '44px',
    paddingRight: '44px',
    border: 'none',
    color: '#000000',
    background: '#34FF61'
  };

  const onClearCart = () => {
    for (const cartItem of cartItems) {
      freeReserve(+cartItem).catch(() => {});
    }
    dispatch(resetCart());
  };

  return (
    <CartContentWrapper>
      <CartContentHeader>
        <CartContentTitle>
          my cart: <span>{itemsCount ?? 0}</span>
        </CartContentTitle>
        <CartContentText onClick={onClearCart}>CLEAR CART</CartContentText>
      </CartContentHeader>
      <CartContentParagraph>
        Plots are reserved for 5 minutes.
        <br />
        Claim them before they're removed from your cart!
      </CartContentParagraph>
      <SubtotalWrapper>
        <SubtotalTitle>
          Subtotal:{' '}
          <span>
            {finalPrice === '...'
              ? finalPrice
              : parseFloat(finalPrice ?? '0')?.toFixed(1)}{' '}
            MATIC
          </span>
        </SubtotalTitle>
        <CommonButton
          text="CLAIM ALL LANDS"
          onClick={() => window.claim(cartItems)}
          style={buttonAdditionalStyles}
          disabled={!Boolean(cartItems?.length) || isClaiming}
        />
      </SubtotalWrapper>
    </CartContentWrapper>
  );
};

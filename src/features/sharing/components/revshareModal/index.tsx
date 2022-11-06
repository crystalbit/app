import React, { useState } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { useDispatch } from 'react-redux';
import CommonModal from '@features/global/components/commonModal';
import { useRevshare } from '@features/revshare/hooks/useRevshare';
import { setRevshareModalState } from '@slices/appPartsSlice';

import {
  CancelRevshareButton,
  RevshareActionButton,
  RevshareModalContentWrapper,
  RevshareModalRangeWrapper,
  RevshareModalSubtitle,
  RevshareModalTitle
} from './revshareModal.styles';

export const RevshareModal = () => {
  const { personalRevshare, setNewPersonalRevshareValue, isPending } =
    useRevshare();
  const dispatch = useDispatch();
  const [range, setRange] = useState<number | number[]>([
    parseInt(personalRevshare) ?? 0
  ]);

  const onCloseModal = () => {
    dispatch(setRevshareModalState(false));
  };

  return (
    <CommonModal onClose={onCloseModal} width="700px" mobileBreakpoint={700}>
      <RevshareModalContentWrapper>
        <RevshareModalTitle>Set share</RevshareModalTitle>
        <RevshareModalSubtitle>
          Set revenue share for the missions
        </RevshareModalSubtitle>
        <RevshareModalRangeWrapper>
          <span className="range-before">Explorers</span>
          <span className="range-personal-value">
            {(range as number[])?.[0]}%
          </span>
          <Range
            step={1}
            min={5}
            max={95}
            values={[range as number]}
            onChange={(values) => {
              if (isPending) return;
              setRange(values);
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '4px',
                  width: '225px',
                  maxWidth: '225px',
                  position: 'relative',
                  background: getTrackBackground({
                    values: [range as number],
                    colors: ['#34FF61', '#000'],
                    min: 5,
                    max: 95,
                    rtl: false
                  })
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '15px',
                  width: '15px',
                  backgroundColor: '#34FF61',
                  borderRadius: '50%'
                }}
              />
            )}
          />
          <span className="range-after">You</span>
          <span className="range-shared-value">
            {100 - (range as number[])?.[0]}%
          </span>
        </RevshareModalRangeWrapper>
        <RevshareActionButton
          onClick={() =>
            setNewPersonalRevshareValue(range, () => onCloseModal())
          }
          disabled={isPending}
        >
          DONE
        </RevshareActionButton>
        <CancelRevshareButton onClick={onCloseModal}>
          Cancel
        </CancelRevshareButton>
      </RevshareModalContentWrapper>
    </CommonModal>
  );
};

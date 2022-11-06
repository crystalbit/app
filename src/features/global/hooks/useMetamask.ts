import React from 'react';
import isDev from 'react-is-dev';
import { useToasts } from 'react-toast-notifications';
import useFlags from '@global/hooks/useFlags';
import { METAMASK_EVENTS, MetamaskWrapperType } from '@global/types';
import { logDevInfo } from '@global/utils/analytics';
import { formatRequestWrapperPayload } from '@global/utils/gas';
import { callWrapper, txWrapper } from '@global/utils/tx-wrapper';
import { CURRENT_CHAIN } from '@root/settings/chains';

const useMetamask = () => {
  const { addToast } = useToasts();
  const { networkConfig } = useFlags();
  const useIsDev = isDev(React);

  const makeCallRequest = async <responseType>({
    address,
    contract,
    method,
    onSuccess,
    params = [],
    onError,
    errorText
  }: MetamaskWrapperType): Promise<responseType | undefined> => {
    try {
      const result = await callWrapper<responseType>(await contract, {
        method,
        params: [...params],
        from: address,
        type: CURRENT_CHAIN.x2,
        addToast,
        errorText: errorText ?? `Error with ${networkConfig.CHAIN} chain`,
        onFail: onError
      });

      if (typeof onSuccess === 'function') {
        onSuccess(result);
      }

      if (useIsDev) {
        console.log('CALL');
        logDevInfo(
          `to ${
            (await contract).options.address
          } | method ${method} | params ${params} | result ${JSON.stringify(
            result
          )}`
        );
      }

      return result;
    } catch (err) {
      logDevInfo(`Error with ${method} in ${networkConfig.CHAIN}`);
      return;
    }
  };

  const makeSendRequest = async ({
    contract,
    method,
    onSuccess,
    onLoad,
    params,
    onError,
    eventName,
    address,
    transactionOptions = {}
  }: MetamaskWrapperType) => {
    const payload = await formatRequestWrapperPayload(address);

    txWrapper(
      (await contract).methods[method](...params).send({
        ...payload,
        ...transactionOptions
      }),
      {
        addToast,
        eventName: eventName ?? `${method} Event`,
        onFail: onError,
        onConfirm: onSuccess,
        chainData: CURRENT_CHAIN,
        onPending: onLoad
      }
    );

    if (useIsDev) {
      logDevInfo(
        `to ${
          (await contract).options.address
        } | method ${method} | params ${params} | payload ${payload}`
      );
    }
  };

  const makeRequest = <responseType>({
    address,
    contract,
    type = METAMASK_EVENTS.call,
    method,
    onSuccess,
    onLoad,
    params,
    onError,
    errorText,
    eventName,
    transactionOptions
  }: MetamaskWrapperType) =>
    type === METAMASK_EVENTS.send
      ? makeSendRequest({
          address,
          contract,
          type,
          method,
          onSuccess,
          onLoad,
          params,
          onError,
          errorText,
          eventName,
          transactionOptions
        })
      : makeCallRequest<responseType>({
          address,
          contract,
          method,
          onSuccess,
          params,
          onError,
          errorText,
          type
        });

  return {
    makeCallRequest,
    makeSendRequest,
    makeRequest
  };
};

export default useMetamask;

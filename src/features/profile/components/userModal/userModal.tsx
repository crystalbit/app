import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useToasts } from 'react-toast-notifications';
import Ethereum from '@api/etheriumWeb3';
import {
  ButtonSave,
  CancelText,
  ErrorText,
  InputICon,
  PlaceHolderAt,
  UserBlock,
  UserBlockTitle,
  UserButtonBlock,
  UserEditBlock,
  UserEditBlockName,
  UserEditBlockSocial,
  UserEditInputName,
  UserEditName,
  UserEditSocialInput,
  UserEditSocialText,
  UserEditTextInputBlock,
  UserForm,
  UserText,
  UserTitle,
  UserWrapper
} from '@features/profile/components/userModal/userModal.styles';
import { useActiveSignature } from '@global/hooks/useActiveSignature';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { WHITE } from '@global/styles/variables';
import { getSignMessage } from '@global/utils/signs';
import { Discord } from '@images/icons/Discord';
import { Twitter } from '@images/icons/Twitter';
import { NETWORK_DATA } from '@root/settings';
import mixpanel from 'mixpanel-browser';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

interface Props {
  active: boolean;
  setActive: Dispatcher<boolean>;
  name: string;
  twitterName: string;
  discordName: string;
}

export const UserModal = ({
  active,
  setActive,
  name,
  twitterName,
  discordName
}: Props) => {
  const { addToast } = useToasts();
  const { address } = usePersonalInfo();
  const [error, setError] = useState<string>('');
  const [flagNickNameError, setFlagNickNameError] = useState<boolean>(false);
  const [nickNameUser, setNickNameUser] = useState<string>(name);
  const [twitterUser, setTwitterUser] = useState<string>(twitterName);
  const [discordUser, setDiscordUser] = useState<string>(discordName);

  const { setDifferenceTime, saveLocalStorage } = useActiveSignature();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let reg = /[^A-Za-z0-9._]/gi;
    value = value.replace(reg, '');
    setNickNameUser(value);
  };

  const twitterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setTwitterUser(value);
  };

  const discordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setDiscordUser(value);
  };

  const getInputValidation = useCallback(() => {
    if (nickNameUser.length < 3) {
      setFlagNickNameError(true);
      return setError('Must be 3 or more characters');
    }
    if (nickNameUser.length && !nickNameUser.trim()) {
      setFlagNickNameError(true);
      return setError('You can’t use this symbol');
    } else {
      setFlagNickNameError(false);
      return setError('');
    }
  }, [nickNameUser]);

  const saveUserData = async () => {
    const signatureFlag = setDifferenceTime('0', '0');

    if (signatureFlag.flag) {
      const data = getSignMessage('0', '0');
      if (!data) return;
      const signature = await Ethereum.getEthSignature(data);

      if (typeof signature === 'string') {
        mixpanel.track('Profile signature received', { address });
        saveLocalStorage(signature, data, address);
        const dataBody = {
          address: address.toString(),
          name: nickNameUser,
          twitter: twitterUser,
          discord: discordUser,
          message: data,
          signature
        };
        const response = await fetch(
          `${NETWORK_DATA.BACKEND}/profile/profile`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
          }
        );

        if (response.ok) {
          setActive(false);
        } else {
          const jsonData = await response.json();

          if (jsonData?.errors || jsonData.status >= 300) {
            addToast(`${jsonData.message}`, {
              appearance: 'error'
            });
            setActive(false);
          } else {
            setActive(false);
          }
        }
      } else {
        mixpanel.track('Profile signature not received', {
          address
        });
        setActive(false);
      }
    } else if (signatureFlag.flag === null) {
      mixpanel.track('Profile signature not received', {
        address
      });
      addToast('Profile signature not received', {
        appearance: 'error'
      });
      setActive(false);
    } else {
      mixpanel.track('Profile signature received', { address });
      const dataBody = {
        address: address.toString(),
        name: nickNameUser,
        twitter: twitterUser,
        discord: discordUser,
        message: signatureFlag.data,
        signature: signatureFlag.signature
      };

      const response = await fetch(`${NETWORK_DATA.BACKEND}/profile/profile`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBody)
      });

      if (response.ok) {
        setActive(false);
      } else {
        const jsonData = await response.json();

        if (jsonData?.errors || jsonData.status >= 300) {
          addToast(`${jsonData.message}`, {
            appearance: 'error'
          });
          setActive(false);
        } else {
          setActive(false);
        }
      }
    }
  };

  useEffect(() => {
    getInputValidation();
  }, [nickNameUser]);

  return (
    <UserBlock active={active}>
      <UserWrapper>
        <div>
          <UserBlockTitle>
            <UserTitle>Edit profile</UserTitle>
            <UserText>
              You can change your username and add your socials
            </UserText>
          </UserBlockTitle>
          <UserForm>
            <UserEditBlock>
              <UserEditBlockName>
                <UserEditName flagError={flagNickNameError}>
                  Enter your profile name
                </UserEditName>
                <UserEditInputName
                  flagError={flagNickNameError}
                  value={nickNameUser}
                  onChange={onInputChange}
                  maxLength={15}
                />
                <ErrorText>{error && error}</ErrorText>
              </UserEditBlockName>

              <UserEditBlockSocial>
                <UserEditTextInputBlock>
                  <UserEditSocialText>Twitter</UserEditSocialText>
                  <InputICon>
                    <Twitter fill={WHITE} />
                    <UserEditSocialInput
                      placeholder={'enter your tag'}
                      value={twitterUser}
                      onChange={twitterInputChange}
                      padding={'50px'}
                    />
                    <PlaceHolderAt>
                      <span>@</span>
                    </PlaceHolderAt>
                  </InputICon>
                </UserEditTextInputBlock>
                <UserEditTextInputBlock>
                  <UserEditSocialText>Discord</UserEditSocialText>
                  <InputICon>
                    <Discord fill={WHITE} />
                    <UserEditSocialInput
                      placeholder={'enter your id'}
                      value={discordUser}
                      onChange={discordInputChange}
                      padding={'50px'}
                    />
                  </InputICon>
                </UserEditTextInputBlock>
              </UserEditBlockSocial>
            </UserEditBlock>
          </UserForm>
        </div>

        <div>
          <UserButtonBlock>
            <CancelText onClick={() => setActive(false)}>Cancel</CancelText>
            <ButtonSave
              disabled={flagNickNameError}
              onClick={() => saveUserData()}
            >
              Save
            </ButtonSave>
          </UserButtonBlock>
        </div>
      </UserWrapper>
    </UserBlock>
  );
};

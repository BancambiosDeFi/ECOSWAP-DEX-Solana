import React, { useEffect, useState } from 'react';
import { useOnSwap } from '@serum/swap-ui';
import { useWallet } from '../../../components/wallet/wallet';
import { Connection, PublicKey } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getNetwork } from '../../../utils';
import ButtonComponent from '../../../srm-components/Button/Button';
import WalletConnectSwap from '../../../components/wallet/WalletConnectSwap';

interface SwapButtonProps {
  slippageTolerance: string;
  ecoImpactType: string;
  ecoImpactValue: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const tokenExistErrorMessage =
  'Your account does not have enough USDT tokens for the specified eco-contribution.\n' +
  'You can continue the token exchange process without eco-contribution or cancel the ' +
  'exchange and replenish your USDT token balance.';

const SwapButton: React.FC<SwapButtonProps> = ({
  slippageTolerance,
  ecoImpactType,
  ecoImpactValue,
  setOpen,
  isLoading,
  setIsLoading,
  setIsError,
  setErrorMessage,
}) => {
  const { onSwap, canSwap } = useOnSwap();
  const { connected, wallet } = useWallet();
  const [connection, setConnection] = useState<Connection>();

  const checkingEcoContributionPossibility = () => {
    Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(process.env.REACT_APP_USDT_TOKEN_ADDRESS!),
      wallet?.publicKey!,
    )
      .then(tokenAddress => {
        connection
          ?.getTokenAccountBalance(tokenAddress)
          .then(tokenBalance => {
            if (
              !tokenBalance.value.uiAmount ||
              tokenBalance.value.uiAmount! <= 0 ||
              (ecoImpactType === '$' && tokenBalance.value.uiAmount! < Number(ecoImpactValue))
            ) {
              setIsError(true);
              setErrorMessage(tokenExistErrorMessage);
            }
            setIsLoading(true);
            setOpen(true);
          })
          .catch(e => {
            setErrorMessage(tokenExistErrorMessage);
            setIsError(true);
            setOpen(true);
          });
      })
      .catch(e => {
        setErrorMessage(e.message);
        setIsError(true);
        setOpen(true);
      });
  };

  const swapTransaction = () => {
    console.log('swapTransaction func...');
  };

  useEffect(() => {
    if (isLoading) {
      swapTransaction();
    }
  }, [isLoading]);

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      setConnection(new Connection(getNetwork()));
    }
  }, [wallet, connected]);

  if (connected) {
    return (
      <ButtonComponent
        type={'swap'}
        title={'Swap'}
        onClick={checkingEcoContributionPossibility}
        // onClick={onSwap}
        disable={!canSwap}
        isIconVisible={false}
      />
    );
  } else {
    return <WalletConnectSwap />;
  }
};

export default SwapButton;

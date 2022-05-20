import { memo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, Modal } from 'antd';
import { makeStyles } from '@mui/styles';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { useWallet } from '../../components/wallet/wallet';
import { notify } from '../../srm-utils/notifications';
import {
  convertStakingValueToBnAmount,
  createAssociatedStakingTokenAccountInstruction,
  getAssociatedBxTokenAddress,
  getAssociatedStakingTokenAddress,
  getStaking,
  getAssociatedTokenAccount,
  getNetwork,
} from './utils';

type ClaimPopup = {
  userBxBalance: number;
  onChange: void;
  claimValue: number;
  handleChangeClaim: (data: any) => void;
  onSubmit: void;
  ifStake: boolean;
  title: string;
  updatePendingReward: () => Promise<void>;
  accumulatedReward: number;
};

const useStyles = makeStyles(() => ({
  inner: {
    padding: '12px 22px',
    marginBottom: '25px',
    background: '#202124',
    borderRadius: '8px',
  },
  title: {
    fontWeight: 800,
    fontSize: '24px',
  },
  btnWrapper: {
    marginBottom: '10px',
    padding: '0.5px',
    borderRadius: '8px',
    background: 'linear-gradient(232deg, #0156FF 30%, #EC26F5 100%)',
  },
  content: {
    fontSize: '16px',
    fontWeight: 400,
  },
  contentTitle: {
    fontSize: '18px',
    fontWeight: 700,
  },
  contentValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#AEAEAF',
    background: 'transparent',
    border: 'none',
    width: 'auto',
    minWidth: 'auto',
    display: 'inline-block',
    textAlign: 'right',
    outline: 'none',
  },
  btn: {
    '&:hover': {
      cursor: 'pointer',
    },
    'width': '100%',
    'border': 'none',
    'padding': '8px 0',
    'fontSize': '16px',
    'background': '#202124',
    'borderRadius': '8px',
  },
  controlBtn: {
    '&:hover': {
      cursor: 'pointer',
    },
    'width': '100%',
    'background': '#1E2022',
    'borderRadius': '8px',
    'border': 'none',
    'cursor': 'pointer',
  },
  validation: {
    color: 'red',
    textAlign: 'right',
    margin: '-10px 0 0 0',
  },
  btnAllowed: {
    '&:hover': {
      cursor: 'pointer',
      background:
        // eslint-disable-next-line max-len
        'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) padding-box, linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) border-box',
      boxShadow: '0px 0px 16px #9F5AE5',
    },
  },
}));

const MemoClaimPopup = memo(function ClaimPopup({
  userBxBalance,
  ifStake,
  claimValue,
  handleChangeClaim,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePendingReward,
  accumulatedReward,
}: ClaimPopup): JSX.Element {
  const styles = useStyles();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isClaimValueError, setIsClaimValueError] = useState<boolean>(false);
  const { wallet } = useWallet();

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const sendTransaction = async (transaction: Transaction) => {
    const connection = new Connection(getNetwork());

    connection
      .getRecentBlockhash('confirmed')
      .then(({ blockhash }) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet?.publicKey;

        window.solana
          .signAndSendTransaction(transaction)
          .then((sign: { signature: string }) => {
            connection
              .confirmTransaction(sign.signature, 'confirmed')
              .then(() => {
                setIsModalVisible(false);
                handleChangeClaim(0);
                notify({
                  type: 'success',
                  message: ifStake ? 'Staked Successfully' : 'Un-Staked Successfully',
                  description: ifStake
                    ? 'Staking transaction was successful.'
                    : 'Un-Staking transaction was successful.',
                });
              })
              .catch(e => {
                notify({
                  type: 'error',
                  message: ifStake ? 'Staking transaction error' : 'Un-Staking transaction error',
                  description: e.message,
                });
              });
          })
          .catch((e: any) => {
            notify({
              type: 'error',
              message: ifStake ? 'Staking transaction error' : 'Un-Staking transaction error',
              description: e.message,
            });
          });
      })
      .catch(e => {
        notify({
          type: 'error',
          message: ifStake ? 'Staking transaction error' : 'Un-Staking transaction error',
          description: e.message,
        });
      });
  };

  const stakeBxs = async () => {
    if (wallet?.publicKey) {
      const transaction = new Transaction();
      const stakingAddress = await getAssociatedStakingTokenAddress(wallet?.publicKey);
      try {
        await getAssociatedTokenAccount(
          wallet?.publicKey,
          new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
          stakingAddress,
        );
      } catch (e) {
        transaction.add(
          createAssociatedStakingTokenAccountInstruction(wallet?.publicKey, stakingAddress),
        );
      }

      transaction.add(
        await getStaking(wallet as Wallet).stake(
          convertStakingValueToBnAmount(
            claimValue,
            Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
          ),
          {
            publicKey: wallet?.publicKey,
            bxTokenAccount: await getAssociatedBxTokenAddress(wallet?.publicKey),
            stakingTokenAccount: stakingAddress,
          },
        ),
      );

      await sendTransaction(transaction);
    } else {
      notify({
        type: 'error',
        message: 'Staking error',
        description: "Wallet doesn't connected.",
      });
    }
  };

  const unStakeBxs = async () => {
    if (wallet?.publicKey) {
      const transaction = new Transaction();
      const amount = convertStakingValueToBnAmount(
        claimValue,
        Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
      );
      // await updatePendingReward();
      const stakingAddress = await getAssociatedStakingTokenAddress(wallet?.publicKey);
      const staking = getStaking(wallet as Wallet);
      if (
        amount.lte(
          convertStakingValueToBnAmount(
            accumulatedReward,
            Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
          ),
        )
      ) {
        const unStakeInstruction = await staking.unstake(amount, {
          publicKey: wallet?.publicKey,
          bxTokenAccount: await getAssociatedBxTokenAddress(wallet?.publicKey),
          stakingTokenAccount: stakingAddress,
        });

        transaction.add(unStakeInstruction);

        await sendTransaction(transaction);
      } else {
        setIsClaimValueError(true);
        notify({
          type: 'error',
          message: 'Staking error',
          description: 'Insufficient balance to un-stake.',
        });
      }
    } else {
      notify({
        type: 'error',
        message: 'Staking error',
        description: "Wallet doesn't connected.",
      });
    }
  };

  useEffect(() => {
    if (ifStake && claimValue > userBxBalance) {
      setIsClaimValueError(true);
    } else if (!ifStake && claimValue > accumulatedReward) {
      setIsClaimValueError(true);
    } else {
      setIsClaimValueError(false);
    }
  }, [claimValue, userBxBalance, accumulatedReward]);

  return (
    <>
      <Grid container justifyContent="space-between">
        <button className={`${styles.btn} ${styles.btnAllowed}`} onClick={showModal}>
          {title}
        </button>
      </Grid>
      <Modal
        visible={isModalVisible}
        onOk={showModal}
        onCancel={showModal}
        closable={false}
        maskStyle={{
          background: 'background: rgba(0, 0, 0, 0.9)',
        }}
        bodyStyle={{
          background: '#0A0C0E',
          padding: '12px 25px 25px',
          borderRadius: '8px',
          border: '1px solid #0156FF',
        }}
        centered={true}
        footer={null}
        maskClosable={true}
      >
        <section>
          <h5 className={styles.title}>{ifStake ? 'Stake BXS' : 'Un-Stake BXS'}</h5>
          <Grid className={styles.inner}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography component="span" className={styles.content}>
                Staking BXS
              </Typography>
              <Typography component="span" className={styles.content}>
                {ifStake ? `Balance: ${userBxBalance}` : `Pending reward: ${accumulatedReward}`}
              </Typography>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography component="span" className={styles.contentTitle}>
                BXS
              </Typography>
              <input
                placeholder="0"
                value={claimValue}
                onChange={handleChangeClaim}
                className={styles.contentValue}
                style={{ color: isClaimValueError ? 'red' : '#AEAEAF' }}
                type="number"
              />
            </Grid>
            {/*{claimValue > userBxBalance && <p className={styles.validation}>too much bro</p>}*/}
          </Grid>
          <Grid className={styles.btnWrapper}>
            <Button
              disabled={isClaimValueError}
              className={`${styles.controlBtn} ${styles.btnAllowed}`}
              type="primary"
              onClick={ifStake ? stakeBxs : unStakeBxs}
            >
              {ifStake ? 'Stake BXS' : 'Un-Stake BXS'}
            </Button>
          </Grid>
          <Grid className={styles.btnWrapper}>
            <Button
              className={styles.controlBtn}
              style={{ background: '#0A0C0E' }}
              type="primary"
              onClick={showModal}
            >
              Cancel
            </Button>
          </Grid>
        </section>
      </Modal>
    </>
  );
});

export { MemoClaimPopup };

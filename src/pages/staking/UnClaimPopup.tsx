import { memo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, Modal } from 'antd';
import { makeStyles } from '@mui/styles';
import { PublicKey, Transaction } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import BN from 'bn.js';
import { useWallet } from '../../components/wallet/wallet';
import {
  convertStakingValueToBnAmount,
  getAssociatedStakingTokenAddress,
  getStaking,
  getStakingTokenMintInfo,
  getAssociatedTokenAccount,
  getAssociatedBxTokenAddress,
} from './utils';

type ClaimPopup = {
  balance: number;
  onChange: void;
  claimValue: number;
  handleChangeClaim: (data: any) => void;
  onSubmit: void;
  ifStake: boolean;
  title: string;
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

const MemoUnClaimPopup = memo(function ClaimPopup({
  balance,
  ifStake,
  claimValue,
  handleChangeClaim,
  title,
}: ClaimPopup): JSX.Element {
  const styles = useStyles();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { wallet } = useWallet();

  const showModal = async () => {
    if (wallet?.publicKey) {
      const transaction = new Transaction();
      const stakingAddress = await getAssociatedStakingTokenAddress(wallet?.publicKey);
      const amount = convertStakingValueToBnAmount(
        claimValue,
        +process.env.REACT_APP_BX_TOKEN_DECIMALS!,
      );
      const staking = getStaking(wallet as Wallet);
      const programState = await staking.programState();
      const userStakeInfo = await staking.userStakeInfo(wallet?.publicKey);
      const tokenAccount = await getAssociatedTokenAccount(
        wallet?.publicKey,
        new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
        stakingAddress,
      );
      const tokenMintInfo = await getStakingTokenMintInfo(wallet?.publicKey);
      const { amountUnstaked, amountTransfered } = programState.getPossibleUnstake(
        userStakeInfo,
        new BN(tokenAccount.amount),
        tokenMintInfo.supply,
      );
      if (amount.lte(amountUnstaked)) {
        transaction.add(
          staking.unstake(amount, {
            publicKey: wallet?.publicKey,
            bxTokenAccount: await getAssociatedBxTokenAddress(wallet?.publicKey),
            stakingTokenAccount: stakingAddress,
          }),
        );
        // Send transaction logic!
      } else {
        // Erro logic!
      }
    }

    setIsModalVisible(!isModalVisible);
    handleChangeClaim(0);
  };

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
          <h5 className={styles.title}>{ifStake ? 'Stake BSX' : 'Un-Stake BSX'}</h5>
          <Grid className={styles.inner}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography component="span" className={styles.content}>
                Staking BXS
              </Typography>
              <Typography component="span" className={styles.content}>
                Balance: 1.12312323
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
                style={{ color: claimValue > balance ? 'red' : '#AEAEAF' }}
                type="number"
              />
            </Grid>
            {claimValue > balance && <p className={styles.validation}>too much bro</p>}
          </Grid>
          <Grid className={styles.btnWrapper}>
            <Button
              className={`${styles.controlBtn} ${styles.btnAllowed}`}
              type="primary"
              onClick={showModal}
            >
              {ifStake ? 'Stake BSX' : 'Un-Stake BSX'}
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

export { MemoUnClaimPopup };

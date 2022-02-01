import React from 'react';
import ButtonComponent from '../srm-components/Button/Button';
import { Typography } from '@mui/material';


export default function DesignSystemPage() {

  const handleUnlocksModal = () => {
    console.log('wow');
  };

  return (
    <>
      <ButtonComponent type={"done"} title={"Token Metrics"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"connectSwap"} title={"Connect Wallet"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"swap"} title={"Swap"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"launch"} title={"Launch the app >>"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"launch"} title={"Lear more >>"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"subscribe"} title={"Subscribe"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>
      <ButtonComponent type={"connect"} title={"Connect Wallet"} onClick={handleUnlocksModal} isIconVisible={false}></ButtonComponent>

      <Typography variant={"h1"}>Some text h1</Typography>
      <Typography variant={"h2"}>Some text h2</Typography>
      <Typography variant={"h3"}>Some text h3</Typography>
      <Typography variant={"subtitle1"}>Some text subtitle1</Typography>
      <Typography variant={"subtitle2"}>Some text subtitle2</Typography>
    </>
  );
}
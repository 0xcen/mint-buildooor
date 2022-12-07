import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Metaplex,
  CandyMachine,
  walletAdapterIdentity,
  CandyMachineV2,
} from '@metaplex-foundation/js';
import router from 'next/router';
import { PublicKey } from '@solana/web3.js';

const Connected: FC = () => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const metaplex = useMemo(
    () => Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter)),
    [connection, walletAdapter]
  );
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();
  const [isMinting, setIsMinting] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async event => {
      if (event.defaultPrevented) return;
      if (!walletAdapter.connected || !candyMachine) return;

      try {
        setIsMinting(true);
        console.log('minting');

        const nft = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        console.log('🚀 ~ file: Connected.tsx:40 ~ error', error);
      } finally {
        setIsMinting(false);
      }
    },
    [candyMachine, metaplex, walletAdapter.connected]
  );

  useEffect(() => {
    if (!metaplex) return;

    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey(
          process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDRESS ?? ''
        ),
      })
      .then(candyMachine => {
        setCandyMachine(candyMachine);
      })
      .catch(error => {
        console.log('🚀 ~ file: Connected.tsx:67 ~ useEffect ~ error', error);
      });
  }, [metaplex]);

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color='white'
            as='h1'
            size='2xl'
            noOfLines={1}
            textAlign='center'>
            Welcome Buildoor.
          </Heading>

          <Text color='bodyText' fontSize='xl' textAlign='center'>
            Each buildoor is randomly generated and can be staked to receive
            <Text as='b'> $BLD</Text> Use your <Text as='b'> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src='avatar1.png' alt='' />
        <Image src='avatar2.png' alt='' />
        <Image src='avatar3.png' alt='' />
        <Image src='avatar4.png' alt='' />
        <Image src='avatar5.png' alt='' />
      </HStack>

      <Button bgColor='accent' color='white' maxW='380px' onClick={handleClick}>
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;

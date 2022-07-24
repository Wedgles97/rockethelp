import React, {
  useState,
  useEffect
} from 'react';

import { Alert } from 'react-native';

import {
  useNavigation,
  useRoute
} from '@react-navigation/native';

import { 
  VStack,
  Text,
  HStack,
  useTheme,
  ScrollView,
  Box
} from 'native-base';

import { 
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText
} from 'phosphor-react-native';

import firestore from '@react-native-firebase/firestore';

//Components
import { Header } from '../Components/Header';
import { OrderProps } from '../Components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateForm';
import { Loading } from '../Components/Loading';
import { CardDetails } from '../Components/CardDetails';
import { Input } from '../Components/Input';
import { Button } from '../Components/Button';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleOrderClosed() {
    if(!solution) {
      return Alert.alert('Solicitação', 'Informar a solução para encerrar a solicitação.');
    }

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação encerrada.');
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Solciitação', 'Não foi possível encerrar a sua solicitação.')
    })
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { 
        patrimony, 
        description, 
        status, 
        created_at, 
        closed_at, 
        solution 
      } = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    });
  }, []);

  if(isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
          ? <CircleWavyCheck size={22} color={colors.green[300]} />
          : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails 
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails 
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' &&
        <Button
          title="Encerrar Solicitação"
          m={5}
          onPress={handleOrderClosed}
        />
      }
    </VStack>
  );
}
import { VStack } from 'native-base';

import { Header } from '../Components/Header';
import { Input } from '../Components/Input';
import { Button } from '../Components/Button';

export function Register() {
  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input
        placeholder="Número do patrimônio"
        mt={4}
      />
      <Input 
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
      />

      <Button 
        title="Cadastrar"
        mt={5}
      />
    </VStack>
  );
}
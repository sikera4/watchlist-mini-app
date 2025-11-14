import { Container, Heading, Stack } from '@chakra-ui/react';
import CreateListForm from './CreateListForm';

const CollectionsPage = () => {
  return (
    <Container p={4} minHeight="100vh">
      <Heading>Ваши списки</Heading>
      <Stack mt={4}></Stack>
      <CreateListForm />
    </Container>
  );
};

export default CollectionsPage;

import { Container, Heading, Stack } from '@chakra-ui/react';
import CreateCollectionForm from './CreateCollectionForm';

const CollectionsPage = () => {
  return (
    <Container p={4} minHeight="100vh">
      <Heading>Ваши списки</Heading>
      <Stack mt={4}></Stack>
      <CreateCollectionForm />
    </Container>
  );
};

export default CollectionsPage;

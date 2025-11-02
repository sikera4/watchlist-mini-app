import { Button, Container, Grid, Input } from "@chakra-ui/react";

const ListPage = () => {
  return (
    <Container p={4}>
      <Grid templateColumns="3fr 1fr" gap={4}>
        <Input placeholder="what're we looking for..." />
        <Button variant="surface">Search</Button>
      </Grid>
    </Container>
  );
};

export default ListPage;

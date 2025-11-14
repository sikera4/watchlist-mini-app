'use client';

import { Button, Flex, Grid, Input, Stack, TagsInput } from '@chakra-ui/react';
import { useState } from 'react';

const CreateCollectionForm = () => {
  const [isFormMode, setIsFormMode] = useState(false);

  return isFormMode ? (
    <form>
      <Flex direction="column" gap={2}>
        <Input placeholder="List name" />
        <TagsInput.Root>
          {/*<TagsInput.Label>Users</TagsInput.Label>*/}
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add user..." />
          </TagsInput.Control>
        </TagsInput.Root>
        <Grid gridTemplateColumns="1fr 1fr" gap={2}>
          <Button type="submit">Добавить</Button>
          <Button onClick={() => setIsFormMode(false)}>Отмена</Button>
        </Grid>
      </Flex>
    </form>
  ) : (
    <Button onClick={() => setIsFormMode(true)}>Добавить список</Button>
  );
};

export default CreateCollectionForm;

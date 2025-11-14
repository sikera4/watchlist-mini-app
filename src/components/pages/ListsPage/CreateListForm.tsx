'use client';

import { useCreateListMutation } from '@/api';
import { Button, Flex, Grid, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateListFormValues } from './types';
import { toaster } from '@/components/ui/toaster';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';

const CreateCollectionForm = () => {
  const { register, handleSubmit: rhfHandleSubmit } = useForm<CreateListFormValues>();

  const [isFormMode, setIsFormMode] = useState(false);
  const tgWebApp = useTelegramApp();

  const createListMutation = useCreateListMutation({
    onSuccess: () => {
      setIsFormMode(false);

      toaster.success({
        title: 'Список успешно создан',
      });
    },
    onError: () => {
      toaster.error({
        title: 'Ошибка при создании списка',
      });
    },
  });

  const handleSubmit = (data: CreateListFormValues) => {
    const userId = tgWebApp?.initDataUnsafe?.user?.id;

    if (userId) {
      createListMutation.mutate({ name: data.name, userId });
    }
  };

  return isFormMode ? (
    <form onSubmit={rhfHandleSubmit(handleSubmit)}>
      {tgWebApp?.initDataUnsafe?.user?.id}
      <Flex direction="column" gap={2}>
        <Input placeholder="List name" {...register('name')} />
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

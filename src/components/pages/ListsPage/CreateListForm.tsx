'use client';

import { useCreateListMutation } from '@/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateListFormValues } from './types';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';
import { addToast, Button, Input } from '@heroui/react';

const CreateCollectionForm = () => {
  const { register, handleSubmit: rhfHandleSubmit } = useForm<CreateListFormValues>();

  const [isFormMode, setIsFormMode] = useState(false);
  const tgWebApp = useTelegramApp();

  const createListMutation = useCreateListMutation({
    onSuccess: () => {
      setIsFormMode(false);

      addToast({
        title: 'Список успешно создан',
        color: 'success',
      });
    },
    onError: () => {
      addToast({
        title: 'Ошибка при создании списка',
        color: 'danger',
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
      <div className="flex flex-col gap-2">
        <Input label="List name" {...register('name')} />
        <div className="grid grid-cols-2 gap-2">
          <Button type="submit" isLoading={createListMutation.isPending}>
            Добавить
          </Button>
          <Button onPress={() => setIsFormMode(false)}>Отмена</Button>
        </div>
      </div>
    </form>
  ) : (
    <Button onPress={() => setIsFormMode(true)}>Добавить список</Button>
  );
};

export default CreateCollectionForm;

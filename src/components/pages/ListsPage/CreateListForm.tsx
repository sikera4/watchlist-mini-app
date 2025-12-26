'use client';

import { useCreateListMutation } from '@/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateListFormValues } from './types';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';
import { addToast, Button, Input } from '@heroui/react';
import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';

type Props = {
  className?: string;
};

const CreateCollectionForm = ({ className }: Props) => {
  const { register, handleSubmit: rhfHandleSubmit, reset } = useForm<CreateListFormValues>();

  const [isFormMode, setIsFormMode] = useState(false);

  const tgWebApp = useTelegramApp();
  const registerHapticFeedback = useRegisterHapticFeedback();

  const createListMutation = useCreateListMutation({
    onSuccess: () => {
      setIsFormMode(false);
      reset();

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
    const userId = tgWebApp?.initDataUnsafe?.user?.id || 1;

    if (userId) {
      registerHapticFeedback('soft');
      createListMutation.mutate({ name: data.name, userId });
    }
  };

  return (
    <div className={className}>
      {isFormMode ? (
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
        <Button onPress={() => setIsFormMode(true)} className="block w-full">
          Добавить список
        </Button>
      )}
    </div>
  );
};

export default CreateCollectionForm;

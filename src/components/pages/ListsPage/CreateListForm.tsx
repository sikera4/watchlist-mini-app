'use client';

import { useCreateListMutation } from '@/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateListFormValues } from './types';
import { useAuthenticatedUserId } from '@/components/providers/TelegramAppProvider';
import { toast, Button, Input, TextField, Label } from '@heroui/react';
import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';

type Props = {
  className?: string;
};

const CreateCollectionForm = ({ className }: Props) => {
  const { register, handleSubmit: rhfHandleSubmit, reset } = useForm<CreateListFormValues>();

  const [isFormMode, setIsFormMode] = useState(false);

  const userId = useAuthenticatedUserId();
  const registerHapticFeedback = useRegisterHapticFeedback();

  const createListMutation = useCreateListMutation({
    onSuccess: () => {
      setIsFormMode(false);
      reset();

      toast.success('Список успешно создан');
    },
    onError: () => {
      toast.danger('Ошибка при создании списка');
    },
  });

  const handleSubmit = (data: CreateListFormValues) => {
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
            <TextField isRequired>
              <Label>Название списка</Label>
              <Input minLength={1} maxLength={100} {...register('name')} />
            </TextField>
            <div className="grid grid-cols-2 gap-2">
              <Button type="submit" isPending={createListMutation.isPending}>
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

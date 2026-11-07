'use client';

import { useCreateListMutation } from '@/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateListFormValues } from './types';
import { useAuthenticatedUserId } from '@/components/providers/TelegramAppProvider';
import { toast, Button, Input, TextField, Label, Spinner } from '@heroui/react';
import { FaPlus } from 'react-icons/fa6';
import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';

type Props = {
  className?: string;
};

const CreateCollectionForm = ({ className }: Props) => {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateListFormValues>();

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
      createListMutation.mutate({ name: data.name.trim(), userId });
    }
  };

  return (
    <div className={className}>
      {isFormMode ? (
        <form
          onSubmit={rhfHandleSubmit(handleSubmit)}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-col gap-2">
            <TextField isRequired isDisabled={createListMutation.isPending}>
              <Label>Название списка</Label>
              <Input
                minLength={1}
                maxLength={100}
                autoFocus
                placeholder="Например, на выходные"
                aria-describedby={errors.name ? 'list-name-error' : undefined}
                {...register('name', {
                  validate: (value) => value.trim().length > 0 || 'Введите название списка',
                })}
              />
            </TextField>
            {errors.name && (
              <p id="list-name-error" role="alert" className="text-sm text-danger">
                {errors.name.message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button type="submit" isPending={createListMutation.isPending}>
                {createListMutation.isPending && <Spinner size="sm" />} Создать
              </Button>
              <Button
                variant="secondary"
                isDisabled={createListMutation.isPending}
                onPress={() => {
                  setIsFormMode(false);
                  reset();
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Button onPress={() => setIsFormMode(true)} className="w-full rounded-2xl" size="lg">
          <FaPlus aria-hidden="true" className="size-3" /> Новый список
        </Button>
      )}
    </div>
  );
};

export default CreateCollectionForm;

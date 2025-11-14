import { useAddUserMutation } from "@/api";
import { useTelegramApp } from "@/hooks/useTelegramApp";
import { checkIfUserExists } from "@/utilities/checkIfUserExists";
import { useEffect } from "react";

const AddUserToFirebase = () => {
  const { tgWebApp } = useTelegramApp();

  const addUserMutation = useAddUserMutation();

  useEffect(() => {
    const addUserToFireBase = async () => {
      const userId = tgWebApp?.initDataUnsafe?.user?.id;

      if (!userId) {
        return;
      }

      const userExists = await checkIfUserExists(userId);

      if (!userExists) {
        addUserMutation.mutate({
          userId,
        })
      }
    }

    addUserToFireBase();
  }, [])

  return null;
}

export default AddUserToFirebase;

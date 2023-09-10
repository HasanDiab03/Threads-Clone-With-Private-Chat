import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();
  const customToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };
  return customToast;
};

export default useCustomToast;

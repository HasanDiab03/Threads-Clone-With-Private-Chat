import { useState } from "react";
import useCustomToast from "./useCustomToast";

const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const toast = useCustomToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast("", "Please select an image!", "error");
    }
  };
  return [handleImageChange, imgUrl, setImgUrl];
};

export default usePreviewImage;

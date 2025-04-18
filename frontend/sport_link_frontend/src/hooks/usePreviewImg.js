import { useState } from "react";
import useShowToast from "./useShowToast.js";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    // console.log("Handle image change function called");
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };
  // console.log("imgUrl : ", imgUrl);
  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;

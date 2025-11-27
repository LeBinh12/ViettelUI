import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { customerAtom } from "../recoil/atoms/userAtom";
import { customerApi } from "../api/customerApi";

export const useLoadUser = () => {
  const [, setCustomer] = useRecoilState(customerAtom);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("access_token_viettel");
      if (!token) return;

      const user = await customerApi.getMe();

      if (user?.data) {
        setCustomer(user.data);
      }
    } catch (error) {
      console.log("Load user failed:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { loadUser };
};

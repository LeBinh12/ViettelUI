import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { customerAtom } from "../recoil/atoms/userAtom";
import { customerApi } from "../api/customerApi";

export const useLoadUser = () => {
  const [customer, setCustomer] = useRecoilState(customerAtom);

  useEffect(() => {
    const token = localStorage.getItem("access_token_viettel");
    console.log("token", token);
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const profile = await customerApi.getMe();
        if (profile?.data) {
          setCustomer(profile.data);
        }
        console.log(profile);
      } catch (err) {
        console.warn("Token hết hạn hoặc không hợp lệ");
        localStorage.removeItem("access_token_viettel");
        setCustomer(null);
      }
    };

    fetchUser();
  }, [setCustomer]);

  return customer;
};

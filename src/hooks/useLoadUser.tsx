import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import { userApi } from "../api/userAPI";

export const useLoadUser = () => {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const profile = await userApi.getProfile(token);
        console.log(profile);
        setUser(profile.data);
      } catch (err) {
        console.warn("Token hết hạn hoặc không hợp lệ");
        localStorage.removeItem("access_token");
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  return user;
};

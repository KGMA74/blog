"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../redux/hooks";
import useLogin from "../../../hooks/useLogin";
import useRegister from "../../../hooks/useRegister";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";

const Page = () => {
  const {isAuthenticated} = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const { loginSubmit, isLoading } = useLogin();
  const { registerSubmit, isLoading_register } = useRegister()


  return (
    <div className="flex w-full h-screen justify-center items-center">
      {isLogin ? (
        <LoginForm submitHandler={loginSubmit} NotSigned={() => setIsLogin(false)} isLoading={isLoading}/>
      ) : (
        <RegisterForm submitHandler={registerSubmit} AlreadySigned={() => setIsLogin(true)} isLoading={isLoading_register}/>
      )}
    </div>
  );
};

export default Page;

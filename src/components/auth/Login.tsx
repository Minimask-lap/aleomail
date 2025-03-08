import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import Input from '../ui/Input';
import { signIn } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await signIn('credentials', {
        email,
        password
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);
  return (
    <div className=" bg-gray-100 min-h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white  flex  md:flex-row rounded-3xl">
        <div className="md:flex justify-center items-center flex-col my-16 md:my-20 md:mx-12">
          <h1 className="text-4xl text-[#201950] font-bold hidden md:block">
            Aleo-Voice
          </h1>
          <div className="md:pt-6 hidden md:block md:opacity-100">
            <Image
              src="/asset/Groceries.png"
              alt="eccomerce"
              width="260"
              height="260"
            />
          </div>
          <div className="mt-12 pb-2 mx-[100px] absolute block md:hidden  opacity-90 ">
            <Image
              src="/asset/Groceries.png"
              alt="eccomerce"
              width="160"
              height="160"
            />
          </div>
        </div>
        <div className="border border-solid border-r border-gray-300 my-10 hidden md:block"></div>
        <div className="flex md:justify-center flex-col items-center px-6 py-6 min-h-[360px]">
          <h1 className="text-3xl text-[#201950] font-bold block md:hidden">
            Aleo-Voice
          </h1>
          <h1 className="text-2xl font-semibold mb-6 mt-4">Login</h1>
          <div className="relative opacity-75 pt-4 gap-y-6">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
            />
          </div>
          <button
            disabled={isLoading}
            onClick={onSubmit}
            className=" cursor-pointer bg-[#201950] relative rounded-3xl text-lg py-3 mt-8 w-full text-center text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

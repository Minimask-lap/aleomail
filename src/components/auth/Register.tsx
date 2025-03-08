import React, { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [position, setPosition] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      if (password != repassword) {
      }
      setIsLoading(true);

      await axios.post('/api/register', {
        email,
        name,
        username,
        password,
        adminCode,
        position
      });

      toast.success('Account created.');

      signIn('credentials', {
        email,
        password
      });
    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong. ');
    } finally {
      setIsLoading(false);
    }
  }, [email, name, password, adminCode, position]);
  return (
    <div className=" bg-gray-100 min-h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white  flex  md:flex-row rounded-3xl">
        <div className="md:flex justify-center items-center flex-col my-16 md:my-20 md:mx-12">
          <h1 className="text-4xl text-[#201950] font-bold hidden md:block">
            Aleo-Voice
          </h1>
          <div className="md:pt-8 pt-14 absolute md:relative  opacity-90 md:opacity-100">
            <Image
              src="/asset/Ecommerce.png"
              alt="eccomerce"
              width="360"
              height="360"
            />
          </div>
        </div>
        <div className="border border-solid border-r border-gray-300 my-10 hidden md:block"></div>
        <div className="flex justify-center flex-col items-center px-6 py-6">
          <h1 className="text-3xl text-[#201950] font-bold block md:hidden">
            Aleo-Voice
          </h1>
          <h1 className="text-2xl font-semibold mb-4 mt-3 md:mb-3 md:mt-1">
            Register
          </h1>
          <div className="relative opacity-75">
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="FullName"
            />
            <Input
              onChange={(e) => setUserName(e.target.value)}
              value={username}
              placeholder="FullName"
            />
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
            <Input
              onChange={(e) => setRePassword(e.target.value)}
              value={repassword}
              type="password"
              placeholder="Re-retyped pssword"
            />
            {password != repassword && (
              <p className=" text-xs text-black">Password does not match</p>
            )}
            <Input
              onChange={(e) => setAdminCode(e.target.value)}
              value={adminCode}
              placeholder="Admin-code"
            />
            <Input
              onChange={(e) => setPosition(e.target.value)}
              value={position}
              placeholder="Position"
            />
            <Input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Address"
            />
          </div>
          <button
            disabled={isLoading}
            onClick={onSubmit}
            className=" cursor-pointer bg-[#201950] rounded-3xl text-lg py-3 mt-4 w-full text-center text-white"
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

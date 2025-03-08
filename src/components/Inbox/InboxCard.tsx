import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InboxCardInterface } from '../../types';

interface InboxCardProps {
  routes: InboxCardInterface[];
}

const InboxCard: FC<InboxCardProps> = ({ routes }) => {
  const router = useRouter();

  return (
    <div>
      <ul className="flex flex-col  inboxCard">
        {routes.map((page) => (
          <li key={page.name} className={`border-b border-[#E2E8F0]`}>
            <button className={`flex items-center gap-2`}>
              <img
                src="/vercel.svg"
                className="w-[40px] h-[40px] rounded-full bg-gray-400 object-cover "
                alt=""
              />
              <div className='text-left'>
                <h4> {page.name}</h4>

                <p className='text-xs font-normal text-gray-500'> {page.msg}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InboxCard;

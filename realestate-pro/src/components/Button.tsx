import React from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant='primary', className, children, ...props }: Props) {
  const base = 'px-4 py-2 rounded-xl font-medium transition-all focus:outline-none';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_200%] animate-gradientShift text-white text-lg shadow-lg animate-glow',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 hover:text-white hover:bg-white/20'
  } as const;
  return <button className={clsx(base, variants[variant], className)} {...props}>{children}</button>;
}

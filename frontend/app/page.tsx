"use client";
import Loading from '@/components/Loading/Loading'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/learn');
  }, []);
  return (
    <>
    <Loading />
    </>
  )
}

export default Page

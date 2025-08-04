'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ChatbotEditPage() {
  const router = useRouter();
  const params = useParams();
  const chatbotId = params?.id as string;

  useEffect(() => {
    // Redirect to the identity page as the default
    router.replace(`/chatbot/${chatbotId}/identity`);
  }, [router, chatbotId]);

  return null; // This page will redirect immediately
}
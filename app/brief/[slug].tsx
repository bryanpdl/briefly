import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getBriefData } from '@/utils/dataStore';

interface BriefData {
  projectName: string;
  content: string;
}

const BriefPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [briefData, setBriefData] = useState<BriefData | null>(null);

  useEffect(() => {
    const fetchBriefData = async () => {
      if (slug) {
        const data = await getBriefData(slug as string);
        if (data) {
          setBriefData(data);
        }
      }
    };
    fetchBriefData();
  }, [slug]);

  if (!briefData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl mb-8 font-bold">briefly.</h1>
        <h2 className="text-3xl mb-4 font-semibold">{briefData.projectName}</h2>
        <div className="brief-container">
          <p className="brief-paragraph">{briefData.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BriefPage;
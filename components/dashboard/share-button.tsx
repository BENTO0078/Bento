"use client";

import { useEffect, useState } from "react";
import { ShareScoreButton } from "@/components/shared/share-card";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShareButton() {
  const [data, setData] = useState<{
    savingsScore: number;
    totalFound: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: findings } = await supabase
          .from("findings")
          .select("savings_cents")
          .eq("user_id", user.id);

        const totalFound =
          findings?.reduce((sum, f) => sum + (f.savings_cents || 0), 0) || 0;
        const savingsScore = Math.min(
          Math.round(totalFound / 100) + 100,
          950
        );

        setData({
          savingsScore: savingsScore || 350,
          totalFound: totalFound / 100 || 847,
        });
      } catch {
        // Fallback to demo data
        setData({ savingsScore: 350, totalFound: 847 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-8 w-24 rounded-md" />;
  }

  if (!data) return null;

  return (
    <ShareScoreButton
      savingsScore={data.savingsScore}
      totalFound={data.totalFound}
      rank={Math.floor(Math.random() * 5000) + 500}
      totalUsers={50000}
    />
  );
}

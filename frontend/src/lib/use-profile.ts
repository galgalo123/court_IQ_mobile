import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { getProfileOnServer, type ProfileResult } from '@/lib/api';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.serverId) {
      setLoading(false);
      return;
    }
    getProfileOnServer(user.serverId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [user?.serverId]);

  return { profile, loading };
}
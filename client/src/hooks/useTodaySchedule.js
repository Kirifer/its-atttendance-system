import { useEffect, useState } from "react";
import { getMe } from "../api/auth";

export default function useTodaySchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const me = await getMe();
        setSchedule(me.todaySchedule);
        localStorage.setItem("user", JSON.stringify(me));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { schedule, loading };
}

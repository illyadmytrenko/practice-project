import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ScheduleContext = createContext(null);

export function ScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios
      //.get("http://localhost:5050/api/schedule")
      .get("http://localhost:5000/api/schedule")
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error("Помилка при завантаженні розкладу:", err));
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedule }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useMovies must be used inside MoviesProvider");
  return context;
}

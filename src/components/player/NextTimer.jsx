import { useEffect, useState } from "react";
import { updateTimestampServer, getTimestampServer } from "../../services/firebaseRealtime";

function NextTimer() {
  const [countDown, setCountDown] = useState();
  const [countDownTitle, setCountDownTitle] = useState();
  const [serverDate, setServerDate] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      while (isMounted) {
        try {
          await updateTimestampServer();
          // Ottieni il timestamp dal server
          const ts = await getTimestampServer();
          const date = new Date(ts);
  
          if (isMounted) {
            setServerDate(date);
          }
  
          // Uscire dal ciclo se ok
          break;
  
        } catch (error) {
          console.error("Error fetching server date from Firebase:", error);
  
          // Aspetta e riprova
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    let today = new Date(serverDate);
    let current = new Date(serverDate);
    let countDownDate = current.setHours(23, 59, 59, 999);

    let lastMinute = 0;

    let interval = setInterval(function () {
      console.debug("");
      console.debug("===== SERVER TIMER NEXT ====");

      let timeLeft = countDownDate - today.getTime();

      if (timeLeft >= 0) {
        let hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        const result = hours + ":" + minutes + ":" + seconds;
        setCountDown(result);

        console.debug(hours + " ore " + minutes + " min " + seconds + " sec");

        if (lastMinute !== minutes) {
          const resultDetailed = hours + " ore " + minutes + " minuti ";
          setCountDownTitle(resultDetailed);
          lastMinute = minutes;
        }
      }

      if (timeLeft < 0) {
        clearInterval(interval);
        setTimeout(() => {
          window.location.reload(true);
        }, 5000);
      }

      today.setSeconds(today.getSeconds() + 1);
      setServerDate(today);
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [serverDate]);

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-6 mx-3">
        <div className="text-center text-custom-line text-sm">
          Prossimo Heardle in:{" "}
        </div>
        <div
          className="tracking-widest text-lg font-semibold"
          title={countDownTitle}
        >
          {countDown}
        </div>
      </div>
    </>
  );
}

export default NextTimer;

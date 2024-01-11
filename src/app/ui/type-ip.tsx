"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";

import { clsx } from "clsx";
import { useTimer } from "react-timer-hook";

type Status = "idle" | "typing" | "finished";

export default function TypeIP() {
  const [status, setStatus] = useState<Status>("idle");
  const [ipList, setIPList] = useState<string[]>([]);
  const [typedIP, setTypedIP] = useState("");
  const [amountTyped, setAmountTyped] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  {
    /* The [] at the end of useEffect makes this a function that runs
    when the component is mounted and only once */
  }
  useEffect(() => {
    setIPList(getRandonIP(6));
  }, []);

  //Tiemr of 30 seconds
  const timerDefaultSeconds = 30;
  const time = new Date();
  time.setSeconds(time.getSeconds() + timerDefaultSeconds);

  const appTimer = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => handleFinish(),
  });

  function handleStart() {
    setStatus("typing");
    appTimer.start();
    if (inputRef.current != null) {
      inputRef.current.focus();
    }
  }

  function handleFinish() {
    setStatus("finished");
    appTimer.pause();
    setTimeout(() => {
      if (inputRef.current != null) {
        inputRef.current.blur();
      }
    }, 1);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    {
      setTypedIP(event.target.value.replace(",", "."));

      if (event.target.value === ipList[amountTyped]) {
        setIPList([...ipList, getRandonIP(1)[0]]);
        setTypedIP("");
        setAmountTyped(amountTyped + 1);
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const pressedKey = event.key.replace(",", ".");
    if (pressedKey !== ipList[amountTyped][typedIP.length]) {
      event.preventDefault();
    } else if (event.key === ipList[amountTyped][0] && typedIP.length === 0) {
      handleStart();
    }
  }

  function handleInputBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (status !== "finished") {
      event.target.focus();
    }
  }

  function getRandonIP(quant: number): string[] {
    let randList = [];
    const min = 0;
    const max = 255;
    for (let i = 0; i < quant; i++) {
      let temp: string = "";
      for (let i = 0; i < 5; i++) {
        temp += (Math.floor(Math.random() * (max - min + 1)) + min).toString();
        temp += ".";
      }
      randList.push(temp.slice(0, -1));
    }
    return randList;
  }

  function handleReset() {
    setAmountTyped(0);
    setIPList(getRandonIP(6));
    setStatus("idle");
    setTypedIP("");
    const time = new Date();
    time.setSeconds(time.getSeconds() + timerDefaultSeconds);
    appTimer.restart(time, false);
  }

  return (
    <div className="text-dracula-blue select-none flex flex-col items-center w-fit min-w-[420px] bg-gradient-to-b from-dracula-blue via-dracula-blue to-dracula/40 text-transparent bg-clip-text ">
      <div
        className={clsx(
          "text-2xl text-dracula columns-2 w-full flex justify-center ",
          {
            "text-dracula-green": status === "finished",
          }
        )}
      >
        <div
          className={clsx("text-center p-1 w-20", {
            "border-dracula-green": status === "finished",
          })}
        >
          Score
        </div>
        <div
          className={clsx("text-center p-1 w-20 ", {
            "border-dracula-green": status === "finished",
          })}
        >
          Time
        </div>
      </div>
      <div
        className={clsx(
          "text-2xl text-dracula columns-2 w-full flex justify-center",
          {
            "text-dracula-green": status === "finished",
          }
        )}
      >
        <div
          className={clsx(
            "text-center p-1 w-20 rounded-l-lg bg-dracula-blue/30",
            {
              "border-dracula-green border-2 border-r-0": status === "finished",
            }
          )}
        >
          {amountTyped}
        </div>
        <div
          className={clsx(
            "text-center p-1 w-20 rounded-r-lg bg-dracula-blue/30 ",
            {
              "border-dracula-green border-2 border-l-0": status === "finished",
            }
          )}
        >
          {appTimer.seconds}s{" "}
        </div>
      </div>

      {status === "finished" && (
        <button
          className="m-5 w-24 p-2 text-dracula-green border-dracula border-2 rounded-lg"
          onClick={handleReset}
        >
          Try Again!
        </button>
      )}

      <div className="flex flex-col-reverse text-center w-full h-36 leading-none bg-gradient-to-b from-dracula/60 via-dracula/70 to-dracula text-transparent bg-clip-text">
        {ipList
          .slice(0, amountTyped)
          .reverse()
          .slice(0, 5)
          .map((ip, x) => {
            const sizes = [42, 32, 24, 19, 14];
            return (
              <p key={ip} className={""} style={{ fontSize: `${sizes[x]}px` }}>
                {ip}
              </p>
            );
          })}
      </div>
      <div className="relative z-0">
        <label
          htmlFor="inputTyper"
          className="text-left text-[60px] text-dracula-blue leading-none"
        >
          {ipList[amountTyped]}
        </label>
        <input
          id="inputTyper"
          className="text-[60px] text-left focus:border-y-dracula text-dracula pointer-events-none hover:pointer-events-none focus:pointer-events-none focus:border-b-2 caret-transparent outline-none h-full w-full bg-transparent box-border leading-none absolute top-0 left-0 z-10"
          value={typedIP}
          disabled={status === "finished"}
          autoComplete="off"
          autoCorrect="off"
          autoFocus={true}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          ref={inputRef}
        ></input>
      </div>
      <div className="flex flex-col text-center w-full leading-none">
        {ipList.slice(amountTyped + 1).map((ip, x) => {
          const sizes = [42, 32, 24, 19, 14];
          return (
            <p key={ip} className={`p-1`} style={{ fontSize: `${sizes[x]}px` }}>
              {ip}
            </p>
          );
        })}
      </div>
    </div>
  );
}

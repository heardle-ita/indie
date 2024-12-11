import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import GamePlayground from "./GamePlayground";
import GameResult from "./GameResult";
import { useGameData } from "./GameContext";
import MusicPlayer from "../music/MusicPlayer";
import { checkAnswer, merge } from "../../services/function";
import { ActionMeta, InputAction, InputActionMeta, OnChangeValue, SingleValue } from "react-select";
import { SongConfig } from "../../types/interfaces/song";
import { getList } from "../../services/spotifyService";
import { getUserByUid, updateUserByUid } from "../../services/firebaseRealtime";
import { buildScore } from "../../services/function";
import { SongOption } from "../../types/interfaces/options";
import { Subject, debounceTime, distinctUntilChanged, filter, map, tap } from "rxjs";
import Select from "react-select";


function PlayerContainer({
  songConfig,
  accessToken,
  date,
}: {
  songConfig: SongConfig;
  accessToken: string;
  date: string;
}) {

  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(false);

  let inputSubject = new Subject<string>()

  const {
    dispatch,
    state: { openedStep, finished, guessList },
  } = useGameData();


  useEffect(() => {
    inputSubject.pipe(
      debounceTime(750),
      filter((v: string) => v.length > 1),
      tap(() => setLoading(true)),
      distinctUntilChanged()
    ).subscribe(async (v: string) => {
      let result: SongOption[] = await getList(accessToken, v);

      if(selectedOption.length != 0) 
        result = merge(selectedOption, result)
      
      setSelectedOption(result)
      setLoading(false);
    })
  })

  const onSkipClicked = () => {
    dispatch({ type: "SKIP", payload: { step: openedStep } });
  };

  const onSendClicked = () => {
    if (!answer) {
      return;
    }

    let win = checkAnswer(songConfig, answer);
    console.debug("checkAnswer ", win);

    if (win) {
      dispatch({
        type: "SUBMIT-CORRECT",
        payload: { step: openedStep, answer: answer },
      });
      updateScore();
    } else {
      dispatch({
        type: "SUBMIT-WRONG",
        payload: { step: openedStep, answer: answer },
      });
    }

    setAnswer("");
  };

  const onFinishClicked = () => {
    dispatch({ type: "FINISH" });
    updateScore();
  };

  const loadOption = (inputValue: string) => {
    inputSubject.next(inputValue.trim())
  }

  const handleChange = (newValue: SingleValue<SongOption>, actionMeta: ActionMeta<SongOption>) => {
    if (newValue) {
      console.debug("value:", newValue.value);
      setAnswer(newValue.value);
    }
  };

  const updateScore = async () => {
    const uid = localStorage.getItem("uid");
    let points = buildScore(guessList);
    let user = (await getUserByUid(uid)).val();
    user.score = user.score + points;
    if (uid != null) updateUserByUid(uid, user.score);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #1E9102" : "1px solid black",
      boxShadow: state.isFocused ? "0 0 0 1px #1E9102" : "none",
      "&:hover": {
        border: "0 0 0 2px solid #1E9102",
      },
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1E9102"
        : state.isFocused
        ? "lightgreen"
        : "white",
      color: "black",
      border: "1px solid #4F4F4F" 
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: "black",
    }),
    noOptionsMessage: (provided: any, state: any) => ({
      ...provided,
      color: "red",
    }),
    loadingMessage: (provided: any, state: any) => ({
      ...provided,
      color: "black",
    }),
    menuList: (provided: any, state: any) => ({
        ...provided,
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4F4F4F"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "black"
        },
        "&::-webkit-scrollbar-corner": {
          backgroundColor: "black"
        },
        scrollbarColor: "#4F4F4F black",
        scrollbarWidth: "thin"
      })
  };

  const options = [
    { value: "blues", label: "Blues" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "orchestra", label: "Orchestra" },
  ];

  return (
    <>
      {finished ? <GameResult songConfig={songConfig} date={date} /> : <GamePlayground />}
      <MusicPlayer songConfig={songConfig} />
      {finished === false && (
        <div className="max-w-screen-sm w-full mx-auto flex-col">
          <div className="m-3 mt-0">
            <div>
              <div className="">
                <div className="autoComplete_wrapper" role="form">
                  <Select
                    menuPlacement="top"  
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    isLoading={loading}
                    loadingMessage={() => 'Ricerca in corso...'}
                    noOptionsMessage={() => 'Nessuna Corrispondenza'}
                    placeholder={"La conosci? Cerca per artista/titolo"}
                    options={selectedOption}
                    blurInputOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={customStyles}
                    onChange={handleChange}
                    onInputChange={loadOption}
                    maxMenuHeight={200}
                    isClearable
                  />
                </div>
              </div>
              <div className="flex justify-between pt-3">
                {openedStep < songConfig.breaks.length - 1 && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest bg-custom-mg border-none flex items-center font-semibold text-sm rounded"
                    type="submit"
                    onClick={onSkipClicked}
                  >
                    Salta
                  </button>
                )}
                {openedStep === songConfig.breaks.length - 1 && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest bg-custom-mg border-none flex items-center font-semibold text-sm rounded"
                    type="submit"
                    onClick={onFinishClicked}
                  >
                    Non la so
                  </button>
                )}
                {openedStep < songConfig.breaks.length && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm rounded bg-custom-positive"
                    type="submit"
                    onClick={onSendClicked}
                  >
                    Conferma
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlayerContainer;

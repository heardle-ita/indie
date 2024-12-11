import * as React from 'react';
import { getDayStr } from '../../services/function';

const GameContext = React.createContext();

let DEFAULT_TODAY_GUEST_LIST = [{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
},
{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
},
{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
},
{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
},
{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
},
{
    isCorrect: false,
    isSkipped: false,
    answer: "",
    count: 0,
}];

const MAX_GUESS_INDEX = 5;

const initState = {
    date: getDayStr(),
    guessList: DEFAULT_TODAY_GUEST_LIST, 
    lastStep: 0,
    openedStep: 0,
    fails: 0,
    finished: false
}


function saveState(state) {

    localStorage.setItem("Game", JSON.stringify(state));
  
}

function loadState() {

    let state = localStorage.getItem("Game");

    if(state) {
        return JSON.parse(state);
    }
    
    return initState;
}


function modalReducer(state, action) {
    let latestState = state;
    let day = getDayStr();

    switch (action.type) {
        case 'SKIP': {
            let guessList = state.guessList;
            let lastStep = state.lastStep;
            let openedStep = state.openedStep;
            let fails = state.fails;

            guessList[lastStep].isSkipped = true;

            let finished = state.finished;
            if (lastStep !== MAX_GUESS_INDEX) {
                lastStep = lastStep + 1
            } else {
                fails = fails + 1;
                finished = true
            }

            latestState = {
                ...state,
                date: day,
                guessList: guessList,
                lastStep: lastStep,
                openedStep: openedStep + 1,
                finished: finished,
                fails: fails
            }
            break
        }
        case 'SUBMIT-WRONG': {
            let guessList = state.guessList;
            let lastStep = state.lastStep;
            let openedStep = state.openedStep;
            let fails = state.fails;
            
            
            guessList[lastStep].answer = action.payload.answer;

            let finished = state.finished;
            if (lastStep !== MAX_GUESS_INDEX) {
                lastStep = lastStep + 1
            } else {
                fails = fails + 1;
                finished = true

            }

            latestState = {
                ...state,
                date: day,
                guessList: guessList,
                lastStep: lastStep,
                finished: finished,
                fails: fails,
                openedStep: openedStep + 1
            }
            break
        }
        case 'SUBMIT-CORRECT': {
            let guessList = state.guessList;
            let lastStep = state.lastStep;
            let openedStep = state.openedStep;
            
            guessList[lastStep].count = guessList[lastStep].count+1;
            guessList[lastStep].isCorrect = true;
            guessList[lastStep].answer = action.payload.answer;
            
            if (lastStep !== MAX_GUESS_INDEX) {
                lastStep = lastStep + 1
            }

            latestState = {
                ...state,
                date: day,
                guessList: guessList,
                lastStep: lastStep + 1,
                openedStep: openedStep + 1,
                finished: true
            }
            break
        }
        case 'FINISH': {
            let guessList = state.guessList;
            let fails = state.fails;

            guessList[MAX_GUESS_INDEX].isSkipped = true;
            fails = fails + 1;
    

            latestState = {
                ...state,
                guessList: guessList,
                lastStep: MAX_GUESS_INDEX,
                finished: true,
                fails: fails
            }
            break
        }
        case 'RESET': {
            let guessList = state.guessList;
            //load from localstorage
            for(let i = 0; i <= MAX_GUESS_INDEX; i++) {
                guessList[i].isCorrect=false;
                guessList[i].isSkipped=false;
                guessList[i].answer = ""
            }
            latestState = {
                ...state,
                guessList: guessList,
                lastStep: 0,
                openedStep: 0,
                finished: false
            }
            break
        }
        case 'SAVE': {
            //load from localstorage
            latestState = {
                ...state
            }
            break
        }
        default: {
            console.error(`Unhandled action type: ${action.type}`)
            latestState = {
                guessList: DEFAULT_TODAY_GUEST_LIST,
                lastStep: 0,
                openedStep: 0,
                finished: false,
                fails: fails
            }
            break
        }
    }

    saveState(latestState);

    return latestState;
}

function GameContextProvider({ date, children }) {

    //load from localstorage
    const [state, dispatch] = React.useReducer(modalReducer, loadState())
    const value = {state, dispatch}
    React.useEffect(() => {
          if(date.replaceAll("/","").localeCompare(state.date) != 0)
            dispatch({type: 'RESET'})  
    },[])
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

function useGameData() {
    const context = React.useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGameData must be used within a GameContextProvider')
    }
    return context
}


export { GameContextProvider, useGameData }
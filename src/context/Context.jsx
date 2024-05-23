import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [userInput, setUserInput] = useState(''); //To save the user input
    const [recentPrompt, setRecentPrompt] = useState(''); //when send button clicked, input field data will be saved and display it in main component.
    const [prevPrompts,setPrevPrompts] = useState([]); //To store input history and to show it in recent tab.
    const [showResult, setShowResult] = useState(false); //once true, it will hide greeting text, cards and will display the result.
    const [loading, setLoading] = useState(false); //when true will show loading animation, after getting data will make it false.
    const [resultData, setResultData] = useState(''); //to display result on the webpage.

    const delayAns = (index,nextWord) => {
        setTimeout(() => {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {

        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined){
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else{
            setPrevPrompts(pre=>[...pre,userInput]);
            setRecentPrompt(userInput);
            response=await runChat(userInput);
        }
        
        let responseArray = response.split('**');
        let newResponse='';
        for(let i=0; i < responseArray.length;i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            } else{
                newResponse += '<b>'+responseArray[i]+'</b>';
            }
        }
        let newResponse2 = newResponse.split('*').join('</br>');
        //setResultData(newResponse2);
        let newResponseArray = newResponse2.split(' ');
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayAns(i,nextWord+' ');
        }
        setLoading(false);
        setUserInput('');
    }

    //onSent('who is the prime minister of india?')
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        userInput,
        setUserInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
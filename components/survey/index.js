import {useEffect, useState} from "react";
import ACard from "../organisms/ACard";
import surveyData from "./surveyData.json"
import Form from "../molecules/form";
import styles from './survey.module.css'

export default function Survey() {

    const [startedSurvey, setStartedSurvey] = useState();
    const defaultValue = '';
    const secondsLefToBlinkFaster = 3;
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [currentTime, setCurrentTime] = useState(0);
    const [canContinue, setCanContinue] = useState();
    const [selectedValue, setSelectedValue] = useState(defaultValue);


    const nextQuestion = () => {
        if(!startedSurvey){
            setStartedSurvey(true);
        }
        const nextPos = currentQuestion + 1;
        setCurrentQuestion(nextPos);
        setCurrentTime(surveyData.questions[nextPos]?.lifetimeSeconds);
        setSelectedValue(defaultValue);
        setCanContinue(false);
    }

    useEffect(()=>{
        if(currentTime){
            const interval = setInterval(() => {
                setCurrentTime(currentTime => currentTime - 1);
            }, 1000);
            return () => {
                clearInterval(interval);
                if((currentTime - 1) === 0){
                    nextQuestion();
                }
            }
        }
    }, [currentTime]);


    return (
        <>
        {startedSurvey ?
            <ACard img={surveyData.questions[currentQuestion]?.image}
                   onClick={nextQuestion}
                   buttonText={'Continue'}
                   disabled={!canContinue}
                   hint={{
                       text: `${currentTime} seconds left`,
                       style: currentTime > secondsLefToBlinkFaster ? styles.blink : styles.blinkFast
                   }}
            >
                <Form
                    selectedValue={selectedValue}
                    changeSelectedValue={setSelectedValue}
                    defaultValue={defaultValue}
                    questionData={surveyData.questions[currentQuestion]}
                    setCanContinue={setCanContinue}/>
            </ACard>
        :
            <ACard title={surveyData.title}
                   img={surveyData.image}
                   imgStyle={{objectFit: 'contain'}}
                   buttonText={'Start Survey'}
                   onClick={nextQuestion}
                   label={'You will have some seconds to answer each question, before automatically continuing.'}
                   hint={{text: `Here you will see your seconds left.`}}
            />
        }
        </>
    )
}

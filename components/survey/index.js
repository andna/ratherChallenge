import React, {useEffect, useState} from "react";
import ACard from "../organisms/ACard";
import surveyData from "./surveyData.json"
import Form from "../molecules/form";
import styles from './survey.module.css'

export default function Survey({submit}) {

    const [startedSurvey, setStartedSurvey] = useState();
    const defaultValue = '';
    const secondsLefToBlinkFaster = 3;
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [currentTime, setCurrentTime] = useState(0);
    const [canContinue, setCanContinue] = useState();
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [finishedSurvey, setFinishedSurvey] = useState();


    const nextQuestion = () => {
        if(!startedSurvey){
            setStartedSurvey(true);
        }
        const nextPos = currentQuestion + 1;
        if(nextPos < surveyData.questions.length){
            setCurrentQuestion(nextPos);
            setCurrentTime(surveyData.questions[nextPos]?.lifetimeSeconds);
            setSelectedValue(defaultValue);
            setCanContinue(false);
        } else {
            setFinishedSurvey(true);
        }
    }

    useEffect(()=>{
        if(currentTime){
            const interval = setInterval(() => {
                setCurrentTime(currentTime => currentTime - 1);
            }, 1000);
            return () => {
                clearInterval(interval);
                if((currentTime - 1) === 0){
                    setAnswer();
                }
            }
        }
    }, [currentTime]);

    const setAnswer = () => {
        surveyData.questions[currentQuestion].answer = selectedValue;
        nextQuestion();
    }

    return (
        <>
            {finishedSurvey
                ?
                <ACard
                    title={'🎉 Congratulations!'}
                    label={'You finished your daily survey. Here are your answers:'}
                    buttonText={'Submit to claim tokens'}
                    onClick={() => submit(surveyData.questions)}
                >
                    <ul>
                        {surveyData.questions.map(question => {
                            return <li><b>{question.text}</b> : <i>{question.answer ? question.answer : "\"\""}</i></li>
                        })}
                    </ul>
                </ACard>
                :
                <>
                    {startedSurvey ?
                        <ACard img={surveyData.questions[currentQuestion]?.image}
                               onClick={setAnswer}
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
                            //If you don’t select any answer before the time runs out, your answer will be submitted as blank/incorrect.
                               hint={{text: `Here you will see your seconds left.`}}
                        />
                    }
                </>
            }
        </>
    )
}

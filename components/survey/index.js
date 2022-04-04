import {useState} from "react";
import ACard from "../ACard";
import surveyData from "./surveyData"

export default function Survey() {

    const [startedSurvey, setStartedSurvey] = useState();

    return (
        <>
        {startedSurvey ?
                <div>
                </div>
        :
            <ACard title={surveyData.title}
                   img={surveyData.image}
                   buttonText={'Start Survey'}
                    onClick={()=>setStartedSurvey(true)}
            />
        }
        </>
    )
}

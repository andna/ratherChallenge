import * as React from 'react';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material';
import {useState} from "react";

export default function Form({questionData, setCanContinue, selectedValue, changeSelectedValue, defaultValue}) {

    const handleChange = (ev) => {
        const val = ev.target.value;
        changeSelectedValue(val);
        setCanContinue(val !== defaultValue);
    };


    return (
        <FormControl>
            <FormLabel  id="demo-radio-buttons-group-label">
                <b>{questionData?.text}</b>
            </FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                defaultValue={selectedValue}
                value={selectedValue}
                onChange={handleChange}
            >
                {questionData?.options.map(question => {
                    return <FormControlLabel key={question.text} value={question.text} control={<Radio />} label={question.text} />
                })}
            </RadioGroup>
        </FormControl>
    );
}
